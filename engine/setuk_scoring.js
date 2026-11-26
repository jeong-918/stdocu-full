/* 세특 진단 루브릭 - 결정론적 계산 모듈 (pipeline/scoring.py 와 동일 로직)
 * 판정(등급)은 LLM, 점수 환산·감점·상한·역량 환산·내신 평균은 코드.
 * 브라우저: window.SetukScoring / Node: module.exports
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory;
  else root.SetukScoringFactory = factory;
})(typeof self !== "undefined" ? self : this, function (CONFIG) {
  const GP = CONFIG.grade_points;
  const ORDER = CONFIG.grade_order; // 낮은 등급 -> 높은 등급
  const AXES = CONFIG.axes;
  const SECTION_HEADERS = ["교과학습발달상황", "석차등급", "출결상황", "창의적 체험활동", "행동특성 및 종합의견", "세부능력 및 특기사항"];
  const idx = (g) => ORDER.indexOf(g);
  const pts = (g) => GP[g] || 0;
  const rnd = (x, n = 1) => { const f = Math.pow(10, n); return Math.floor(x * f + 0.5 + 1e-9) / f; };
  const gmin = (a, b) => (idx(a) <= idx(b) ? a : b);
  const toGrade = (s) => { for (const t of CONFIG.thresholds) if (s >= t.min) return t.grade; return "D"; };
  const nonEmpty = (v) => Array.isArray(v) ? v.length > 0 : !!v;

  function detectMode(inp) {
    const rec = (inp && inp.records) || {};
    const has = {
      setuk: nonEmpty(rec.setuk), changche: nonEmpty(rec.changche), haengtuk: nonEmpty(rec.haengtuk),
      grades: nonEmpty(rec.grades), attendance: nonEmpty(rec.attendance),
    };
    const raw = (inp && inp.raw_text) || "";
    const hits = SECTION_HEADERS.filter((h) => raw.includes(h));
    const mode = has.grades || has.attendance || hits.length >= 3 ? "F" : "E";
    const needed = ["setuk", "changche", "haengtuk"].concat(mode === "F" ? ["grades", "attendance"] : []);
    let missing = needed.filter((k) => !has[k]);
    if (raw && missing.length) {
      const alias = { setuk: "세부능력", changche: "창의적 체험활동", haengtuk: "행동특성", grades: "석차등급", attendance: "출결" };
      missing = missing.filter((k) => !raw.includes(alias[k]));
    }
    return { mode, present: has, raw_header_hits: hits, missing_inputs: missing };
  }

  function scoreRecord(rs, s1rec) {
    const log = [];
    const axes = {};
    for (const k of Object.keys(AXES)) {
      const a = rs.axes[k];
      let g = a.grade;
      if (!(a.evidence && a.evidence.length) && idx(g) > idx("C")) {
        log.push(`G5: ${k} 근거 인용 없음 → ${g}에서 C로 하향`);
        g = "C";
      }
      axes[k] = g;
    }
    const pens = rs.penalties || [];
    for (const p of pens) {
      const conf = CONFIG.penalties[p.code] || {};
      const cap = p.severity === "중" && conf.cap ? conf.cap.heavy : null;
      if (cap && idx(axes[cap.axis]) > idx(cap.max)) {
        log.push(`${p.code}(중): ${cap.axis} 상한 ${cap.max} 적용 (${axes[cap.axis]}→${cap.max})`);
        axes[cap.axis] = cap.max;
      }
    }
    let base = 0;
    for (const k of Object.keys(AXES)) base += AXES[k].weight * pts(axes[k]) / 5 * 100;

    const penSum = (scope) => {
      let s = 0;
      for (const p of pens) {
        const conf = CONFIG.penalties[p.code];
        if (!conf) continue;
        if (scope && !conf.scope.includes(scope)) continue;
        s += p.severity === "중" ? conf.heavy : conf.light;
      }
      return Math.min(s, CONFIG.penalty_cap);
    };
    const penalty = penSum();
    const total = rnd(Math.max(base - penalty, 0), 1);
    const grade = toGrade(total);

    const gates = [];
    if (idx(axes.S2) <= idx("C") || idx(axes.S3) <= idx("C")) gates.push("G1");
    if (["S1", "S2", "S3", "S4"].filter((k) => axes[k] === "D").length >= 2) gates.push("G2");
    if (idx(axes.C1) <= idx("C")) gates.push("G3");
    const ev = s1rec ? s1rec.evidence_sentence_count : undefined;
    if (ev !== undefined && ev !== null && ev < 2) gates.push("G4");
    let capped = grade;
    for (const gk of gates) capped = gmin(capped, CONFIG.gates[gk].max);
    if (capped !== grade) log.push(`상한 규칙 ${gates.join(",")} 적용: ${grade} → ${capped}`);

    const w = CONFIG.competency_weights;
    let acad = 0;
    for (const k of Object.keys(w.academic)) acad += w.academic[k] * pts(axes[k]) / 5 * 100;
    acad = rnd(Math.max(acad - penSum("academic") * 0.6, 0), 1);

    let career = null;
    const cl = (s1rec && s1rec.career_link) || {};
    const rel = cl.subject_relevance || "일반", link = cl.link_type || "없음";
    if (["핵심", "관련"].includes(rel) || ["자연스러운 확장", "병렬 부착", "억지 연결"].includes(link)) {
      let c = 0;
      for (const k of Object.keys(w.career)) c += w.career[k] * pts(axes[k]) / 5 * 100;
      c += (CONFIG.career_link_modifier[link] || 0) - penSum("career") * 0.6;
      career = rnd(Math.max(c, 0), 1);
    }
    const comm = rs.community || {};
    const cp = Object.values(comm).filter((v) => v && GP[v.grade] !== undefined).map((v) => pts(v.grade));
    const community = cp.length ? rnd(cp.reduce((a, b) => a + b, 0) / cp.length / 5 * 100, 1) : null;

    return {
      record_id: rs.record_id, axes_final: axes, base: rnd(base, 1), penalty, total,
      grade_by_score: grade, gates, final_grade: capped,
      llm_grade: rs.llm_overall_grade || null,
      llm_mismatch: !!(rs.llm_overall_grade && rs.llm_overall_grade !== capped),
      competency: {
        academic: { score: acad, grade: toGrade(acad) },
        career: career !== null ? { score: career, grade: toGrade(career) } : null,
        community: community !== null ? { score: community, grade: toGrade(community) } : null,
      },
      log,
    };
  }

  function computeGpa(grades, scale = 9) {
    if (!grades || !grades.length) return null;
    const core = new Set(["국어", "수학", "영어", "사회", "과학", "한국사"]);
    const avg = (rows) => {
      const u = rows.reduce((a, r) => a + r.units, 0);
      return u ? rnd(rows.reduce((a, r) => a + r.units * r.rank_grade, 0) / u, 2) : null;
    };
    const ranked = grades.filter((g) => typeof g.rank_grade === "number" && g.units);
    const byTerm = {};
    for (const g of ranked) (byTerm[`${g.year}-${g.semester}`] = byTerm[`${g.year}-${g.semester}`] || []).push(g);
    const ach = {};
    for (const g of grades) if ((g.rank_grade === null || g.rank_grade === undefined || g.rank_grade === "") && g.achievement) ach[g.achievement] = (ach[g.achievement] || 0) + 1;
    const terms = {};
    for (const k of Object.keys(byTerm).sort()) terms[k] = avg(byTerm[k]);
    return {
      scale, all: avg(ranked), core: avg(ranked.filter((g) => core.has(g.subject_category))),
      by_term: terms, ranked_units: ranked.reduce((a, g) => a + g.units, 0),
      achievement_only_counts: ach,
      note: "석차등급 과목만 평균에 포함, 성취도(A~E)만 있는 진로선택 등은 분포로 별도 표기",
    };
  }

  function attendanceLevel(att) {
    if (!att || !att.length) return null;
    const keys = ["unexcused_absence", "unexcused_late", "unexcused_early_leave", "unexcused_class_absence"];
    let tot = 0, absn = 0;
    for (const a of att) { for (const k of keys) tot += parseInt(a[k] || 0, 10) || 0; absn += parseInt(a.unexcused_absence || 0, 10) || 0; }
    let lv, cap;
    if (tot === 0) { lv = "영향 없음"; cap = null; }
    else if (tot >= 6 || absn >= 3) { lv = "중대"; cap = "C"; }
    else if (tot >= 3 || absn >= 1) { lv = "주의"; cap = "B"; }
    else { lv = "경미"; cap = null; }
    return { unexcused_total: tot, unexcused_absence_days: absn, level: lv, integrity_cap: cap };
  }

  function aggregate(inp, step1, step2) {
    const modeInfo = detectMode(inp);
    const s1map = {};
    for (const r of (step1.records || [])) s1map[r.record_id] = r;
    const recs = (step2.record_scores || []).map((rs) => scoreRecord(rs, s1map[rs.record_id]));
    const mean = (xs) => { xs = xs.filter((x) => x !== null && x !== undefined); return xs.length ? rnd(xs.reduce((a, b) => a + b, 0) / xs.length, 1) : null; };
    const acadQ = mean(recs.filter((r) => /^(SE|CA)/.test(r.record_id)).map((r) => r.competency.academic.score));
    const careerQ = mean(recs.filter((r) => r.competency.career).map((r) => r.competency.career.score));
    const commQ = mean(recs.filter((r) => r.competency.community).map((r) => r.competency.community.score));
    const full = step2.full_mode || {};
    const scale = inp.student && inp.student.curriculum === "2022" ? 5 : 9;
    const gpa = computeGpa((inp.records || {}).grades || [], scale);
    const att = attendanceLevel((inp.records || {}).attendance || []);
    let acad = acadQ;
    if (modeInfo.mode === "F" && full.academic_achievement && GP[full.academic_achievement.grade] !== undefined && acadQ !== null) {
      const m = CONFIG.full_mode.academic_mix;
      acad = rnd(acadQ * m.qualitative + pts(full.academic_achievement.grade) / 5 * 100 * m.achievement, 1);
    }
    let career = careerQ;
    if (modeInfo.mode === "F" && full.course_selection && GP[full.course_selection.grade] !== undefined && careerQ !== null) {
      const m = CONFIG.full_mode.career_mix;
      career = rnd(careerQ * m.qualitative + pts(full.course_selection.grade) / 5 * 100 * m.course_selection, 1);
    }
    let commGrade = commQ !== null ? toGrade(commQ) : null;
    if (att && att.integrity_cap && commGrade) commGrade = gmin(commGrade, att.integrity_cap);
    return {
      mode: modeInfo, records: recs,
      competency: {
        academic: { score: acad, grade: acad !== null ? toGrade(acad) : null },
        career: { score: career, grade: career !== null ? toGrade(career) : null, note: career !== null ? null : "진로 관련 과목 기록 없음: 진로역량은 창체·과목 이수 정보로 판단" },
        community: { score: commQ, grade: commGrade, note: commQ !== null ? null : "세특에서 공동체 근거 미관찰: 창체·행특 입력 시 판단" },
      },
      gpa, attendance: att,
    };
  }

  function extractJson(text) {
    const m = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    const body = m ? m[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    return JSON.parse(body);
  }

  return { detectMode, scoreRecord, computeGpa, attendanceLevel, aggregate, extractJson, toGrade, rnd };
});
