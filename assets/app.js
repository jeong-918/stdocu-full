/* ============================================================================
 * assets/app.js
 * Student Record Master Studio v3.0 — 5-Step Unified Controller
 * ============================================================================ */
(function () {
  'use strict';

  const MS = window.MasterStore;
  const NC = window.NarrativeCore;
  const EC = window.ExplanCore;
  const MR = window.MasterReport;

  const setukScoring = (window.SETUK_BUNDLE && window.SetukScoringFactory)
    ? window.SetukScoringFactory(window.SETUK_BUNDLE.config) : null;
  const setukCore = (window.SETUK_BUNDLE && window.SetukCoreFactory && setukScoring)
    ? window.SetukCoreFactory(window.SETUK_BUNDLE, setukScoring) : null;

  const state = {
    store: { schemaVersion: 3, students: [] },
    storageAvailable: false,
    syncConfig: MS.loadSyncConfig(),
    apiConfig: MS.loadApiConfig(),
    selectedStudentId: null,
    searchQuery: '',
    activeTab: 'activities',
    termFilter: 'all',
    inputMode: 'card',
    editingActivityId: null,
    editingStudentId: null,
    selectedReportId: null,
    compareMode: false,
    compareA: null,
    compareB: null,
    curGroupFilter: 'all',
    curSearchQuery: '',
    activeSubjectName: '',
    selectedStandards: [],
    inquiryFocusNote: '',
    setukStep1Raw: '',
    setukStep2Raw: '',
    apiBusy: false,
    autoUploadTimer: null
  };

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function showToast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { el.classList.remove('show'); }, 3000);
  }

  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
    if (id === 'studentModal') document.getElementById('studentModalError').innerHTML = '';
  }

  function getStu() {
    return state.store.students.find(function (s) { return s.id === state.selectedStudentId; }) || null;
  }

  function loadStore() {
    state.storageAvailable = MS.testStorage();
    if (state.storageAvailable) {
      try {
        const raw = window.localStorage.getItem(MS.STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.students)) {
            state.store = { schemaVersion: 3, students: parsed.students.map(MS.migrateStudent) };
          }
        }
      } catch (e) { console.warn('Store load error:', e); }
    }
    if (state.store.students.length > 0) state.selectedStudentId = state.store.students[0].id;
  }

  function saveStore(skipAutoPush) {
    if (state.storageAvailable) {
      try { window.localStorage.setItem(MS.STORAGE_KEY, JSON.stringify(state.store)); }
      catch (e) { showToast('브라우저 저장 공간이 부족합니다. JSON 백업을 권장합니다.'); }
    }
    if (!skipAutoPush && state.syncConfig.autoBackup && state.syncConfig.token && state.syncConfig.repo) {
      scheduleGitHubAutoUpload();
    }
  }

  function scheduleGitHubAutoUpload() {
    clearTimeout(state.autoUploadTimer);
    renderStorageBadge('5초 뒤 GitHub 자동 업로드 대기…');
    state.autoUploadTimer = setTimeout(async function () {
      try {
        renderStorageBadge('GitHub 업로드 중…');
        const res = await MS.githubPush(state.syncConfig, state.store);
        state.syncConfig.lastSha = res.sha;
        state.syncConfig.lastUploadAt = res.uploadedAt;
        MS.saveSyncConfig(state.syncConfig);
        renderStorageBadge();
        showToast('GitHub 자동 백업 완료 (' + res.uploadedAt + ')');
      } catch (err) {
        renderStorageBadge();
        showToast('GitHub 자동 업로드 실패: ' + err.message);
      }
    }, 5000);
  }

  async function autoPullOnStartup() {
    if (!state.syncConfig.autoBackup || !state.syncConfig.token || !state.syncConfig.repo) return;
    try {
      const res = await MS.githubPull(state.syncConfig);
      if (res.store && Array.isArray(res.store.students)) {
        state.store = { schemaVersion: 3, students: res.store.students.map(MS.migrateStudent) };
        state.syncConfig.lastSha = res.sha;
        MS.saveSyncConfig(state.syncConfig);
        saveStore(true);
        if (state.store.students.length > 0 && !getStu()) state.selectedStudentId = state.store.students[0].id;
        renderAll();
        showToast('GitHub에서 최신 학생 데이터를 자동 동기화했습니다.');
      }
    } catch (e) { /* offline or not initialized yet */ }
  }

  async function callConfiguredAi(prompt, expectJson) {
    const cfg = state.apiConfig;
    const isProxy = cfg.provider === 'local_proxy';
    const isLocalOllama = cfg.provider === 'openai' && /localhost|127\.0\.0\.1/.test(cfg.endpoint || '');
    if (!isProxy && !isLocalOllama && !cfg.apiKey) {
      openApiModal();
      throw new Error('API 키를 먼저 설정하거나 프롬프트 복사 방식을 이용해 주세요.');
    }
    if (isProxy) {
      const stu = getStu();
      const res = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student: NC.buildStudentSnapshot(stu), prompt: prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '중계 서버 오류');
      return typeof data.report === 'string' ? data.report : JSON.stringify(data.report || data);
    }
    if (cfg.provider === 'gemini') {
      const model = (cfg.model || 'gemini-2.5-flash').trim();
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent?key=' + encodeURIComponent(cfg.apiKey.trim());
      const genCfg = { temperature: 0.3 };
      if (expectJson) genCfg.responseMimeType = 'application/json';
      const res = await fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: genCfg })
      });
      if (!res.ok) throw new Error('Gemini API 오류 (' + res.status + ')');
      const data = await res.json();
      return data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
        ? data.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join('\n') : '';
    }
    const endpoint = (cfg.endpoint || 'https://api.openai.com/v1/chat/completions').trim();
    const model = (cfg.model || 'gpt-4o-mini').trim();
    const headers = { 'Content-Type': 'application/json' };
    if (cfg.apiKey) headers['Authorization'] = 'Bearer ' + cfg.apiKey.trim();
    const res = await fetch(endpoint, {
      method: 'POST', headers: headers,
      body: JSON.stringify({ model: model, temperature: 0.3, messages: [{ role: 'user', content: prompt }] })
    });
    if (!res.ok) throw new Error('API 오류 (' + res.status + ')');
    const data = await res.json();
    return data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '';
  }

  function renderAll() {
    renderStorageBadge();
    renderSidebar();
    renderBanner();
    renderTabs();
    renderTabContent();
  }

  function renderStorageBadge(overrideText) {
    const badge = document.getElementById('storageBadge');
    const text = document.getElementById('storageText');
    if (!badge || !text) return;
    if (overrideText) { badge.className = 'status-pill warn'; text.textContent = overrideText; return; }
    if (state.storageAvailable) {
      badge.className = 'status-pill';
      text.textContent = state.syncConfig.autoBackup ? '로컬+GitHub 자동동기화' : '로컬 자동저장 켜짐';
    } else {
      badge.className = 'status-pill warn';
      text.textContent = '임시 메모리 모드';
    }
  }

  function renderSidebar() {
    const list = document.getElementById('studentList');
    document.getElementById('studentCount').textContent = String(state.store.students.length);
    const q = state.searchQuery.trim().toLowerCase();
    const visible = state.store.students.filter(function (s) {
      return !q || (s.code + ' ' + s.targetTrack + ' ' + (s.altTrack || '')).toLowerCase().includes(q);
    });
    if (visible.length === 0) {
      list.innerHTML = '<div class="empty-box" style="padding:18px 12px;font-size:12.5px">' +
        (state.store.students.length === 0 ? '등록된 학생이 없습니다.<br><strong>+ 학생 추가</strong> 또는<br><strong>예시 학생 불러오기</strong>로 시작하세요.' : '검색 결과가 없습니다.') +
      '</div>';
      return;
    }
    list.innerHTML = visible.map(function (s) {
      const active = s.id === state.selectedStudentId ? ' active' : '';
      const setukG = s.setukEval && s.setukEval.aggregated && s.setukEval.aggregated.records && s.setukEval.aggregated.records[0] ? s.setukEval.aggregated.records[0].final_grade : '';
      return '<button type="button" class="student-item' + active + '" data-select-student="' + esc(s.id) + '">' +
        '<div class="student-item-top"><span class="student-code">' + esc(s.code) + '</span>' +
          '<span class="badge badge-paper">' + esc(s.currentTerm) + (setukG ? ' · 세특 ' + esc(setukG) : '') + '</span></div>' +
        '<div class="student-meta">' + esc(s.targetTrack) + '</div>' +
        '<div class="student-meta mt-8" style="font-size:11.5px">활동 ' + s.activities.length + ' · 서사 ' + s.narrativeReports.length + ' · 탐구 ' + s.inquiryPlans.length + '</div>' +
      '</button>';
    }).join('');
  }

  function renderBanner() {
    const el = document.getElementById('studentBannerCard');
    const stu = getStu();
    if (!stu) {
      const cStats = EC.getCurriculumStats();
      el.innerHTML = '<div class="empty-box">' +
        '<h3 style="margin-bottom:6px;color:var(--ink)">학생부 마스터 스튜디오에 오신 것을 환영합니다</h3>' +
        '<p class="hint mb-12">세특 6축 정밀 채점기 + 10섹션 서사 분석 + 2022 개정교육과정(' + cStats.subjects + '과목 · ' + cStats.standards.toLocaleString() + '성취기준 · ' + cStats.fields + '계열) DB가 하나로 통합되어 있습니다.</p>' +
        '<div class="flex-gap" style="justify-content:center">' +
          '<button type="button" class="btn btn-primary" id="btnBannerNew">+ 새 학생 등록</button>' +
          '<button type="button" class="btn btn-soft" id="btnBannerSample">통합 예시 학생(H2-URB01) 체험하기</button>' +
        '</div></div>';
      return;
    }
    const stats = NC.analyzeStudentLocally(stu);
    const setukRec0 = stu.setukEval && stu.setukEval.aggregated && stu.setukEval.aggregated.records && stu.setukEval.aggregated.records[0];
    el.innerHTML = '<div class="student-banner">' +
      '<div class="banner-info">' +
        '<div class="banner-title-row">' +
          '<span class="banner-code">' + esc(stu.code) + '</span>' +
          '<span class="badge badge-sage">' + esc(stu.currentTerm) + ' · ' + esc(stu.curriculum || '2022') + '과정</span>' +
          '<span class="badge badge-slate">' + esc(NC.MODE_LABELS[stu.diagnosisMode]) + '</span>' +
          '<span class="badge badge-amber">' + esc(NC.PATH_LABELS[stu.careerPath]) + '</span>' +
          (setukRec0 ? '<span class="badge badge-sage">세특 진단 ' + esc(setukRec0.final_grade) + ' (' + esc(setukRec0.total) + '점)</span>' : '') +
        '</div>' +
        '<div class="banner-sub"><strong>희망 계열·학과:</strong> ' + esc(stu.targetTrack) + (stu.altTrack ? ' &nbsp;|&nbsp; <strong>검토 대안:</strong> ' + esc(stu.altTrack) : '') + '</div>' +
        '<div class="badge-row">' +
          '<span class="badge badge-paper">완료 ' + stats.byStatus.completed + ' · 진행 ' + stats.byStatus.ongoing + ' · 예정 ' + stats.byStatus.planned + '</span>' +
          '<span class="badge badge-paper">남은 학기: ' + esc(stats.remainingTerms.join(', ')) + '</span>' +
          (!stu.grades ? '<span class="badge badge-amber">성적 미입력(보류)</span>' : '') +
          (!stu.courses ? '<span class="badge badge-amber">이수 기록 미입력(보류)</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="flex-gap">' +
        '<button type="button" class="btn btn-sm" id="btnEditStudent">프로필 수정</button>' +
        '<button type="button" class="btn btn-danger btn-sm" id="btnDeleteStudent">삭제</button>' +
      '</div>' +
    '</div>';
  }

  function renderTabs() {
    const stu = getStu();
    document.getElementById('tabCountAct').textContent = stu ? String(stu.activities.length) : '0';
    document.getElementById('tabBadgeSetuk').textContent = (stu && stu.setukEval && stu.setukEval.aggregated && stu.setukEval.aggregated.records && stu.setukEval.aggregated.records[0]) ? stu.setukEval.aggregated.records[0].final_grade : '-';
    document.getElementById('tabCountInq').textContent = stu ? String(stu.inquiryPlans.length) : '0';
    document.getElementById('tabCountRep').textContent = stu ? String(stu.narrativeReports.length) : '0';
    document.querySelectorAll('#mainTabs .tab-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tab === state.activeTab);
    });
  }

  function renderTabContent() {
    const container = document.getElementById('tabContent');
    const stu = getStu();
    if (!stu) { container.innerHTML = ''; return; }
    if (state.activeTab === 'activities') renderTabActivities(container, stu);
    else if (state.activeTab === 'setuk') renderTabSetuk(container, stu);
    else if (state.activeTab === 'narrative') renderTabNarrative(container, stu);
    else if (state.activeTab === 'explan') renderTabExplan(container, stu);
    else if (state.activeTab === 'report') renderTabReport(container, stu);
  }

  function renderTabActivities(container, stu) {
    const editingAct = state.editingActivityId ? stu.activities.find(function (a) { return a.id === state.editingActivityId; }) : null;
    const mode = editingAct ? editingAct.type : state.inputMode;
    const filtered = stu.activities.filter(function (a) { return state.termFilter === 'all' ? true : a.term === state.termFilter; });
    const termCounts = {};
    NC.ALL_TERMS.forEach(function (t) { termCounts[t] = 0; });
    stu.activities.forEach(function (a) { termCounts[NC.ALL_TERMS.includes(a.term) ? a.term : 'unknown'] += 1; });

    container.innerHTML = '<div class="card mb-12">' +
      '<div class="flex-between mb-12">' +
        '<div><h3 style="font-size:15.5px">' + (editingAct ? '활동·세특 수정 (' + esc(editingAct.code) + ')' : '새 활동·세특 원문 입력') + '</h3>' +
        '<p class="hint">여기에 입력한 세특 원문과 활동은 ② 세특 정밀 진단, ③ 누적 서사, ④ 2022 주제탐구에서 자동으로 불러와 활용됩니다.</p></div>' +
        '<div class="flex-gap">' +
          '<div class="segmented"><button type="button" class="' + (mode === 'card' ? 'active' : '') + '" data-input-mode="card">구조화 카드</button>' +
          '<button type="button" class="' + (mode === 'note' ? 'active' : '') + '" data-input-mode="note">자유서술 메모</button></div>' +
          '<button type="button" class="btn btn-soft btn-sm" id="btnOpenBulk">텍스트 일괄 붙여넣기</button>' +
        '</div>' +
      '</div>' +
      '<form id="activityForm" class="form-grid-4">' +
        '<div class="field"><label for="aTerm">학기 *</label><select id="aTerm">' + NC.ALL_TERMS.map(function (t) { return '<option value="' + t + '"' + ((editingAct ? editingAct.term : stu.currentTerm) === t ? ' selected' : '') + '>' + esc(NC.TERM_LABELS[t]) + ' (' + t + ')</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="aStatus">진행 상태 *</label><select id="aStatus">' + ['completed', 'ongoing', 'planned'].map(function (st) { return '<option value="' + st + '"' + ((editingAct ? editingAct.status : 'completed') === st ? ' selected' : '') + '>' + esc(NC.STATUS_LABELS[st]) + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="aSource">자료 성격 *</label><select id="aSource">' + MS.SOURCE_OPTIONS.map(function (src) { return '<option value="' + src + '"' + ((editingAct ? editingAct.source : '학생부 원문') === src ? ' selected' : '') + '>' + esc(src) + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="aArea">영역</label><select id="aArea">' + ['세특(교과)', '동아리', '진로활동', '자율활동', '독서·탐구', '기타'].map(function (ar) { return '<option value="' + ar + '"' + ((editingAct ? editingAct.area : '세특(교과)') === ar ? ' selected' : '') + '>' + esc(ar) + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="aSubject">교과/과목명 (세특 시)</label><input id="aSubject" value="' + esc(editingAct ? editingAct.subject : '') + '" placeholder="예: 확률과 통계"></div>' +
        '<div class="field" style="grid-column:span 2"><label for="aTitle">활동·탐구 제목 *</label><input id="aTitle" required value="' + esc(editingAct ? editingAct.title : '') + '" placeholder="예: 조건부확률 기반 교통사고 사망률 분석"></div>' +
        '<div class="field"><label for="aComp">역량 축</label><select id="aComp">' + Object.keys(NC.COMPETENCY_LABELS).map(function (k) { return '<option value="' + k + '"' + ((editingAct ? editingAct.competency : 'both') === k ? ' selected' : '') + '>' + esc(NC.COMPETENCY_LABELS[k]) + '</option>'; }).join('') + '</select></div>' +
        '<div class="field full"><label for="aContent">세특 원문 또는 핵심 탐구 내용 *</label><textarea id="aContent" required placeholder="세특 원문을 그대로 붙여넣거나 확인된 활동 사실을 적어주세요.">' + esc(editingAct ? editingAct.content : '') + '</textarea></div>' +
        (mode === 'card' ? (
          '<div class="field" style="grid-column:span 2"><label for="aMethod">탐구 방법·개념·도구</label><input id="aMethod" value="' + esc(editingAct ? editingAct.method : '') + '"></div>' +
          '<div class="field"><label for="aRole">본인 역할</label><input id="aRole" value="' + esc(editingAct ? editingAct.role : '') + '"></div>' +
          '<div class="field"><label for="aResult">산출물·결과</label><input id="aResult" value="' + esc(editingAct ? editingAct.result : '') + '"></div>' +
          '<div class="field" style="grid-column:span 2"><label for="aReflection">배운 점·한계·후속 의문</label><input id="aReflection" value="' + esc(editingAct ? editingAct.reflection : '') + '"></div>' +
          '<div class="field" style="grid-column:span 2"><label for="aConnection">선행 활동 ID 연결 메모</label><input id="aConnection" value="' + esc(editingAct ? editingAct.connection : '') + '"></div>'
        ) : '') +
        '<div class="field full flex-between mt-8"><span class="hint">자동 부여 ID(A1, A2…)로 모든 리포트에서 근거가 추적됩니다.</span>' +
        '<div class="flex-gap">' + (editingAct ? '<button type="button" class="btn" id="btnCancelEditAct">취소</button>' : '') + '<button type="submit" class="btn btn-primary">' + (editingAct ? '수정 저장' : '활동 추가') + '</button></div></div>' +
      '</form></div>' +
      '<div class="card"><div class="flex-between mb-12"><h3 style="font-size:15.5px">등록된 기록 (' + filtered.length + '/' + stu.activities.length + '건)</h3>' +
      '<div class="semester-strip"><button type="button" class="sem-chip' + (state.termFilter === 'all' ? ' active' : '') + '" data-term-filter="all">전체 (' + stu.activities.length + ')</button>' +
      NC.ALL_TERMS.map(function (t) { return '<button type="button" class="sem-chip' + (state.termFilter === t ? ' active' : '') + '" data-term-filter="' + t + '">' + (t === 'unknown' ? '시점 미확인' : t) + (termCounts[t] ? ' (' + termCounts[t] + ')' : '') + '</button>'; }).join('') +
      '</div></div>' +
      (filtered.length === 0 ? '<div class="empty-box">해당 조건의 활동이 없습니다.</div>' : '<div class="activity-list">' + filtered.map(function (a) {
        const stCls = a.status === 'completed' ? 'badge-sage' : (a.status === 'ongoing' ? 'badge-amber' : 'badge-slate');
        return '<article class="activity-card type-' + a.type + '"><div class="activity-head"><div><div class="badge-row">' +
          '<span class="badge badge-slate">ID: ' + esc(a.code) + '</span>' +
          '<span class="badge badge-paper">' + esc(a.term === 'unknown' ? '시점 미확인' : a.term) + '</span>' +
          '<span class="badge ' + stCls + '">' + esc(NC.STATUS_LABELS[a.status]) + '</span>' +
          '<span class="badge badge-paper">' + esc(a.source) + '</span>' +
          '<span class="badge badge-paper">' + esc(a.area + (a.subject ? ' · ' + a.subject : '')) + '</span>' +
          '</div><div class="activity-title">' + esc(a.title) + '</div></div>' +
          '<div class="flex-gap"><button type="button" class="btn btn-sm" data-edit-act="' + esc(a.id) + '">수정</button><button type="button" class="btn btn-danger btn-sm" data-del-act="' + esc(a.id) + '">삭제</button></div></div>' +
          '<div class="activity-body">' + esc(a.content) + '</div></article>';
      }).join('') + '</div>') + '</div>';
  }

  function buildSetukInputFromStudent(stu) {
    const setukRecs = stu.activities.filter(function (a) { return a.area === '세특(교과)' || a.source === '학생부 원문'; }).map(function (a, i) {
      return {
        id: a.code || ('SE' + (i + 1)),
        year: parseInt(String(a.term || '2')[0], 10) || 2,
        subject: a.subject || a.title.slice(0, 15),
        subject_category: '교과',
        text: a.content
      };
    });
    return {
      student: {
        grade_level: '고' + (String(stu.currentTerm || '2')[0] || '2'),
        curriculum: stu.curriculum || '2022',
        career_goal: { field: stu.targetTrack, major: stu.targetTrack, detail: stu.counselorNote || '' },
        school_type: '일반고',
        notes: stu.code
      },
      records: { setuk: setukRecs, changche: [], haengtuk: [], grades: [], attendance: [] },
      raw_text: ''
    };
  }

  function renderTabSetuk(container, stu) {
    const ev = stu.setukEval;
    const agg = ev && ev.aggregated ? ev.aggregated : null;
    const brokenLinks = NC.extractSetukBrokenLinks(stu);
    const setukInput = buildSetukInputFromStudent(stu);
    const step1Prompt = setukCore ? setukCore.buildPrompt('step1', setukInput) : '';
    const oneshotPrompt = setukCore ? setukCore.buildPrompt('oneshot', setukInput) : '';

    let scorecardHtml = '<div class="empty-box mb-12">아직 계산된 세특 정밀 진단 결과가 없습니다. 아래에서 프롬프트를 복사해 <code>setuk-diagnosis</code> 스킬로 분석하거나, 예시 학생을 불러와 보세요.</div>';
    if (agg) {
      const rec0 = (agg.records && agg.records[0]) ? agg.records[0] : null;
      const axes = rec0 && (rec0.axes_final || rec0.axes) ? (rec0.axes_final || rec0.axes) : {};
      const axisMeta = [
        ['S1', '동기·문제의식'], ['S2', '탐구 과정'], ['S3', '개념·이론 심화'],
        ['S4', '배운 점·후속'], ['C1', '개념 이해도'], ['C2', '지적 호기심']
      ];
      scorecardHtml = '<div class="kpi-grid mb-12">' +
        '<div class="kpi-box"><div class="kpi-label">세특 종합 진단 등급</div><div class="kpi-val" style="color:var(--accent)">' + esc(agg.overall ? agg.overall.grade : '-') + '</div><div class="kpi-sub">결정론적 코드 계산 (' + esc(agg.overall ? agg.overall.score + '점' : '-') + ')</div></div>' +
        '<div class="kpi-box"><div class="kpi-label">학업역량 환산</div><div class="kpi-val">' + esc((agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)) && (agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)).academic ? (agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)).academic.grade : '-') + '</div><div class="kpi-sub">' + esc((agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)) && (agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)).academic ? (agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)).academic.score + '점' : '') + '</div></div>' +
        '<div class="kpi-box"><div class="kpi-label">진로역량 환산</div><div class="kpi-val">' + esc((agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)) && (agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)).career ? (agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)).career.grade : '-') + '</div><div class="kpi-sub">' + esc((agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)) && (agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)).career ? (agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)).career.score + '점' : '') + '</div></div>' +
        '<div class="kpi-box"><div class="kpi-label">발견된 끊어진 고리</div><div class="kpi-val" style="color:var(--terracotta)">' + brokenLinks.length + '건</div><div class="kpi-sub">③ 서사·④ 주제탐구로 자동 연계</div></div>' +
      '</div>' +
      (rec0 ? '<div class="axis-grid mb-12">' + axisMeta.map(function (am) {
        const g = axes[am[0]] || '-';
        return '<div class="axis-card"><div class="hint">' + am[0] + '</div><div class="axis-grade">' + esc(typeof g === 'object' ? (g.grade || '-') : g) + '</div><div style="font-size:11.5px;font-weight:600">' + am[1] + '</div></div>';
      }).join('') + '</div>' : '') +
      (brokenLinks.length > 0 ? '<div class="alert alert-warn mb-12"><div><strong>발견된 끊어진 고리 (후속 탐구 최우선 대상):</strong><br>' +
        brokenLinks.map(function (b) { return '• [' + esc(b.recordId) + '] ' + esc(b.link); }).join('<br>') + '</div></div>' : '');
    }

    container.innerHTML = '<div class="card mb-12">' +
      '<div class="flex-between mb-12">' +
        '<div><h3 style="font-size:15.5px">세특 서류평가 6축 정밀 진단 (docu-ev 엔진)</h3>' +
        '<p class="hint">학생의 세특 원문(' + setukInput.records.setuk.length + '건)을 기승전결(S1~S4)·개념(C1~C2)·감점(P1~P8) 코드 계산기로 정밀 판정합니다.</p></div>' +
        '<div class="flex-gap">' +
          '<button type="button" class="btn btn-soft btn-sm" id="btnCopySetukOneshot">원샷 진단 프롬프트 복사</button>' +
          '<button type="button" class="btn btn-sm" id="btnCopySetukStep1">1단계 분해 프롬프트 복사</button>' +
        '</div>' +
      '</div>' +
      scorecardHtml +
      '<div class="form-grid">' +
        '<div class="field"><label for="setukStep1Box">Step 1 JSON (문장 분해 응답 — 선택)</label><textarea id="setukStep1Box" class="code-box" style="min-height:110px" placeholder="step1 JSON 붙여넣기">' + esc(state.setukStep1Raw) + '</textarea></div>' +
        '<div class="field"><label for="setukStep2Box">Step 2 JSON (6축 등급·감점·끊어진 고리 판정 응답)</label><textarea id="setukStep2Box" class="code-box" style="min-height:110px" placeholder="step2 JSON 또는 원샷 JSON 붙여넣기">' + esc(state.setukStep2Raw) + '</textarea></div>' +
      '</div>' +
      '<div class="flex-between mt-12">' +
        '<span class="hint">코드 계산기(setuk_scoring.js)가 점수·감점·상한을 자동 산출하고, 끊어진 고리를 ③ 서사 분석과 ④ 주제탐구로 넘깁니다.</span>' +
        '<button type="button" class="btn btn-primary" id="btnCalcSetuk">6축 코드 채점 실행 및 저장</button>' +
      '</div>' +
    '</div>' +
    '<div class="card"><details><summary style="cursor:pointer;font-weight:600">생성된 세특 진단 프롬프트 미리보기 (원샷 / 1단계)</summary>' +
      '<textarea class="code-box mt-8" readonly>' + esc(oneshotPrompt || step1Prompt) + '</textarea></details></div>';
  }

  function renderTabNarrative(container, stu) {
    const stats = NC.analyzeStudentLocally(stu);
    const curIdx = NC.TERMS.indexOf(stu.currentTerm);
    const promptText = NC.buildNarrativePrompt(stu);

    const matrixHtml = '<div class="card mb-12">' +
      '<div class="flex-between mb-12"><div><h3 style="font-size:15.5px">오프라인 1차 서사 대시보드 (학기 매트릭스 &amp; 판단 보류 시그널)</h3><p class="hint">AI 호출 전에도 기록 공백·자료 위계·판단 보류 항목을 즉시 점검합니다.</p></div>' +
      '<div class="flex-gap"><select id="bDiagMode" style="padding:5px 9px;border:1px solid var(--line-strong);border-radius:6px">' +
        '<option value="qualitative"' + (stu.diagnosisMode === 'qualitative' ? ' selected' : '') + '>근거 중심 정성진단</option>' +
        '<option value="development"' + (stu.diagnosisMode === 'development' ? ' selected' : '') + '>발달단계 중심 진단</option></select>' +
      '<select id="bCareerPath" style="padding:5px 9px;border:1px solid var(--line-strong);border-radius:6px">' +
        '<option value="maintain"' + (stu.careerPath === 'maintain' ? ' selected' : '') + '>현재 진로 유지</option>' +
        '<option value="expand"' + (stu.careerPath === 'expand' ? ' selected' : '') + '>인접 분야 간접 확장</option>' +
        '<option value="transition"' + (stu.careerPath === 'transition' ? ' selected' : '') + '>진로 전환</option></select></div></div>' +
      '<div class="sem-matrix mb-12">' + NC.TERMS.map(function (t, idx) {
        const list = stats.byTerm[t];
        const cls = ['sem-cell'];
        if (list.length > 0) cls.push('has-data');
        if (t === stu.currentTerm) cls.push('is-current');
        if (idx > curIdx) cls.push('is-future');
        if (idx < curIdx && list.length === 0) cls.push('is-gap');
        return '<div class="' + cls.join(' ') + '"><div class="flex-between"><strong>' + t + '</strong><span style="font-size:11px;color:var(--muted)">' + (t === stu.currentTerm ? '현재' : (idx > curIdx ? '남은' : (list.length ? '완료' : '공백'))) + '</span></div>' +
          '<div style="font-size:18px;font-weight:700">' + list.length + '건</div></div>';
      }).join('') + '</div>' +
      '<div class="signal-list">' + stats.signals.map(function (s) {
        return '<div class="signal-item ' + s.level + '"><strong>[' + (s.level === 'warn' ? '점검' : (s.level === 'good' ? '양호' : '보류/참고')) + ']</strong> <span>' + esc(s.text) + '</span></div>';
      }).join('') + '</div>' +
    '</div>';

    const bridgeHtml = '<div class="card">' +
      '<div class="flex-between mb-12"><div><h3 style="font-size:15.5px">누적 서사 AI 분석 연동 (student-narrative-guide 규격)</h3>' +
      '<p class="hint">② 세특 정밀 진단의 끊어진 고리와 직전 상담 리포트가 프롬프트에 자동 포함됩니다.</p></div>' +
      '<div class="flex-gap">' +
        '<button type="button" class="btn btn-soft" id="btnCopyNarPrompt">서사 프롬프트 복사</button>' +
        '<button type="button" class="btn btn-primary" id="btnRunNarApi"' + (state.apiBusy ? ' disabled' : '') + '>' + (state.apiBusy ? '분석 실행 중…' : 'AI 직접 분석 실행') + '</button>' +
      '</div></div>' +
      '<details class="mb-12"><summary style="cursor:pointer;font-weight:600;font-size:13px">생성된 서사 분석 프롬프트 미리보기</summary>' +
      '<textarea id="narPromptPreview" class="code-box mt-8" readonly>' + esc(promptText) + '</textarea></details>' +
      '<div class="field"><label for="narJsonArea">채팅(스킬) 응답 JSON 붙여넣기</label>' +
      '<textarea id="narJsonArea" class="code-box" placeholder="student-narrative-guide가 반환한 10섹션 JSON을 붙여넣으세요."></textarea></div>' +
      '<div id="narImportFb" class="mt-8"></div>' +
      '<div class="flex-between mt-12"><span class="hint">가져온 결과는 ⑤ 통합 마스터 리포트에 초안으로 저장됩니다.</span>' +
      '<button type="button" class="btn btn-primary" id="btnImportNarJson">서사 리포트 초안으로 가져오기</button></div>' +
    '</div>';

    container.innerHTML = matrixHtml + bridgeHtml;
  }

  function renderTabExplan(container, stu) {
    const cStats = EC.getCurriculumStats();
    const groups = EC.getSubjectGroups();
    const matchedSubjects = EC.searchSubjects(state.curSearchQuery, state.curGroupFilter);
    if (!state.activeSubjectName && matchedSubjects.length > 0) state.activeSubjectName = matchedSubjects[0].c;
    const activeSub = matchedSubjects.find(function (c) { return c.c === state.activeSubjectName; }) || matchedSubjects[0] || null;
    const field = EC.findFieldById(stu.fieldId);
    const brokenLinks = NC.extractSetukBrokenLinks(stu);
    const inqPrompt = EC.buildInquiryPrompt(stu, state.selectedStandards, state.inquiryFocusNote);

    const fieldBanner = field
      ? '<div class="card-subtle mb-12"><div class="flex-between"><strong>연계 진로 계열: ' + esc(field.name) + '</strong><span class="badge badge-sage">' + esc(field.cluster || '') + '</span></div>' +
        '<div class="hint mt-8"><strong>핵심과목:</strong> ' + esc((field.core || []).join(', ') || '-') + ' &nbsp;|&nbsp; <strong>권장과목:</strong> ' + esc((field.recommended || []).join(', ') || '-') + '</div></div>'
      : '<div class="hint mb-12">학생 프로필에서 30대 진로 계열을 선택하면 핵심·권장과목이 이곳에 자동 표시됩니다.</div>';

    const selectedChips = state.selectedStandards.length === 0
      ? '<span class="hint">아래 2022 개정교육과정 DB에서 과목과 성취기준을 체크해 선택하세요.</span>'
      : state.selectedStandards.map(function (st, idx) {
          return '<span class="badge badge-sage">' + esc(st.subject + ' · ' + st.code) + ' <button type="button" data-rm-std="' + idx + '" style="border:none;background:none;padding:0 2px;font-weight:700;color:inherit">×</button></span>';
        }).join('');

    const stdRows = activeSub
      ? (activeSub.u || []).map(function (u) {
          return '<div style="margin-bottom:10px"><strong style="color:var(--accent);font-size:12.5px">' + esc(u.m) + '</strong>' +
            (u.s || []).map(function (s) {
              const checked = state.selectedStandards.some(function (x) { return x.code === s[0]; });
              return '<label class="std-row" style="cursor:pointer"><input type="checkbox" style="width:auto;margin-top:3px" data-toggle-std="' + esc(s[0]) + '" data-std-sub="' + esc(activeSub.c) + '" data-std-txt="' + esc(s[1]) + '"' + (checked ? ' checked' : '') + '>' +
                '<span><code style="font-size:11.5px;color:var(--slate)">' + esc(s[0]) + '</code> ' + esc(s[1]) + '</span></label>';
            }).join('') + '</div>';
        }).join('')
      : '<div class="empty-box">검색 조건에 맞는 과목이 없습니다.</div>';

    const savedPlansHtml = stu.inquiryPlans.length === 0
      ? '<p class="hint">저장된 주제탐구 설계안이 아직 없습니다.</p>'
      : stu.inquiryPlans.map(function (p, i) {
          return '<div class="card-subtle mb-8"><div class="flex-between mb-8"><strong>탐구 설계안 #' + (stu.inquiryPlans.length - i) + ' (' + esc(p.createdAt) + ')</strong>' +
            '<button type="button" class="btn btn-danger btn-sm" data-del-inq="' + esc(p.id) + '">삭제</button></div>' +
            '<div class="badge-row mb-8">' + (p.selectedStandards || []).map(function (st) { return '<span class="badge badge-slate">' + esc(st.subject + ' ' + st.code) + '</span>'; }).join('') + '</div>' +
            '<div style="font-size:13.5px">' + EC.renderSimpleMarkdown(p.resultMarkdown) + '</div></div>';
        }).join('');

    container.innerHTML = '<div class="card mb-12">' +
      '<div class="flex-between mb-8"><div><h3 style="font-size:15.5px">2022 개정교육과정 과목·성취기준 탐색 (' + cStats.subjects + '과목 · ' + cStats.standards.toLocaleString() + '성취기준)</h3>' +
      '<p class="hint">② 세특 끊어진 고리(' + brokenLinks.length + '건)와 ③ 서사 로드맵이 자동으로 설계 프롬프트에 반영됩니다.</p></div></div>' +
      fieldBanner +
      '<div class="form-grid mb-8">' +
        '<div class="field"><label for="curGroupSel">교과군 필터</label><select id="curGroupSel"><option value="all">전체 교과군 (' + cStats.subjects + '과목)</option>' +
          groups.map(function (g) { return '<option value="' + esc(g) + '"' + (state.curGroupFilter === g ? ' selected' : '') + '>' + esc(g) + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="curSearchInput">과목명·성취기준 키워드 검색</label><input id="curSearchInput" value="' + esc(state.curSearchQuery) + '" placeholder="예: 확률과 통계, 조건부확률, 미적분, 정보"></div>' +
      '</div>' +
      '<div class="cur-browser mb-12">' +
        '<div class="cur-list">' + matchedSubjects.slice(0, 80).map(function (c) {
          return '<button type="button" class="cur-item' + (activeSub && activeSub.c === c.c ? ' active' : '') + '" data-sel-sub="' + esc(c.c) + '">' + esc(c.c) + ' <span class="hint">(' + esc(c.g) + ')</span></button>';
        }).join('') + '</div>' +
        '<div class="std-list">' + stdRows + '</div>' +
      '</div>' +
      '<div class="badge-row mb-12">' + selectedChips + '</div>' +
      '<div class="field mb-8"><label for="inqFocusInput">추가 강조 사항 (선택)</label><input id="inqFocusInput" value="' + esc(state.inquiryFocusNote) + '" placeholder="예: 2-2학기 정보 교과 세특과 연계해 공공데이터 파이썬 분석 중심으로 설계"></div>' +
      '<div class="flex-between mb-8">' +
        '<button type="button" class="btn btn-soft" id="btnCopyInqPrompt">주제탐구 설계 프롬프트 복사</button>' +
        '<button type="button" class="btn btn-primary" id="btnRunInqApi"' + (state.apiBusy ? ' disabled' : '') + '>' + (state.apiBusy ? '설계 생성 중…' : 'AI 직접 탐구 주제 생성') + '</button>' +
      '</div>' +
      '<details class="mb-12"><summary style="cursor:pointer;font-size:13px;font-weight:600">생성된 주제탐구 프롬프트 미리보기</summary>' +
      '<textarea id="inqPromptPreview" class="code-box mt-8" readonly>' + esc(inqPrompt) + '</textarea></details>' +
      '<div class="field"><label for="inqResultArea">AI 탐구 설계 결과 붙여넣기 (마크다운 지원)</label><textarea id="inqResultArea" class="code-box" style="min-height:110px" placeholder="채팅에서 받은 주제탐구 설계 결과를 붙여넣고 저장하면 ⑤ 통합 리포트에 자동 합쳐집니다."></textarea></div>' +
      '<div class="flex-between mt-8"><span class="hint">저장된 탐구안은 통합 마스터 리포트 PART 3에 자동 포함됩니다.</span><button type="button" class="btn btn-primary" id="btnSaveInqPlan">탐구 설계안 저장</button></div>' +
    '</div>' +
    '<div class="card"><h3 style="font-size:15.5px" class="mb-12">저장된 2022 주제탐구 설계안 (' + stu.inquiryPlans.length + '건)</h3>' + savedPlansHtml + '</div>';
  }

  function renderReportPlain(rep) {
    return NC.SECTION_META.map(function (meta) {
      const sec = (rep.sections || []).find(function (s) { return s.kind === meta.kind; });
      if (!sec || (!sec.summary && !(sec.items && sec.items.length) && !(sec.roadmapCards && sec.roadmapCards.length))) return '';
      const lines = [];
      if (sec.summary) lines.push(sec.summary);
      (sec.items || []).forEach(function (it) { lines.push('• ' + it.text); });
      (sec.roadmapCards || []).forEach(function (c) { lines.push('▪ ' + c.term + ' — ' + c.goal + ': ' + c.topic); });
      return '<div style="margin-bottom:10px"><strong style="color:var(--accent);font-size:12.5px">' + meta.num + '. ' + esc(meta.title) + '</strong><div style="font-size:12.5px;white-space:pre-wrap;margin-top:3px">' + esc(lines.join('\n')) + '</div></div>';
    }).join('');
  }

  function renderTabReport(container, stu) {
    const reps = stu.narrativeReports || [];
    let rep = reps.find(function (r) { return r.id === state.selectedReportId; }) || reps[0] || null;
    if (rep) state.selectedReportId = rep.id;
    const isArchived = rep && rep.status === 'archived';
    const agg = stu.setukEval && stu.setukEval.aggregated ? stu.setukEval.aggregated : null;

    const toolbar = '<div class="card mb-12 no-print"><div class="flex-between">' +
      '<div class="flex-gap">' +
        (reps.length > 0 ? (
          '<label for="reportSelect" style="font-size:13px;font-weight:600">서사 버전:</label>' +
          '<select id="reportSelect" style="padding:6px 10px;border:1px solid var(--line-strong);border-radius:6px;background:#fff">' +
            reps.map(function (r, idx) {
              return '<option value="' + esc(r.id) + '"' + (r.id === rep.id ? ' selected' : '') + '>V' + (reps.length - idx) + ' [' + (r.status === 'archived' ? '확정' : '초안') + ' · ' + esc(r.createdAt) + '] ' + esc(NC.PATH_LABELS[r.careerPath]) + '</option>';
            }).join('') + '</select>' +
          (!isArchived ? '<button type="button" class="btn btn-primary btn-sm" id="btnArchiveReport">확정 보관</button>' : '<button type="button" class="btn btn-soft btn-sm" id="btnCloneReport">새 초안 복제</button>') +
          (reps.length >= 2 ? '<button type="button" class="btn btn-sm" id="btnToggleCompare">' + (state.compareMode ? '통합 리포트 보기' : '버전 나란히 비교') + '</button>' : '')
        ) : '<span class="hint">서사 리포트가 없어도 세특 진단·주제탐구만으로 통합 출력을 확인할 수 있습니다.</span>') +
      '</div>' +
      '<div class="flex-gap">' +
        '<button type="button" class="btn btn-soft btn-sm" id="btnCopyDocs">Google Docs 서식 복사</button>' +
        '<button type="button" class="btn btn-sm" id="btnDownloadMd">Markdown 저장</button>' +
        '<button type="button" class="btn btn-primary btn-sm" id="btnPrintPdf">A4 통합 PDF 인쇄</button>' +
      '</div></div></div>';

    if (state.compareMode && reps.length >= 2) {
      const repA = reps.find(function (r) { return r.id === state.compareA; }) || reps[reps.length - 1];
      const repB = reps.find(function (r) { return r.id === state.compareB; }) || reps[0];
      state.compareA = repA.id; state.compareB = repB.id;
      container.innerHTML = toolbar + '<div class="card"><h3 style="font-size:15.5px" class="mb-12">상담 버전 나란히 비교</h3>' +
        '<div class="form-grid mb-12">' +
          '<div class="field"><label>비교 A</label><select id="selCompareA">' + reps.map(function (r, i) { return '<option value="' + esc(r.id) + '"' + (r.id === repA.id ? ' selected' : '') + '>V' + (reps.length - i) + ' [' + esc(r.createdAt) + ']</option>'; }).join('') + '</select></div>' +
          '<div class="field"><label>비교 B</label><select id="selCompareB">' + reps.map(function (r, i) { return '<option value="' + esc(r.id) + '"' + (r.id === repB.id ? ' selected' : '') + '>V' + (reps.length - i) + ' [' + esc(r.createdAt) + ']</option>'; }).join('') + '</select></div>' +
        '</div>' +
        '<div class="compare-grid">' +
          '<div class="compare-col"><h4 class="mb-8">' + esc(repA.headline) + '</h4>' + renderReportPlain(repA) + '</div>' +
          '<div class="compare-col"><h4 class="mb-8">' + esc(repB.headline) + '</h4>' + renderReportPlain(repB) + '</div>' +
        '</div></div>';
      return;
    }

    const part1Html = agg ? (
      '<section class="report-section"><span class="report-part-badge">PART 1 · 세특 6축 정밀 진단 (docu-ev)</span>' +
      '<div class="kpi-grid mb-8">' +
        '<div class="kpi-box"><div class="kpi-label">종합 등급</div><div class="kpi-val">' + esc(agg.overall ? agg.overall.grade : '-') + '</div><div class="kpi-sub">' + esc(agg.overall ? agg.overall.score + '점' : '') + '</div></div>' +
        '<div class="kpi-box"><div class="kpi-label">학업역량</div><div class="kpi-val">' + esc((agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)) && (agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)).academic ? (agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)).academic.grade : '-') + '</div></div>' +
        '<div class="kpi-box"><div class="kpi-label">진로역량</div><div class="kpi-val">' + esc((agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)) && (agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)).career ? (agg.competency || (agg.records && agg.records[0] && agg.records[0].competency)).career.grade : '-') + '</div></div>' +
        '<div class="kpi-box"><div class="kpi-label">끊어진 고리</div><div class="kpi-val">' + NC.extractSetukBrokenLinks(stu).length + '건</div></div>' +
      '</div></section>'
    ) : '';

    const part2Html = rep ? ('<span class="report-part-badge">PART 2 · 학기/학년 누적 서사 및 진로 방향성</span>' +
      NC.SECTION_META.map(function (meta) {
        const sec = (rep.sections || []).find(function (s) { return s.kind === meta.kind; }) || { summary: '', items: [], roadmapCards: [] };
        if (!sec.summary && !(sec.items && sec.items.length) && !(sec.roadmapCards && sec.roadmapCards.length)) return '';
        return '<section class="report-section"><div class="report-sec-head"><h3 class="report-sec-title"><span class="report-sec-num">' + meta.num + '</span>' + esc(meta.title) + '</h3></div>' +
          (sec.summary ? '<p class="report-summary">' + esc(sec.summary) + '</p>' : '') +
          (sec.items && sec.items.length ? '<div class="claim-list">' + sec.items.map(function (it) {
            const cls = it.claimType === 'fact' ? 'badge-sage' : (it.claimType === 'suggestion' ? 'badge-amber' : 'badge-slate');
            return '<div class="claim-item"><div class="claim-tags"><span class="badge ' + cls + '">' + esc(NC.CLAIM_TYPE_LABELS[it.claimType] || '해석') + '</span>' + (it.term ? '<span class="badge badge-paper">' + esc(it.term) + '</span>' : '') + '</div><div>' + esc(it.text) + '</div></div>';
          }).join('') + '</div>' : '') +
          (sec.roadmapCards && sec.roadmapCards.length ? '<div class="roadmap-grid">' + sec.roadmapCards.map(function (c) {
            return '<div class="roadmap-card"><div class="roadmap-term">' + esc(c.term) + ' · ' + esc(c.goal) + '</div>' +
              '<div><strong>추천 탐구:</strong> ' + esc(c.topic) + '</div>' +
              (c.linkFrom ? '<div class="hint mt-8"><strong>연결:</strong> ' + esc(c.linkFrom) + '</div>' : '') +
              (c.subjectCheck ? '<div style="font-size:12px;color:var(--accent);background:var(--accent-soft);padding:5px 8px;border-radius:6px;margin-top:6px"><strong>교과 점검:</strong> ' + esc(c.subjectCheck) + '</div>' : '') +
            '</div>';
          }).join('') + '</div>' : '') +
        '</section>';
      }).join('')
    ) : '<section class="report-section"><p class="hint">③ 누적 서사 탭에서 AI 분석 결과를 가져오면 PART 2가 자동으로 채워집니다.</p></section>';

    const part3Html = (stu.inquiryPlans && stu.inquiryPlans.length > 0) ? (
      '<section class="report-section"><span class="report-part-badge">PART 3 · 2022 개정교육과정 성취기준 연계 심화 주제탐구</span>' +
      stu.inquiryPlans.map(function (p, idx) {
        return '<div class="card-subtle mb-8"><div class="badge-row mb-8"><span class="badge badge-sage">설계안 #' + (idx + 1) + '</span>' +
          (p.selectedStandards || []).map(function (st) { return '<span class="badge badge-slate">' + esc(st.subject + ' ' + st.code) + '</span>'; }).join('') +
        '</div><div style="font-size:13.5px">' + EC.renderSimpleMarkdown(p.resultMarkdown) + '</div></div>';
      }).join('') + '</section>'
    ) : '';

    const part4Html = rep ? (
      '<section class="report-section"><div class="report-sec-head"><span class="report-part-badge" style="margin:0">PART 4 · 상담자 실행 관리 기록</span>' +
      '<button type="button" class="btn btn-soft btn-sm no-print" id="btnSaveExec">실행 메모 저장</button></div>' +
      '<div class="exec-grid">' +
        '<div class="exec-box"><label for="execNote" style="font-size:12px;font-weight:700;display:block;margin-bottom:4px">상담 메모</label><textarea id="execNote" class="no-print" style="width:100%;min-height:68px;border:1px solid var(--line-strong);border-radius:6px;padding:7px">' + esc(rep.sessionNote || '') + '</textarea><div class="print-only-text" style="display:none;font-size:12.5px;white-space:pre-wrap">' + esc(rep.sessionNote || '기록 없음') + '</div></div>' +
        '<div class="exec-box"><label for="execPlan" style="font-size:12px;font-weight:700;display:block;margin-bottom:4px">합의한 향후 계획</label><textarea id="execPlan" class="no-print" style="width:100%;min-height:68px;border:1px solid var(--line-strong);border-radius:6px;padding:7px">' + esc(rep.agreedPlan || '') + '</textarea><div class="print-only-text" style="display:none;font-size:12.5px;white-space:pre-wrap">' + esc(rep.agreedPlan || '기록 없음') + '</div></div>' +
        '<div class="exec-box"><label for="execActual" style="font-size:12px;font-weight:700;display:block;margin-bottom:4px">확인된 실제 수행</label><textarea id="execActual" class="no-print" style="width:100%;min-height:68px;border:1px solid var(--line-strong);border-radius:6px;padding:7px">' + esc(rep.actualWork || '') + '</textarea><div class="print-only-text" style="display:none;font-size:12.5px;white-space:pre-wrap">' + esc(rep.actualWork || '기록 없음') + '</div></div>' +
      '</div></section>'
    ) : '';

    container.innerHTML = toolbar + '<article class="report-paper" id="reportPaper">' +
      '<div class="report-header">' +
        '<div class="report-kicker">UNIFIED STUDENT RECORD MASTER REPORT</div>' +
        '<h2 class="report-title">' + esc(rep ? rep.headline : (stu.code + ' 통합 학생부 진단 · 서사 · 주제탐구 리포트')) + '</h2>' +
        '<div class="report-meta-grid">' +
          '<div><span class="hint">학생 코드</span><br><strong>' + esc(stu.code) + '</strong></div>' +
          '<div><span class="hint">기준 학기 / 교육과정</span><br><strong>' + esc(stu.currentTerm) + ' / ' + esc(stu.curriculum || '2022') + '</strong></div>' +
          '<div><span class="hint">희망 계열·학과</span><br><strong>' + esc(stu.targetTrack) + '</strong></div>' +
          '<div><span class="hint">진로 설계 모드</span><br><strong>' + esc(NC.PATH_LABELS[stu.careerPath]) + '</strong></div>' +
        '</div>' +
      '</div>' +
      part1Html + part2Html + part3Html + part4Html +
      '<div class="print-footer-note">본 통합 리포트는 학생의 실제 학습과 탐구 방향 협의를 위한 정성 상담 지원 문서이며, 대학 합격 예측이나 공식 평가등급이 아닙니다.</div>' +
    '</article>';
  }

  function copyText(text, msg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { showToast(msg || '복사했습니다.'); }).catch(function () { fallbackCopy(text, msg); });
    } else fallbackCopy(text, msg);
  }
  function fallbackCopy(text, msg) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); showToast(msg || '복사했습니다.'); } catch (e) { showToast('복사 실패'); }
    document.body.removeChild(ta);
  }
  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function populateFieldOptions() {
    const sel = document.getElementById('fFieldId');
    if (!sel) return;
    sel.innerHTML = '<option value="">선택 안 함 (직접 입력)</option>' + EC.getFields().map(function (f) {
      return '<option value="' + esc(f.id) + '">' + esc(f.name) + ' (' + esc(f.cluster || '') + ')</option>';
    }).join('');
  }

  function openStudentModal(stu) {
    populateFieldOptions();
    state.editingStudentId = stu ? stu.id : null;
    document.getElementById('studentModalTitle').textContent = stu ? '학생 프로필 수정' : '새 학생 추가';
    document.getElementById('fCode').value = stu ? stu.code : '';
    document.getElementById('fCurrentTerm').value = stu ? stu.currentTerm : '2-1';
    document.getElementById('fCurriculum').value = stu ? (stu.curriculum || '2022') : '2022';
    document.getElementById('fFieldId').value = stu ? (stu.fieldId || '') : '';
    document.getElementById('fTargetTrack').value = stu ? stu.targetTrack : '';
    document.getElementById('fAltTrack').value = stu ? stu.altTrack : '';
    document.getElementById('fDiagnosisMode').value = stu ? stu.diagnosisMode : 'qualitative';
    document.getElementById('fCareerPath').value = stu ? stu.careerPath : 'maintain';
    document.getElementById('fGrades').value = stu ? (stu.grades || '') : '';
    document.getElementById('fCourses').value = stu ? (stu.courses || '') : '';
    document.getElementById('fPlannedSubjects').value = stu ? (stu.plannedSubjects || '') : '';
    document.getElementById('fConstraints').value = stu ? (stu.constraints || '') : '';
    document.getElementById('fNote').value = stu ? stu.counselorNote : '';
    openModal('studentModal');
  }

  function openSyncModal() {
    const c = state.syncConfig;
    document.getElementById('ghRepo').value = c.repo || '';
    document.getElementById('ghBranch').value = c.branch || 'main';
    document.getElementById('ghPath').value = c.path || 'json/student-master-backup.json';
    document.getElementById('ghToken').value = c.token || '';
    document.getElementById('ghAutoBackup').checked = Boolean(c.autoBackup);
    document.getElementById('ghLastUpload').textContent = '마지막 업로드: ' + (c.lastUploadAt || '기록 없음');
    document.getElementById('ghSyncStatus').innerHTML = '';
    openModal('syncModal');
  }

  function syncApiVisibility() {
    const p = document.getElementById('apiProvider').value;
    document.getElementById('apiEndpointWrap').style.display = p === 'openai' ? 'flex' : 'none';
    document.getElementById('apiModelWrap').style.display = p === 'local_proxy' ? 'none' : 'flex';
    document.getElementById('apiKeyWrap').style.display = p === 'local_proxy' ? 'none' : 'flex';
    document.getElementById('apiPersistWrap').style.display = p === 'local_proxy' ? 'none' : 'flex';
  }

  function openApiModal() {
    const c = state.apiConfig;
    document.getElementById('apiProvider').value = c.provider || 'gemini';
    document.getElementById('apiEndpoint').value = c.endpoint || 'https://api.openai.com/v1/chat/completions';
    document.getElementById('apiModel').value = c.model || 'gemini-2.5-flash';
    document.getElementById('apiKey').value = c.apiKey || '';
    document.getElementById('apiPersist').checked = Boolean(c.persist);
    syncApiVisibility();
    openModal('apiModal');
  }

  function bindEvents() {
    document.getElementById('studentSearch').addEventListener('input', function (e) { state.searchQuery = e.target.value; renderSidebar(); });
    document.getElementById('btnNewStudent').addEventListener('click', function () { openStudentModal(null); });
    document.getElementById('btnOpenSync').addEventListener('click', openSyncModal);
    document.getElementById('btnApiSettings').addEventListener('click', openApiModal);

    document.getElementById('btnSample').addEventListener('click', function () {
      const sample = NC.createMasterSampleStudent();
      const exists = state.store.students.find(function (s) { return s.code === sample.code; });
      if (exists) {
        state.selectedStudentId = exists.id;
        showToast('이미 불러온 통합 예시 학생(' + sample.code + ')을 선택했습니다.');
      } else {
        state.store.students.unshift(sample);
        state.selectedStudentId = sample.id;
        saveStore();
        showToast('통합 예시 학생(H2-URB01)을 불러왔습니다. 5개 탭을 모두 체험해 보세요.');
      }
      renderAll();
    });

    document.getElementById('btnExportJson').addEventListener('click', function () {
      downloadFile('student-master-backup-' + MS.todayStr() + '.json', JSON.stringify(state.store, null, 2), 'application/json');
      showToast('전체 통합 데이터를 JSON 파일로 다운로드했습니다.');
    });
    document.getElementById('btnImportJson').addEventListener('click', function () { document.getElementById('jsonFileInput').click(); });
    document.getElementById('jsonFileInput').addEventListener('change', function (e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        try {
          const parsed = JSON.parse(String(reader.result || ''));
          const incoming = Array.isArray(parsed.students) ? parsed.students : (Array.isArray(parsed) ? parsed : null);
          if (!incoming) throw new Error('students 배열이 없는 JSON 파일입니다.');
          const migrated = incoming.map(MS.migrateStudent);
          if (state.store.students.length === 0 || window.confirm('기존 학생 목록에 병합할까요? (취소를 누르면 전체 교체합니다)')) {
            const codes = new Set(state.store.students.map(function (s) { return s.code; }));
            migrated.forEach(function (m) { if (codes.has(m.code)) m.code += '-복원'; state.store.students.push(m); });
          } else {
            state.store.students = migrated;
          }
          if (state.store.students.length > 0) state.selectedStudentId = state.store.students[0].id;
          saveStore(); renderAll(); closeModal('syncModal');
          showToast(migrated.length + '명의 학생 데이터를 복원했습니다.');
        } catch (err) { showToast('JSON 복원 실패: ' + err.message); }
        e.target.value = '';
      };
      reader.readAsText(file, 'utf-8');
    });

    function readSyncForm() {
      return Object.assign({}, state.syncConfig, {
        repo: document.getElementById('ghRepo').value.trim(),
        branch: document.getElementById('ghBranch').value.trim() || 'main',
        path: document.getElementById('ghPath').value.trim() || 'json/student-master-backup.json',
        token: document.getElementById('ghToken').value.trim(),
        autoBackup: document.getElementById('ghAutoBackup').checked
      });
    }

    document.getElementById('syncForm').addEventListener('submit', function (e) {
      e.preventDefault();
      state.syncConfig = readSyncForm();
      MS.saveSyncConfig(state.syncConfig);
      renderStorageBadge();
      showToast('GitHub 동기화 설정을 저장했습니다.');
    });

    document.getElementById('btnGhPull').addEventListener('click', async function () {
      const cfg = readSyncForm();
      const statusBox = document.getElementById('ghSyncStatus');
      statusBox.innerHTML = '<div class="alert alert-success">GitHub 서버에서 최신 데이터를 가져오는 중…</div>';
      try {
        const res = await MS.githubPull(cfg);
        if (!res.store || !Array.isArray(res.store.students)) throw new Error('원격 JSON에 students 배열이 없습니다.');
        state.store = { schemaVersion: 3, students: res.store.students.map(MS.migrateStudent) };
        cfg.lastSha = res.sha; state.syncConfig = cfg; MS.saveSyncConfig(cfg);
        saveStore(true);
        if (state.store.students.length > 0) state.selectedStudentId = state.store.students[0].id;
        renderAll();
        statusBox.innerHTML = '<div class="alert alert-success">서버 동기화 완료! (' + state.store.students.length + '명 반영)</div>';
        showToast('GitHub 서버에서 최신 데이터를 동기화했습니다.');
      } catch (err) {
        statusBox.innerHTML = '<div class="alert alert-error">' + esc(err.message) + '</div>';
      }
    });

    document.getElementById('btnGhPush').addEventListener('click', async function () {
      const cfg = readSyncForm();
      const statusBox = document.getElementById('ghSyncStatus');
      statusBox.innerHTML = '<div class="alert alert-success">GitHub 서버로 업로드 중…</div>';
      try {
        const res = await MS.githubPush(cfg, state.store);
        cfg.lastSha = res.sha; cfg.lastUploadAt = res.uploadedAt;
        state.syncConfig = cfg; MS.saveSyncConfig(cfg);
        document.getElementById('ghLastUpload').textContent = '마지막 업로드: ' + res.uploadedAt;
        statusBox.innerHTML = '<div class="alert alert-success">서버 업로드 완료 (' + esc(res.uploadedAt) + ')</div>';
        showToast('GitHub 서버에 백업을 업로드했습니다.');
      } catch (err) {
        statusBox.innerHTML = '<div class="alert alert-error">' + esc(err.message) + '</div>';
      }
    });

    document.querySelectorAll('[data-close-modal]').forEach(function (b) { b.addEventListener('click', function () { closeModal(b.dataset.closeModal); }); });
    document.querySelectorAll('.modal-backdrop').forEach(function (bg) { bg.addEventListener('click', function (e) { if (e.target === bg) closeModal(bg.id); }); });

    document.getElementById('studentForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const code = document.getElementById('fCode').value.trim();
      const dup = state.store.students.find(function (s) { return s.code.toLowerCase() === code.toLowerCase() && s.id !== state.editingStudentId; });
      if (dup) { document.getElementById('studentModalError').innerHTML = '<div class="alert alert-error mb-12">이미 사용 중인 학생 코드입니다.</div>'; return; }
      const fields = {
        code: code,
        currentTerm: document.getElementById('fCurrentTerm').value,
        curriculum: document.getElementById('fCurriculum').value,
        fieldId: document.getElementById('fFieldId').value,
        targetTrack: document.getElementById('fTargetTrack').value.trim(),
        altTrack: document.getElementById('fAltTrack').value.trim(),
        diagnosisMode: document.getElementById('fDiagnosisMode').value,
        careerPath: document.getElementById('fCareerPath').value,
        grades: document.getElementById('fGrades').value.trim(),
        courses: document.getElementById('fCourses').value.trim(),
        plannedSubjects: document.getElementById('fPlannedSubjects').value.trim(),
        constraints: document.getElementById('fConstraints').value.trim(),
        counselorNote: document.getElementById('fNote').value.trim()
      };
      if (state.editingStudentId) {
        const s = state.store.students.find(function (x) { return x.id === state.editingStudentId; });
        if (s) Object.assign(s, fields);
      } else {
        const ns = Object.assign({ id: MS.uid('stu'), activities: [], setukEval: null, narrativeReports: [], inquiryPlans: [] }, fields);
        state.store.students.unshift(ns);
        state.selectedStudentId = ns.id;
      }
      saveStore(); closeModal('studentModal'); renderAll(); showToast('학생 정보를 저장했습니다.');
    });

    document.getElementById('apiProvider').addEventListener('change', syncApiVisibility);
    document.getElementById('apiForm').addEventListener('submit', function (e) {
      e.preventDefault();
      state.apiConfig = {
        provider: document.getElementById('apiProvider').value,
        endpoint: document.getElementById('apiEndpoint').value.trim(),
        model: document.getElementById('apiModel').value.trim(),
        apiKey: document.getElementById('apiKey').value.trim(),
        persist: document.getElementById('apiPersist').checked
      };
      MS.saveApiConfig(state.apiConfig); closeModal('apiModal'); renderTabContent(); showToast('AI API 설정을 저장했습니다.');
    });
    document.getElementById('btnClearApi').addEventListener('click', function () {
      state.apiConfig = { provider: 'gemini', endpoint: 'https://api.openai.com/v1/chat/completions', model: 'gemini-2.5-flash', apiKey: '', persist: false };
      MS.saveApiConfig(state.apiConfig); closeModal('apiModal'); renderTabContent(); showToast('API 설정 초기화 완료');
    });

    document.getElementById('btnBulkPreview').addEventListener('click', function () {
      const stu = getStu();
      const items = NC.parseBulkActivities(document.getElementById('bulkInput').value, document.getElementById('bulkDefaultTerm').value, document.getElementById('bulkType').value, document.getElementById('bulkSource').value, stu ? stu.activities : []);
      document.getElementById('bulkPreview').innerHTML = items.length === 0 ? '<div class="alert alert-warn">분리된 항목이 없습니다.</div>' :
        '<div class="card-subtle"><strong>추출 미리보기 (' + items.length + '건)</strong>' + items.map(function (it) { return '<div class="mt-8" style="font-size:12.5px"><span class="badge badge-slate">' + esc(it.code) + '</span> <span class="badge badge-paper">' + esc(it.term) + '</span> ' + esc(it.title) + '</div>'; }).join('') + '</div>';
    });
    document.getElementById('btnBulkApply').addEventListener('click', function () {
      const stu = getStu(); if (!stu) return;
      const items = NC.parseBulkActivities(document.getElementById('bulkInput').value, document.getElementById('bulkDefaultTerm').value, document.getElementById('bulkType').value, document.getElementById('bulkSource').value, stu.activities);
      if (!items.length) return;
      stu.activities = items.concat(stu.activities);
      saveStore(); document.getElementById('bulkInput').value = ''; closeModal('bulkModal'); renderAll();
      showToast(items.length + '건의 활동을 일괄 추가했습니다.');
    });

    document.getElementById('studentList').addEventListener('click', function (e) {
      const b = e.target.closest('[data-select-student]'); if (!b) return;
      state.selectedStudentId = b.dataset.selectStudent;
      state.editingActivityId = null; state.selectedReportId = null; state.compareMode = false; state.termFilter = 'all';
      renderAll();
    });

    document.getElementById('studentBannerCard').addEventListener('click', function (e) {
      const stu = getStu();
      if (e.target.closest('#btnBannerNew')) openStudentModal(null);
      else if (e.target.closest('#btnBannerSample')) document.getElementById('btnSample').click();
      else if (e.target.closest('#btnEditStudent') && stu) openStudentModal(stu);
      else if (e.target.closest('#btnDeleteStudent') && stu) {
        if (!window.confirm(stu.code + ' 학생의 모든 데이터를 삭제할까요?')) return;
        state.store.students = state.store.students.filter(function (s) { return s.id !== stu.id; });
        state.selectedStudentId = state.store.students[0] ? state.store.students[0].id : null;
        saveStore(); renderAll(); showToast('학생을 삭제했습니다.');
      }
    });

    document.getElementById('mainTabs').addEventListener('click', function (e) {
      const b = e.target.closest('[data-tab]'); if (!b) return;
      state.activeTab = b.dataset.tab; renderTabs(); renderTabContent();
    });

    const tabContent = document.getElementById('tabContent');

    tabContent.addEventListener('click', async function (e) {
      const stu = getStu(); if (!stu) return;

      const modeBtn = e.target.closest('[data-input-mode]');
      if (modeBtn) { state.inputMode = modeBtn.dataset.inputMode; renderTabContent(); return; }
      if (e.target.closest('#btnOpenBulk')) { document.getElementById('bulkDefaultTerm').value = stu.currentTerm; openModal('bulkModal'); return; }
      if (e.target.closest('#btnCancelEditAct')) { state.editingActivityId = null; renderTabContent(); return; }
      const termChip = e.target.closest('[data-term-filter]');
      if (termChip) { state.termFilter = termChip.dataset.termFilter; renderTabContent(); return; }
      const editAct = e.target.closest('[data-edit-act]');
      if (editAct) { state.editingActivityId = editAct.dataset.editAct; renderTabContent(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const delAct = e.target.closest('[data-del-act]');
      if (delAct) {
        if (!window.confirm('이 활동을 삭제할까요?')) return;
        stu.activities = stu.activities.filter(function (a) { return a.id !== delAct.dataset.delAct; });
        saveStore(); renderAll(); showToast('삭제했습니다.'); return;
      }

      if (e.target.closest('#btnCopySetukOneshot') && setukCore) {
        copyText(setukCore.buildPrompt('oneshot', buildSetukInputFromStudent(stu)), '세특 원샷 진단 프롬프트를 복사했습니다.'); return;
      }
      if (e.target.closest('#btnCopySetukStep1') && setukCore) {
        copyText(setukCore.buildPrompt('step1', buildSetukInputFromStudent(stu)), '세특 1단계 분해 프롬프트를 복사했습니다.'); return;
      }
      if (e.target.closest('#btnCalcSetuk')) {
        state.setukStep1Raw = document.getElementById('setukStep1Box').value;
        state.setukStep2Raw = document.getElementById('setukStep2Box').value;
        try {
          const inp = buildSetukInputFromStudent(stu);
          const s2Raw = NC.extractJsonFromText(state.setukStep2Raw);
          const s1 = state.setukStep1Raw.trim() ? NC.extractJsonFromText(state.setukStep1Raw) : (s2Raw.step1 || { records: [] });
          const s2 = s2Raw.step2 || s2Raw;
          const agg = setukScoring ? setukScoring.aggregate(inp, s1, s2) : null;
          stu.setukEval = { updatedAt: MS.todayStr(), input: inp, step1: s1, step2: s2, aggregated: agg };
          saveStore(); renderAll(); showToast('세특 6축 코드 채점이 완료되어 서사·주제탐구 탭에 자동 연계되었습니다.');
        } catch (err) { showToast('세특 JSON 파싱 오류: ' + err.message); }
        return;
      }

      if (e.target.closest('#btnCopyNarPrompt')) { copyText(NC.buildNarrativePrompt(stu), '누적 서사 분석 프롬프트를 복사했습니다.'); return; }
      if (e.target.closest('#btnRunNarApi')) {
        state.apiBusy = true; renderTabContent();
        try {
          const raw = await callConfiguredAi(NC.buildNarrativePrompt(stu), true);
          const norm = NC.normalizeNarrativeReport(NC.extractJsonFromText(raw), stu, 'AI 직접 분석');
          stu.narrativeReports.unshift(norm.report);
          state.selectedReportId = norm.report.id;
          saveStore(); state.apiBusy = false; state.activeTab = 'report'; renderAll();
          showToast('서사 분석 초안이 생성되었습니다.');
        } catch (err) { state.apiBusy = false; renderTabContent(); showToast(err.message); }
        return;
      }
      if (e.target.closest('#btnImportNarJson')) {
        try {
          const norm = NC.normalizeNarrativeReport(NC.extractJsonFromText(document.getElementById('narJsonArea').value), stu, '채팅 JSON');
          stu.narrativeReports.unshift(norm.report);
          state.selectedReportId = norm.report.id;
          saveStore(); state.activeTab = 'report'; renderAll();
          showToast('서사 리포트 초안을 가져왔습니다.');
        } catch (err) {
          document.getElementById('narImportFb').innerHTML = '<div class="alert alert-error">' + esc(err.message) + '</div>';
        }
        return;
      }

      const selSub = e.target.closest('[data-sel-sub]');
      if (selSub) { state.activeSubjectName = selSub.dataset.selSub; renderTabContent(); return; }
      const rmStd = e.target.closest('[data-rm-std]');
      if (rmStd) { state.selectedStandards.splice(parseInt(rmStd.dataset.rmStd, 10), 1); renderTabContent(); return; }
      if (e.target.closest('#btnCopyInqPrompt')) {
        state.inquiryFocusNote = document.getElementById('inqFocusInput').value;
        copyText(EC.buildInquiryPrompt(stu, state.selectedStandards, state.inquiryFocusNote), '2022 주제탐구 설계 프롬프트를 복사했습니다.'); return;
      }
      if (e.target.closest('#btnRunInqApi')) {
        state.inquiryFocusNote = document.getElementById('inqFocusInput').value;
        state.apiBusy = true; renderTabContent();
        try {
          const md = await callConfiguredAi(EC.buildInquiryPrompt(stu, state.selectedStandards, state.inquiryFocusNote), false);
          stu.inquiryPlans.unshift({ id: MS.uid('inq'), createdAt: MS.todayStr(), fieldId: stu.fieldId, selectedStandards: state.selectedStandards.slice(), focusNote: state.inquiryFocusNote, resultMarkdown: md });
          saveStore(); state.apiBusy = false; renderAll(); showToast('AI 주제탐구 설계안이 저장되었습니다.');
        } catch (err) { state.apiBusy = false; renderTabContent(); showToast(err.message); }
        return;
      }
      if (e.target.closest('#btnSaveInqPlan')) {
        const md = document.getElementById('inqResultArea').value.trim();
        if (!md) { showToast('저장할 탐구 설계 내용을 입력해 주세요.'); return; }
        stu.inquiryPlans.unshift({ id: MS.uid('inq'), createdAt: MS.todayStr(), fieldId: stu.fieldId, selectedStandards: state.selectedStandards.slice(), focusNote: document.getElementById('inqFocusInput').value.trim(), resultMarkdown: md });
        saveStore(); renderAll(); showToast('2022 주제탐구 설계안을 저장했습니다.'); return;
      }
      const delInq = e.target.closest('[data-del-inq]');
      if (delInq) {
        stu.inquiryPlans = stu.inquiryPlans.filter(function (p) { return p.id !== delInq.dataset.delInq; });
        saveStore(); renderAll(); showToast('탐구 설계안을 삭제했습니다.'); return;
      }

      if (e.target.closest('#btnToggleCompare')) { state.compareMode = !state.compareMode; renderTabContent(); return; }
      if (e.target.closest('#btnArchiveReport')) {
        const rep = stu.narrativeReports.find(function (r) { return r.id === state.selectedReportId; });
        if (rep && window.confirm('확정 버전으로 보관할까요?')) {
          rep.status = 'archived'; rep.inputSnapshot = NC.buildStudentSnapshot(stu);
          saveStore(); renderTabContent(); showToast('확정 보관 완료');
        }
        return;
      }
      if (e.target.closest('#btnCloneReport')) {
        const rep = stu.narrativeReports.find(function (r) { return r.id === state.selectedReportId; });
        if (rep) {
          const cl = JSON.parse(JSON.stringify(rep)); cl.id = MS.uid('rep'); cl.createdAt = MS.todayStr(); cl.status = 'draft';
          stu.narrativeReports.unshift(cl); state.selectedReportId = cl.id; saveStore(); renderAll(); showToast('새 초안으로 복제했습니다.');
        }
        return;
      }
      if (e.target.closest('#btnSaveExec')) {
        const rep = stu.narrativeReports.find(function (r) { return r.id === state.selectedReportId; });
        if (rep) {
          rep.sessionNote = document.getElementById('execNote').value.trim();
          rep.agreedPlan = document.getElementById('execPlan').value.trim();
          rep.actualWork = document.getElementById('execActual').value.trim();
          saveStore(); renderTabContent(); showToast('상담 실행 관리 기록을 저장했습니다.');
        }
        return;
      }
      if (e.target.closest('#btnPrintPdf')) {
        const rep = stu.narrativeReports.find(function (r) { return r.id === state.selectedReportId; });
        if (rep && document.getElementById('execNote')) {
          rep.sessionNote = document.getElementById('execNote').value.trim();
          rep.agreedPlan = document.getElementById('execPlan').value.trim();
          rep.actualWork = document.getElementById('execActual').value.trim();
          saveStore();
        }
        document.querySelectorAll('.print-only-text').forEach(function (el) { el.style.display = 'block'; });
        window.print();
        document.querySelectorAll('.print-only-text').forEach(function (el) { el.style.display = 'none'; });
        return;
      }
      if (e.target.closest('#btnCopyDocs')) {
        const rep = stu.narrativeReports.find(function (r) { return r.id === state.selectedReportId; }) || null;
        const md = MR.buildUnifiedMarkdown(stu, rep);
        const paper = document.getElementById('reportPaper');
        try {
          if (navigator.clipboard && window.ClipboardItem && paper) {
            const cl = paper.cloneNode(true);
            cl.querySelectorAll('.no-print').forEach(function (el) { el.remove(); });
            cl.querySelectorAll('.print-only-text').forEach(function (el) { el.style.display = 'block'; });
            await navigator.clipboard.write([new ClipboardItem({
              'text/html': new Blob(['<div style="font-family:sans-serif;line-height:1.6">' + cl.innerHTML + '</div>'], { type: 'text/html' }),
              'text/plain': new Blob([md], { type: 'text/plain' })
            })]);
            showToast('Google Docs용 서식 포함 통합 리포트를 복사했습니다.');
            return;
          }
        } catch (err) { /* fallback */ }
        copyText(md, '통합 리포트(Markdown)를 복사했습니다.');
        return;
      }
      if (e.target.closest('#btnDownloadMd')) {
        const rep = stu.narrativeReports.find(function (r) { return r.id === state.selectedReportId; }) || null;
        downloadFile(stu.code + '-통합마스터리포트-' + MS.todayStr() + '.md', MR.buildUnifiedMarkdown(stu, rep), 'text/markdown;charset=utf-8');
        showToast('통합 Markdown 리포트를 저장했습니다.');
      }
    });

    tabContent.addEventListener('change', function (e) {
      const stu = getStu(); if (!stu) return;
      if (e.target.id === 'bDiagMode') { stu.diagnosisMode = e.target.value; saveStore(); renderBanner(); renderTabContent(); }
      else if (e.target.id === 'bCareerPath') { stu.careerPath = e.target.value; saveStore(); renderBanner(); renderTabContent(); }
      else if (e.target.id === 'curGroupSel') { state.curGroupFilter = e.target.value; state.activeSubjectName = ''; renderTabContent(); }
      else if (e.target.dataset.toggleStd) {
        const code = e.target.dataset.toggleStd;
        if (e.target.checked) {
          if (!state.selectedStandards.some(function (x) { return x.code === code; })) {
            state.selectedStandards.push({ subject: e.target.dataset.stdSub, code: code, text: e.target.dataset.stdTxt });
          }
        } else {
          state.selectedStandards = state.selectedStandards.filter(function (x) { return x.code !== code; });
        }
        renderTabContent();
      }
      else if (e.target.id === 'reportSelect') { state.selectedReportId = e.target.value; renderTabContent(); }
      else if (e.target.id === 'selCompareA') { state.compareA = e.target.value; renderTabContent(); }
      else if (e.target.id === 'selCompareB') { state.compareB = e.target.value; renderTabContent(); }
    });

    tabContent.addEventListener('input', function (e) {
      if (e.target.id === 'curSearchInput') { state.curSearchQuery = e.target.value; renderTabContent(); }
    });

    tabContent.addEventListener('submit', function (e) {
      if (e.target.id !== 'activityForm') return;
      e.preventDefault();
      const stu = getStu(); if (!stu) return;
      const editingAct = state.editingActivityId ? stu.activities.find(function (a) { return a.id === state.editingActivityId; }) : null;
      const mode = editingAct ? editingAct.type : state.inputMode;
      const payload = {
        id: editingAct ? editingAct.id : MS.uid('act'),
        code: editingAct ? editingAct.code : MS.nextActivityCode(stu.activities),
        type: mode,
        term: document.getElementById('aTerm').value,
        status: document.getElementById('aStatus').value,
        source: document.getElementById('aSource').value,
        area: document.getElementById('aArea').value,
        subject: document.getElementById('aSubject').value.trim(),
        competency: document.getElementById('aComp').value,
        title: document.getElementById('aTitle').value.trim(),
        content: document.getElementById('aContent').value.trim(),
        method: mode === 'card' ? document.getElementById('aMethod').value.trim() : '',
        role: mode === 'card' ? document.getElementById('aRole').value.trim() : '',
        result: mode === 'card' ? document.getElementById('aResult').value.trim() : '',
        reflection: mode === 'card' ? document.getElementById('aReflection').value.trim() : '',
        connection: mode === 'card' ? document.getElementById('aConnection').value.trim() : ''
      };
      if (editingAct) {
        const idx = stu.activities.findIndex(function (a) { return a.id === editingAct.id; });
        if (idx >= 0) stu.activities[idx] = payload;
        state.editingActivityId = null;
      } else {
        stu.activities.unshift(payload);
      }
      saveStore(); renderAll(); showToast('활동(' + payload.code + ')을 저장했습니다.');
    });
  }

  loadStore();
  bindEvents();
  renderAll();
  autoPullOnStartup();
})();
