/* ============================================================================
 * engine/explan_core.js
 * 2022 Curriculum (231 Subjects / 3,124 Standards / 30 Fields) Inquiry Engine
 * + Zero-CDN Lightweight Offline Markdown Renderer
 * ============================================================================ */
(function (global) {
  'use strict';

  function getCurriculum() {
    return Array.isArray(global.CURRICULUM) ? global.CURRICULUM : [];
  }

  function getFields() {
    return Array.isArray(global.FIELDS) ? global.FIELDS : [];
  }

  function getSubjectGroups() {
    const set = new Set();
    getCurriculum().forEach(function (c) { if (c.g) set.add(c.g); });
    return Array.from(set);
  }

  function findFieldById(id) {
    return getFields().find(function (f) { return f.id === id; }) || null;
  }

  function searchSubjects(query, groupFilter) {
    const q = String(query || '').trim().toLowerCase();
    return getCurriculum().filter(function (c) {
      if (groupFilter && groupFilter !== 'all' && c.g !== groupFilter) return false;
      if (!q) return true;
      if (String(c.c || '').toLowerCase().includes(q)) return true;
      if (String(c.g || '').toLowerCase().includes(q)) return true;
      return (c.u || []).some(function (u) {
        if (String(u.m || '').toLowerCase().includes(q)) return true;
        return (u.s || []).some(function (s) {
          return String(s[0] || '').toLowerCase().includes(q) || String(s[1] || '').toLowerCase().includes(q);
        });
      });
    });
  }

  function getCurriculumStats() {
    const cur = getCurriculum();
    let stdCount = 0;
    cur.forEach(function (c) {
      (c.u || []).forEach(function (u) { stdCount += (u.s || []).length; });
    });
    return {
      subjects: cur.length,
      standards: stdCount,
      fields: getFields().length
    };
  }

  function buildInquiryPrompt(student, selectedStandards, focusNote) {
    const NC = global.NarrativeCore;
    const field = findFieldById(student.fieldId);
    const brokenLinks = NC.extractSetukBrokenLinks(student);
    const latestRep = (student.narrativeReports && student.narrativeReports.length > 0) ? student.narrativeReports[0] : null;
    const roadmapSec = latestRep && latestRep.sections ? latestRep.sections.find(function (s) { return s.kind === 'roadmap'; }) : null;

    const lines = [
      '당신은 2022 개정교육과정 및 학생부종합전형(학종) 교과·세특 주제탐구 전문 설계자입니다.',
      '아래 학생의 실제 누적 활동, 세특 정밀 진단 결과(끊어진 고리), 서사 로드맵, 그리고 선택된 **2022 개정교육과정 실제 성취기준**을 정확히 연결하여 실행 가능한 심화 탐구 주제 2~3안을 설계해 주세요.',
      '',
      '[설계 필수 원칙]',
      '1. 화려한 키워드 나열이나 억지 진로 연결을 금지하고, 선택된 성취기준의 핵심 개념이 실제로 작동하는 탐구 과정(동기→과정→심화→배운 점)을 설계하세요.',
      '2. 세특 정밀 진단에서 지적된 "끊어진 고리"와 서사 로드맵의 보완 과제를 해결하는 방향으로 주제를 잡으세요.',
      '3. 제공된 성취기준 코드 외에 임의로 성취기준 번호를 창작하지 마세요. 세특 문장 대필은 금지합니다.',
      '4. 각 주제마다 ① 주제명 ② 연계 과목·성취기준 코드 ③ 기존 활동/진단 끊어진 고리와의 연결 ④ 3단계 탐구 방법·검증 기준 ⑤ 예상 한계 및 후속 질문 ⑥ 권장 산출물을 마크다운으로 명확히 작성하세요.',
      '',
      '[학생 기본 정보]',
      '- 학생 코드: ' + student.code + ' (현재 ' + student.currentTerm + ' / ' + (student.curriculum || '2022') + ' 교육과정)',
      '- 희망 진로/계열: ' + student.targetTrack + (field ? ' [선택 계열: ' + field.name + ' / 핵심과목: ' + (field.core || []).join(', ') + ']' : ''),
      '- 진로 설계 모드: ' + (NC.PATH_LABELS[student.careerPath] || student.careerPath) + (student.altTrack ? ' (대안/확장 대상: ' + student.altTrack + ')' : ''),
      '- 학교 여건·제약: ' + (student.constraints || '특이 제약 미입력'),
      ''
    ];

    if (brokenLinks.length > 0) {
      lines.push('[세특 정밀 진단에서 발견된 끊어진 고리 — 최우선 보완 대상]');
      brokenLinks.forEach(function (b) { lines.push('- [' + b.recordId + '] ' + b.link); });
      lines.push('');
    }

    if (roadmapSec && roadmapSec.roadmapCards && roadmapSec.roadmapCards.length > 0) {
      lines.push('[서사 분석 남은 학기 로드맵 요약]');
      roadmapSec.roadmapCards.forEach(function (c) {
        lines.push('- ' + c.term + ' (' + c.goal + '): ' + c.topic);
      });
      lines.push('');
    }

    lines.push('[기존 누적 활동 요약]');
    if (student.activities.length === 0) {
      lines.push('- 아직 입력된 기존 활동 없음 (초기 탐색 단계로 설계)');
    } else {
      student.activities.slice(0, 12).forEach(function (a) {
        lines.push('- [' + (a.code || a.id) + ' | ' + a.term + ' | ' + (NC.STATUS_LABELS[a.status] || a.status) + ' | ' + a.area + '] ' + a.title + ': ' + a.content.slice(0, 160));
      });
    }
    lines.push('');

    lines.push('[선택된 2022 개정교육과정 과목 및 실제 성취기준]');
    if (!selectedStandards || selectedStandards.length === 0) {
      lines.push('- 선택된 성취기준 없음 (학생 희망 진로에 맞는 대표 과목 기준으로 제안하되 성취기준 번호는 창작하지 말 것)');
    } else {
      selectedStandards.forEach(function (st) {
        lines.push('- [' + st.subject + ' · ' + st.code + '] ' + st.text);
      });
    }

    if (focusNote && focusNote.trim()) {
      lines.push('', '[상담자 추가 강조 사항]', focusNote.trim());
    }

    return lines.join('\n');
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function inlineFormat(line) {
    return escapeHtml(line)
      .replace(/`([^`]+)`/g, '<code style="background:var(--surface-alt);padding:1px 5px;border-radius:4px;font-family:var(--font-mono);font-size:12px">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  function renderSimpleMarkdown(md) {
    const lines = String(md || '').split('\n');
    const out = [];
    let inList = false;

    lines.forEach(function (rawLine) {
      const line = rawLine.trimEnd();
      const trimmed = line.trim();
      if (!trimmed) {
        if (inList) { out.push('</ul>'); inList = false; }
        return;
      }
      if (/^###\s+/.test(trimmed)) {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push('<h4 style="margin:12px 0 6px;color:var(--accent);font-size:14.5px">' + inlineFormat(trimmed.replace(/^###\s+/, '')) + '</h4>');
      } else if (/^##\s+/.test(trimmed)) {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push('<h3 style="margin:14px 0 6px;color:var(--ink);font-size:15.5px">' + inlineFormat(trimmed.replace(/^##\s+/, '')) + '</h3>');
      } else if (/^#\s+/.test(trimmed)) {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push('<h3 style="margin:14px 0 8px;color:var(--accent);font-size:16.5px">' + inlineFormat(trimmed.replace(/^#\s+/, '')) + '</h3>');
      } else if (/^([-*•]|\d+\.)\s+/.test(trimmed)) {
        if (!inList) { out.push('<ul style="margin:6px 0 8px 18px;padding:0">'); inList = true; }
        out.push('<li style="margin-bottom:4px">' + inlineFormat(trimmed.replace(/^([-*•]|\d+\.)\s+/, '')) + '</li>');
      } else {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push('<p style="margin:0 0 6px">' + inlineFormat(trimmed) + '</p>');
      }
    });
    if (inList) out.push('</ul>');
    return out.join('');
  }

  global.ExplanCore = {
    getCurriculum: getCurriculum,
    getFields: getFields,
    getSubjectGroups: getSubjectGroups,
    findFieldById: findFieldById,
    searchSubjects: searchSubjects,
    getCurriculumStats: getCurriculumStats,
    buildInquiryPrompt: buildInquiryPrompt,
    renderSimpleMarkdown: renderSimpleMarkdown
  };
})(window);
