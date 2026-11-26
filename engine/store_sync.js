/* ============================================================================
 * engine/store_sync.js
 * Unified Student Master Store + localStorage + JSON Backup + GitHub Auto-Sync
 * ============================================================================ */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'srm_studio_store_v3';
  const SYNC_CFG_KEY = 'srm_studio_github_sync_v1';
  const API_CFG_KEY = 'srm_studio_ai_api_v1';

  const TERMS = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2'];
  const ALL_TERMS = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', 'unknown'];
  const SOURCE_OPTIONS = ['학생부 원문', '결과물 발췌', '상담자 요약', '학생 진술'];

  function uid(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  function todayStr() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function formatKoTimestamp(date) {
    const d = date ? new Date(date) : new Date();
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
    });
  }

  function nextActivityCode(activities) {
    let maxNum = 0;
    (activities || []).forEach(function (a) {
      const m = String(a.code || a.id || '').match(/^A(\d+)$/i);
      if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
    });
    return 'A' + (maxNum + 1);
  }

  function normalizeTermString(str) {
    const s = String(str || '').trim();
    if (ALL_TERMS.includes(s)) return s;
    const mNum = s.match(/([1-3])\s*[-~]\s*([1-2])/);
    if (mNum) return mNum[1] + '-' + mNum[2];
    const mKor = s.match(/([1-3])\s*학년\s*([1-2])\s*학기/);
    if (mKor) return mKor[1] + '-' + mKor[2];
    return 'unknown';
  }

  function mapStatus(st) {
    if (st === '완료' || st === '수행' || st === 'completed') return 'completed';
    if (st === '진행 중' || st === '진행중' || st === 'ongoing') return 'ongoing';
    if (st === '계획' || st === '예정' || st === 'planned') return 'planned';
    return 'completed';
  }

  function migrateStudent(s) {
    const acts = [];
    (Array.isArray(s.activities) ? s.activities : []).forEach(function (a) {
      const code = a.code || (/^[A-Z0-9-]+$/i.test(String(a.id || '')) && String(a.id).length <= 12 ? a.id : nextActivityCode(acts));
      acts.push({
        id: a.id || uid('act'),
        code: code,
        type: a.type === 'note' ? 'note' : 'card',
        term: normalizeTermString(a.term || a.period || 'unknown'),
        status: mapStatus(a.status || a.state),
        source: SOURCE_OPTIONS.includes(a.source) ? a.source : '상담자 요약',
        area: a.area || '세특(교과)',
        subject: String(a.subject || '').trim(),
        competency: ['academic', 'career', 'both', 'community'].includes(a.competency) ? a.competency : 'both',
        title: String(a.title || '활동 기록').trim(),
        content: String(a.content || a.raw || a.question || '').trim(),
        method: String(a.method || '').trim(),
        role: String(a.role || '').trim(),
        result: String(a.result || '').trim(),
        reflection: String(a.reflection || a.limit || '').trim(),
        connection: String(a.connection || a.link || '').trim()
      });
    });

    let currentTerm = normalizeTermString(s.currentTerm || s.grade || '2-1');
    if (currentTerm === 'unknown') currentTerm = '2-1';

    return {
      id: s.id || uid('stu'),
      code: String(s.code || s.name || 'STUDENT').trim(),
      currentTerm: currentTerm,
      curriculum: s.curriculum === '2015' ? '2015' : '2022',
      fieldId: String(s.fieldId || '').trim(),
      targetTrack: String(s.targetTrack || s.career || s.targetMajor || '미정').trim(),
      altTrack: String(s.altTrack || s.targetCareer || '').trim(),
      grades: String(s.grades || '').trim(),
      courses: String(s.courses || '').trim(),
      plannedSubjects: String(s.plannedSubjects || s.subjects || '').trim(),
      constraints: String(s.constraints || '').trim(),
      diagnosisMode: (s.diagnosisMode === 'development' || s.mode === '발달단계') ? 'development' : 'qualitative',
      careerPath: (s.careerPath === 'expand' || s.path === '간접 확장') ? 'expand' : ((s.careerPath === 'transition' || s.path === '전환') ? 'transition' : 'maintain'),
      counselorNote: String(s.counselorNote || s.note || '').trim(),
      activities: acts,
      setukEval: s.setukEval || null,
      narrativeReports: Array.isArray(s.narrativeReports) ? s.narrativeReports : (Array.isArray(s.reports) ? s.reports : []),
      inquiryPlans: Array.isArray(s.inquiryPlans) ? s.inquiryPlans : []
    };
  }

  function testStorage() {
    try {
      const k = '__srm_test__';
      global.localStorage.setItem(k, '1');
      global.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  /* UTF-8 safe Base64 helpers for GitHub Contents API */
  function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  function base64ToUtf8(b64) {
    const clean = String(b64 || '').replace(/\s+/g, '');
    const bin = atob(clean);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8').decode(bytes);
  }

  function defaultSyncConfig() {
    return {
      repo: '',
      branch: 'main',
      path: 'json/student-master-backup.json',
      token: '',
      autoBackup: false,
      lastUploadAt: '',
      lastSha: ''
    };
  }

  function defaultApiConfig() {
    return {
      provider: 'gemini',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gemini-2.5-flash',
      apiKey: '',
      persist: false
    };
  }

  function loadSyncConfig() {
    try {
      const raw = global.localStorage.getItem(SYNC_CFG_KEY);
      return raw ? Object.assign(defaultSyncConfig(), JSON.parse(raw)) : defaultSyncConfig();
    } catch (e) {
      return defaultSyncConfig();
    }
  }

  function saveSyncConfig(cfg) {
    try {
      global.localStorage.setItem(SYNC_CFG_KEY, JSON.stringify(cfg));
    } catch (e) { /* ignore */ }
  }

  function loadApiConfig() {
    try {
      const raw = global.localStorage.getItem(API_CFG_KEY);
      return raw ? Object.assign(defaultApiConfig(), JSON.parse(raw)) : defaultApiConfig();
    } catch (e) {
      return defaultApiConfig();
    }
  }

  function saveApiConfig(cfg) {
    try {
      if (cfg.persist || cfg.provider === 'local_proxy') {
        global.localStorage.setItem(API_CFG_KEY, JSON.stringify(cfg));
      } else {
        global.localStorage.removeItem(API_CFG_KEY);
      }
    } catch (e) { /* ignore */ }
  }

  /* GitHub REST API v3 Contents Push/Pull */
  async function githubPull(cfg) {
    if (!cfg.repo || !cfg.path || !cfg.token) {
      throw new Error('GitHub 저장소(owner/repo), 파일 경로, Access Token을 모두 입력해 주세요.');
    }
    const url = 'https://api.github.com/repos/' + cfg.repo.trim() + '/contents/' + cfg.path.trim().replace(/^\/+/, '') + '?ref=' + encodeURIComponent((cfg.branch || 'main').trim());
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': 'Bearer ' + cfg.token.trim(),
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    if (res.status === 404) {
      throw new Error('원격 저장소에 해당 백업 파일이 아직 없습니다. 먼저 「서버 업로드」를 실행해 주세요.');
    }
    if (!res.ok) {
      const t = await res.text();
      throw new Error('GitHub 동기화 오류 (' + res.status + '): ' + t.slice(0, 160));
    }
    const data = await res.json();
    const decoded = base64ToUtf8(data.content || '');
    const parsed = JSON.parse(decoded);
    return { store: parsed, sha: data.sha || '' };
  }

  async function githubPush(cfg, storeObj) {
    if (!cfg.repo || !cfg.path || !cfg.token) {
      throw new Error('GitHub 저장소(owner/repo), 파일 경로, Access Token을 모두 입력해 주세요.');
    }
    const cleanPath = cfg.path.trim().replace(/^\/+/, '');
    const branch = (cfg.branch || 'main').trim();
    const baseUrl = 'https://api.github.com/repos/' + cfg.repo.trim() + '/contents/' + cleanPath;
    const headers = {
      'Accept': 'application/vnd.github+json',
      'Authorization': 'Bearer ' + cfg.token.trim(),
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    let sha = cfg.lastSha || '';
    try {
      const checkRes = await fetch(baseUrl + '?ref=' + encodeURIComponent(branch), { method: 'GET', headers: headers });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData && checkData.sha) sha = checkData.sha;
      } else if (checkRes.status === 404) {
        sha = '';
      }
    } catch (e) { /* proceed with cached sha */ }

    const payload = {
      message: 'chore: sync student master studio backup (' + todayStr() + ')',
      content: utf8ToBase64(JSON.stringify(storeObj, null, 2)),
      branch: branch
    };
    if (sha) payload.sha = sha;

    const putRes = await fetch(baseUrl, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(payload)
    });
    if (!putRes.ok) {
      const t = await putRes.text();
      throw new Error('GitHub 업로드 오류 (' + putRes.status + '): ' + t.slice(0, 180));
    }
    const putData = await putRes.json();
    return {
      sha: (putData && putData.content && putData.content.sha) ? putData.content.sha : sha,
      uploadedAt: formatKoTimestamp(new Date())
    };
  }

  global.MasterStore = {
    STORAGE_KEY: STORAGE_KEY,
    TERMS: TERMS,
    ALL_TERMS: ALL_TERMS,
    SOURCE_OPTIONS: SOURCE_OPTIONS,
    uid: uid,
    todayStr: todayStr,
    formatKoTimestamp: formatKoTimestamp,
    nextActivityCode: nextActivityCode,
    normalizeTermString: normalizeTermString,
    migrateStudent: migrateStudent,
    testStorage: testStorage,
    utf8ToBase64: utf8ToBase64,
    base64ToUtf8: base64ToUtf8,
    loadSyncConfig: loadSyncConfig,
    saveSyncConfig: saveSyncConfig,
    loadApiConfig: loadApiConfig,
    saveApiConfig: saveApiConfig,
    githubPull: githubPull,
    githubPush: githubPush
  };
})(window);
