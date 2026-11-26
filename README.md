# 학생부 마스터 스튜디오 v3.0 (폴더형 통합 패키지)

**세특 6축 정밀 진단(`docu-ev`) · 학생 누적 서사 분석(`v2.5`) · 2022 개정교육과정 주제탐구 설계(`explan`)** 3개 프로그램을 단일 학생 보관함과 통합 마스터 리포트로 결합한 오프라인·GitHub Pages 겸용 통합 스튜디오입니다.

## 폴더 구조

```text
student-record-master-studio/
├── index.html                  # 메인 진입점 (PC 더블클릭 100% 오프라인 실행)
├── assets/
│   ├── style.css               # Sage Green 에디토리얼 페이퍼 디자인 + A4 인쇄 레이아웃
│   └── app.js                  # 5단계 통합 워크플로우 및 동기화 UI 컨트롤러
├── data/
│   ├── curriculum_2022.js      # 2022 개정교육과정 231과목 · 3,124 성취기준 · 30대 진로계열 DB
│   └── rubric_prompts.js       # 세특 6축 루브릭 · 스키마 · 프롬프트 번들
└── engine/
    ├── setuk_scoring.js        # 세특 6축(S1~S4, C1~C2) · 감점(P1~P8) · 상한 코드 계산기
    ├── setuk_core.js           # 세특 프롬프트 조립 · 근거 점검 엔진
    ├── store_sync.js           # 단일 학생 보관함 · localStorage · JSON 백업 · GitHub 5초 자동 동기화
    ├── narrative_core.js       # 1차 서사 대시보드 · 일괄 파서 · 10섹션 서사 프롬프트
    ├── explan_core.js          # 2022 과목/성취기준 검색 · 주제탐구 프롬프트 · 오프라인 마크다운 렌더러
    └── report_master.js        # 통합 마스터 리포트(PART 1~4) 생성기
```

## 바로 사용하기

1. **오프라인 실행:** 압축을 푼 뒤 `index.html`을 브라우저(Chrome/Edge/Safari)로 바로 여세요. 외부 CDN이나 서버 없이 100% 작동합니다.
2. **GitHub Pages 배포:** 이 폴더 내용을 그대로 GitHub 저장소 루트에 올리고 `Settings → Pages`를 켜면 즉시 온라인 웹앱으로 배포됩니다.
3. **데이터 동기화 & GitHub 자동 백업:** 상단 **「데이터 동기화 & 백업」** 버튼을 눌러 로컬 JSON 백업/복원 또는 GitHub Fine-Grained Access Token(`Contents: Read and write` 권한)을 입력해 기기 간 5초 자동 업로드를 켤 수 있습니다.
4. **3대 프로젝트 스킬 연동:**
   - ② 세특 정밀 진단 프롬프트 → `setuk-diagnosis` 스킬
   - ③ 누적 서사 분석 프롬프트 → `student-narrative-guide` 스킬
   - ④ 2022 과목·권장과목 심화 검토 → `hakjong-subject-advisor` 스킬
