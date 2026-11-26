/* 세특 진단 코어: 프롬프트 생성·응답 검증·마크다운 리포트 (pipeline/prompting.py, report.py 와 동일 형식)
 * 브라우저: SetukCoreFactory(window.SETUK_BUNDLE, scoring) / Node: require(...)(bundle, scoring)
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory;
  else root.SetukCoreFactory = factory;
})(typeof self !== "undefined" ? self : this, function (B, S) {
  const MODE_LABEL = { E: "세특 중심 + 창체·행특", F: "학생부 전체 통합" };
  const INPUT_LABEL = { setuk: "세특", changche: "창체", haengtuk: "행특", grades: "교과 성적", attendance: "출결" };
  const AXES = B.config.axes;
  const v = (x, d = "-") => (x === null || x === undefined || x === "" ? d : String(x));
  const J = (o) => JSON.stringify(o, null, 2);

  /* ---------------- 프롬프트 ---------------- */
  function fill(tpl, vars) {
    let out = tpl;
    for (const [k, val] of Object.entries(vars)) out = out.split("{{" + k + "}}").join(typeof val === "string" ? val : J(val));
    return out;
  }
  function formatProfile(st) {
    st = st || {};
    const cg = st.career_goal || {};
    const goal = [cg.field, cg.major, cg.detail].filter((x) => x).join(" / ");
    const lines = [`- 학년: ${v(st.grade_level, "미입력")}`, `- 교육과정: ${v(st.curriculum, "미입력")} 개정`, `- 희망 진로: ${goal || "미입력"}`];
    if (st.school_type) lines.push(`- 학교 유형: ${st.school_type}`);
    return lines.join("\n");
  }
  function formatRecords(inp, mode) {
    const rec = inp.records || {};
    const out = [];
    for (const s of rec.setuk || []) out.push(`[${s.id}] 세특 | ${v(s.year, "?")}학년 | ${s.subject}\n${s.text}`);
    for (const c of rec.changche || []) out.push(`[${c.id}] 창체-${c.area} | ${v(c.year, "?")}학년\n${c.text}`);
    for (const h of rec.haengtuk || []) out.push(`[${h.id}] 행특 | ${v(h.year, "?")}학년\n${h.text}`);
    if (mode === "F" && (rec.grades || []).length) {
      const rows = ["[교과 성적] 학년-학기 | 과목 | 교과군 | 단위 | 석차등급 | 성취도 | 원점수/평균(표준편차) | 수강자수"];
      for (const g of rec.grades) {
        const rs = g.raw_score !== null && g.raw_score !== undefined ? `${v(g.raw_score)}/${v(g.mean)}(${v(g.sd)})` : "-";
        rows.push(`${v(g.year, "?")}-${v(g.semester, "?")} | ${g.subject} | ${v(g.subject_category)} | ${v(g.units)} | ${v(g.rank_grade)} | ${v(g.achievement)} | ${rs} | ${v(g.students)}`);
      }
      out.push(rows.join("\n"));
    }
    if (mode === "F" && (rec.attendance || []).length) {
      const rows = ["[출결] 학년 | 미인정 결석 | 미인정 지각 | 미인정 조퇴 | 미인정 결과 | 비고"];
      for (const a of rec.attendance) rows.push(`${v(a.year, "?")} | ${v(a.unexcused_absence, "0")} | ${v(a.unexcused_late, "0")} | ${v(a.unexcused_early_leave, "0")} | ${v(a.unexcused_class_absence, "0")} | ${v(a.note, "")}`);
      out.push(rows.join("\n"));
    }
    if ((inp.raw_text || "").trim()) out.push("[원문 붙여넣기]\n" + inp.raw_text.trim());
    return out.length ? out.join("\n\n") : "(입력된 기록 없음)";
  }
  function baseVars(inp, modeInfo) {
    const missing = modeInfo.missing_inputs.map((k) => INPUT_LABEL[k]);
    return {
      RUBRIC: B.rubric, MODE: modeInfo.mode, MODE_LABEL: MODE_LABEL[modeInfo.mode],
      MISSING_INPUTS: missing.length ? missing.join(", ") + " (미입력: 해당 영역은 판단 보류)" : "없음",
      STUDENT_PROFILE: formatProfile(inp.student), RECORDS: formatRecords(inp, modeInfo.mode),
    };
  }
  function buildPrompt(name, vars) {
    const t = B.templates[name];
    return { system: fill(t.system, vars), user: fill(t.user, vars) };
  }
  const asChat = (p) => `${p.system}\n\n---\n\n${p.user}`;

  /* ---------------- 스키마 검증(경량) ---------------- */
  function typeOk(t, x) {
    const ts = Array.isArray(t) ? t : [t];
    return ts.some((tt) => {
      if (tt === "null") return x === null;
      if (tt === "array") return Array.isArray(x);
      if (tt === "object") return x !== null && typeof x === "object" && !Array.isArray(x);
      if (tt === "integer") return Number.isInteger(x);
      if (tt === "number") return typeof x === "number";
      return typeof x === tt;
    });
  }
  function validate(schema, data, path = "$", errs = []) {
    if (errs.length > 30) return errs;
    if (schema.type && !typeOk(schema.type, data)) { errs.push(`${path}: ${[].concat(schema.type).join("|")} 형식이어야 함`); return errs; }
    if (schema.enum && !schema.enum.includes(data)) errs.push(`${path}: 허용값 ${schema.enum.join(", ")} 중 하나여야 함 (현재: ${JSON.stringify(data)})`);
    if (typeof data === "string") {
      if (schema.minLength && data.length < schema.minLength) errs.push(`${path}: 비어 있음`);
      if (schema.pattern && !new RegExp(schema.pattern).test(data)) errs.push(`${path}: 형식 불일치(${schema.pattern})`);
    }
    if (typeof data === "number") {
      if (schema.minimum !== undefined && data < schema.minimum) errs.push(`${path}: ${schema.minimum} 이상이어야 함`);
      if (schema.maximum !== undefined && data > schema.maximum) errs.push(`${path}: ${schema.maximum} 이하여야 함`);
    }
    if (Array.isArray(data)) {
      if (schema.minItems && data.length < schema.minItems) errs.push(`${path}: 최소 ${schema.minItems}개 필요`);
      if (schema.items) data.forEach((d, i) => validate(schema.items, d, `${path}[${i}]`, errs));
    }
    if (data && typeof data === "object" && !Array.isArray(data)) {
      for (const r of schema.required || []) if (!(r in data)) errs.push(`${path}.${r}: 필수 항목 누락`);
      for (const [k, sub] of Object.entries(schema.properties || {})) if (k in data) validate(sub, data[k], `${path}.${k}`, errs);
    }
    return errs;
  }
  const validateStep = (name, data) => validate(B.schemas[name], data);

  /* 근거 무결성 점검: seg_id 존재, 인용문이 원문에 있는지, 1·2단계 기록 ID 일치 */
  function checkEvidence(inp, s1, s2) {
    const warn = [];
    const norm = (t) => (t || "").replace(/\s+/g, "").replace(/[‘’'"“”]/g, "");
    const src = norm([].concat((inp.records || {}).setuk || [], (inp.records || {}).changche || [], (inp.records || {}).haengtuk || []).map((r) => r.text).join(" ") + (inp.raw_text || ""));
    const segs = {};
    for (const r of (s1 && s1.records) || []) for (const sg of r.segments || []) {
      segs[sg.seg_id] = sg.text;
      if (src && !src.includes(norm(sg.text))) warn.push(`1단계 ${sg.seg_id}: 원문에 없는 문장(요약·변형 의심)`);
    }
    if (s2) {
      const ids1 = new Set(((s1 && s1.records) || []).map((r) => r.record_id));
      for (const rs of s2.record_scores || []) {
        if (s1 && !ids1.has(rs.record_id)) warn.push(`2단계 ${rs.record_id}: 1단계에 없는 기록 ID`);
        for (const [k, a] of Object.entries(rs.axes || {})) {
          for (const e of a.evidence || []) if (s1 && !segs[e]) warn.push(`2단계 ${rs.record_id}.${k}: 존재하지 않는 근거 ${e}`);
          if (a.quote && src && !src.includes(norm(a.quote))) warn.push(`2단계 ${rs.record_id}.${k}: 인용문이 원문과 다름 "${a.quote.slice(0, 30)}"`);
        }
      }
    }
    return warn;
  }

  /* ---------------- 마크다운 리포트 ---------------- */
  const axisLabel = (x) => (AXES[x] ? `${x} ${AXES[x].name}` : { career: "진로역량", academic: "학업역량", community: "공동체역량" }[x] || x);
  const esc = (t) => String(t || "").split("|").join("\\|");
  function toMarkdown(inp, s1, s2, s3, res) {
    const st = inp.student || {}, cg = st.career_goal || {};
    const mode = res.mode.mode, L = [];
    L.push("# 세특 진단 리포트", "");
    L.push(`- 분석 모드: ${mode} (${mode === "F" ? "학생부 전체 통합" : "세특 중심 + 창체·행특"})`);
    L.push(`- 학생: ${v(st.grade_level)} / ${v(st.curriculum)} 개정 / 희망 진로 ${cg.major || cg.field || "-"}`);
    if (res.mode.missing_inputs.length) L.push(`- 미입력 영역: ${res.mode.missing_inputs.map((k) => INPUT_LABEL[k] || k).join(", ")} (해당 영역은 판단 보류)`);
    L.push(`- 루브릭 버전: ${B.config.version}`, "");
    const c = res.competency;
    L.push("## 역량 요약", "", "| 역량 | 점수 | 등급 | 비고 |", "|---|---|---|---|");
    L.push(`| 학업역량 | ${v(c.academic.score)} | ${v(c.academic.grade)} | 교과 그 자체의 깊이(진로 무관) |`);
    L.push(`| 진로역량 | ${v(c.career.score)} | ${v(c.career.grade)} | ${c.career.note || "진로 관련 교과의 깊이 + 연결 방식"} |`);
    L.push(`| 공동체역량 | ${v(c.community.score)} | ${v(c.community.grade)} | ${c.community.note || "역할→행동→영향·성장→소통"} |`, "");
    const s1map = {}, s2map = {};
    for (const r of (s1 && s1.records) || []) s1map[r.record_id] = r;
    for (const r of (s2 && s2.record_scores) || []) s2map[r.record_id] = r;
    for (const r of res.records) {
      const a = s1map[r.record_id] || {}, b = s2map[r.record_id] || {};
      L.push(`## ${r.record_id} ${a.subject_or_area || ""} — 최종 ${r.final_grade} (${r.total}점)`, "");
      L.push(`기본 ${r.base}점 − 감점 ${r.penalty}점 = ${r.total}점 → ${r.grade_by_score}` + (r.gates.length ? `, 상한 규칙 ${r.gates.join(", ")} 적용 → ${r.final_grade}` : ", 상한 규칙 해당 없음"));
      if (r.llm_mismatch) L.push(`(참고: 모델 예상 등급 ${r.llm_grade}와 코드 계산 등급이 다름. 코드 계산을 최종으로 함)`);
      for (const lg of r.log) L.push(`- ${lg}`);
      L.push("", "| 축 | 등급 | 근거 | 판정 이유 |", "|---|---|---|---|");
      for (const k of Object.keys(AXES)) {
        const ax = (b.axes || {})[k] || {};
        L.push(`| ${k} ${AXES[k].name} | ${r.axes_final[k]} | ${(ax.evidence || []).join(", ")} "${esc(ax.quote)}" | ${esc(ax.reason)} |`);
      }
      L.push("");
      const sp = a.structure_presence || {};
      L.push("구조 사슬: " + ["동기", "과정", "심화", "배운점"].map((k) => `${k}(${sp[k] || "-"})`).join(" → "), "");
      if ((b.penalties || []).length) {
        L.push("감점 요인");
        for (const p of b.penalties) L.push(`- ${p.code} ${(B.config.penalties[p.code] || {}).name || ""} (${p.severity}, ${p.seg_id || ""}): ${p.reason || ""}`);
        L.push("");
      }
      if ((b.missing_links || []).length) { L.push("끊어진 고리"); for (const m of b.missing_links) L.push(`- ${m.between}: ${m.diagnosis}`); L.push(""); }
      if ((b.strengths || []).length) { L.push("강점"); for (const s of b.strengths) L.push(`- ${s.point} (${(s.evidence || []).join(", ")})`); L.push(""); }
      if ((b.weaknesses || []).length) { L.push("약점"); for (const w of b.weaknesses) L.push(`- ${w.point} → 확인할 수 없는 것: ${w.cannot_verify || ""} (${(w.evidence || []).join(", ")})`); L.push(""); }
      const cl = a.career_link;
      if (cl) L.push(`진로 연계: 과목 관련성 ${cl.subject_relevance}, 연결 방식 ${cl.link_type}. ${cl.comment || ""}`, "");
    }
    if (res.gpa) {
      const g = res.gpa;
      L.push("## 내신 평균", "");
      L.push(`- 전 과목(석차등급, ${g.scale}등급제): ${v(g.all)} / 국영수사과한국사: ${v(g.core)} / 반영 단위 ${g.ranked_units}`);
      L.push(`- 학기별: ${Object.entries(g.by_term).map(([k, x]) => `${k} ${x}`).join(", ")}`);
      const ach = Object.entries(g.achievement_only_counts);
      if (ach.length) L.push(`- 성취도 과목 분포: ${ach.map(([k, x]) => `${k} ${x}개`).join(", ")}`);
      L.push("");
    }
    if (res.attendance) {
      const at = res.attendance;
      L.push("## 출결(성실성)", "");
      L.push(`- 미인정 합계 ${at.unexcused_total}회(결석 ${at.unexcused_absence_days}일) → ${at.level}` + (at.integrity_cap ? `, 공동체(성실성) 상한 ${at.integrity_cap}` : ""));
      L.push("- 이 구간 기준은 대학 공식 기준이 아니라 이 도구의 보수적 휴리스틱이다.", "");
    }
    if (s2 && s2.overall_comment) L.push("## 종합 진단", "", s2.overall_comment, "");
    if (s3) {
      L.push("## 보완 우선순위", "");
      for (const p of s3.priority_gaps || []) L.push(`- [${axisLabel(p.target_axis)}] ${p.gap} — ${p.why_first || ""}`);
      L.push("", "## 추천 후속 탐구", "");
      (s3.follow_up_topics || []).forEach((t, i) => {
        L.push(`### ${i + 1}. ${t.title}`, "");
        L.push(`- 보완 축: ${(t.fills_gap || []).map(axisLabel).join(", ")} / 난이도: ${t.difficulty || "-"}`);
        L.push(`- 교과 개념: ${t.curriculum_concepts.join(", ")} (${t.curriculum_fit}: ${t.fit_reason || ""})`);
        L.push(`- 탐구 질문: ${t.inquiry_question}`, "- 방법:");
        t.method_steps.forEach((m, j) => L.push(`  ${j + 1}. ${m}`));
        L.push(`- 산출물: ${t.expected_output || "-"}`, `- 진로 연결: ${t.career_link || "-"}`, "");
      });
      if ((s3.academic_keywords || []).length) {
        L.push("## 학술 검색 키워드", "", "| 한글 | 영문 | 검색처 | 용도 |", "|---|---|---|---|");
        for (const k of s3.academic_keywords) L.push(`| ${k.ko} | ${k.en} | ${k.where || ""} | ${k.use || ""} |`);
        L.push("");
      }
      if ((s3.books || []).length) { L.push("## 참고 도서", ""); for (const b of s3.books) L.push(`- 『${b.title}』 ${b.author || ""} — ${b.why || ""} [${b.verify}]`); L.push(""); }
      if ((s3.activity_plans || []).length) { L.push("## 활동 설계", ""); for (const a of s3.activity_plans) L.push(`- ${a.setting}: ${a.plan} (남길 근거: ${a.evidence_to_leave || ""})`); L.push(""); }
      if (s3.two_lines) L.push("## 제출물에 남길 두 줄", "", `- 탐구 전: ${s3.two_lines.before}`, `- 탐구 후: ${s3.two_lines.after}`, "");
      if ((s3.cautions || []).length) { L.push("## 유의 사항", ""); for (const x of s3.cautions) L.push(`- ${x}`); L.push(""); }
    }
    return L.join("\n");
  }

  return { MODE_LABEL, INPUT_LABEL, fill, formatProfile, formatRecords, baseVars, buildPrompt, asChat, validate, validateStep, checkEvidence, toMarkdown };
});
