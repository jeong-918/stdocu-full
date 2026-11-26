/* ============================================================================
 * engine/report_master.js
 * Unified Master Report Generator (Setuk + Narrative + 2022 Inquiry Plans)
 * ============================================================================ */
(function (global) {
  'use strict';

  function buildUnifiedMarkdown(stu, rep) {
    const NC = global.NarrativeCore;
    const lines = [
      '# 통합 학생부 진단 · 서사 · 주제탐구 마스터 리포트 — ' + stu.code,
      '',
      '- **기준 학기 / 교육과정:** ' + stu.currentTerm + ' / ' + (stu.curriculum || '2022') + ' 개정교육과정',
      '- **희망 계열·학과:** ' + stu.targetTrack + (stu.altTrack ? ' (검토 대안: ' + stu.altTrack + ')' : ''),
      '- **진단 방식 / 진로 방향:** ' + (NC.MODE_LABELS[rep ? rep.diagnosisMode : stu.diagnosisMode]) + ' / ' + (NC.PATH_LABELS[rep ? rep.careerPath : stu.careerPath]),
      '- **작성일:** ' + (rep ? rep.createdAt : global.MasterStore.todayStr()),
      ''
    ];

    if (stu.setukEval && stu.setukEval.aggregated) {
      const agg = stu.setukEval.aggregated;
      lines.push('## PART 1. 세특 서류평가 6축 정밀 진단 요약', '');
      const rec0 = agg.records && agg.records[0];
      if (rec0) {
        lines.push('- **종합 진단 등급:** ' + (rec0.final_grade || '-') + ' (' + (rec0.total != null ? rec0.total + '점' : '-') + ')');
      }
      const comp = agg.competency || (rec0 && rec0.competency);
      if (comp) {
        Object.keys(comp).forEach(function (k) {
          const c = comp[k];
          if (c && c.grade) lines.push('- **' + k + ':** ' + c.grade + (c.score != null ? ' (' + c.score + '점)' : ''));
        });
      }
      const links = NC.extractSetukBrokenLinks(stu);
      if (links.length > 0) {
        lines.push('- **발견된 끊어진 고리:** ' + links.map(function (l) { return '[' + l.recordId + '] ' + l.link; }).join(' / '));
      }
      lines.push('');
    }

    if (rep) {
      lines.push('## PART 2. 학기·학년 누적 서사 및 진로 방향성 (' + rep.headline + ')', '');
      NC.SECTION_META.forEach(function (meta) {
        const sec = (rep.sections || []).find(function (s) { return s.kind === meta.kind; });
        if (!sec) return;
        lines.push('### ' + meta.num + '. ' + meta.title);
        if (sec.summary) lines.push('', sec.summary);
        if (sec.items && sec.items.length) {
          lines.push('');
          sec.items.forEach(function (it) {
            const tag = '[' + (NC.CLAIM_TYPE_LABELS[it.claimType] || '해석') + (it.term ? ' · ' + it.term : '') + ']';
            lines.push('- **' + tag + '** ' + it.text);
          });
        }
        if (sec.roadmapCards && sec.roadmapCards.length) {
          lines.push('');
          sec.roadmapCards.forEach(function (c) {
            lines.push('- **' + (c.term || '남은 학기') + ' — ' + (c.goal || '') + ':** ' + (c.topic || '') + (c.subjectCheck ? ' *(교과 점검: ' + c.subjectCheck + ')*' : ''));
          });
        }
        lines.push('');
      });
    }

    if (stu.inquiryPlans && stu.inquiryPlans.length > 0) {
      lines.push('## PART 3. 2022 개정교육과정 성취기준 연계 심화 주제탐구 설계', '');
      stu.inquiryPlans.forEach(function (plan, idx) {
        lines.push('### 탐구 설계안 #' + (idx + 1) + ' (' + plan.createdAt + ')');
        if (plan.selectedStandards && plan.selectedStandards.length) {
          lines.push('- **선택 성취기준:** ' + plan.selectedStandards.map(function (st) { return st.subject + ' `' + st.code + '`'; }).join(', '));
        }
        if (plan.resultMarkdown) lines.push('', plan.resultMarkdown);
        lines.push('');
      });
    }

    if (rep) {
      lines.push('## PART 4. 상담자 실행 관리 기록', '');
      lines.push('- **상담 메모:** ' + (rep.sessionNote || '기록 없음'));
      lines.push('- **합의한 향후 계획 (수행 근거 아님):** ' + (rep.agreedPlan || '기록 없음'));
      lines.push('- **확인된 실제 수행:** ' + (rep.actualWork || '기록 없음'));
      lines.push('');
    }

    lines.push('> 본 리포트는 학생의 실제 학습과 탐구 방향 협의를 위한 정성 상담 지원 문서이며, 대학 합격 예측이나 공식 평가등급이 아닙니다.');
    return lines.join('\n');
  }

  global.MasterReport = {
    buildUnifiedMarkdown: buildUnifiedMarkdown
  };
})(window);
