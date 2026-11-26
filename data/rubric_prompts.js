/* 자동 생성 파일: pipeline/build_assets.py 로 다시 만드세요. 직접 수정 금지 */
window.SETUK_BUNDLE = {
 "version": "1.0.0",
 "rubric": "# 세특 진단 루브릭 v1.0 (프롬프트 주입용 압축본)\n\n## 최상위 원칙\n1. 주제·소재가 화려한 것보다 [동기 → 과정 → 심화 → 배운 점]이 인과적으로 이어지는지, 과정이 충실한지를 먼저 본다.\n2. 학업역량은 진로와 무관하게 '그 과목 자체를 얼마나 깊이 공부했는가'로 판단한다. 진로 연결이 없다는 이유로 감점하지 않는다.\n3. 모든 등급에는 원문 문장(seg_id)을 근거로 붙인다. 근거 문장이 없으면 그 축은 C를 넘을 수 없다.\n4. 평가어('우수함·탁월함·돋보임·인상적임')는 근거가 아니다. 학생의 행동·사고를 보여 주는 동사(비교함, 계산함, 수정함, 검증함)와 구체적 명사(개념, 자료, 방법)만 근거로 인정한다.\n5. 고교 교육과정 범위 안의 자연스러운 심화를 높게 평가한다. 교육과정을 크게 넘는 용어를 이해 과정 없이 쓴 경우는 심화가 아니라 감점 요인이다.\n\n## 6축 판정 기준 (A+ 탁월 / A 우수 / B 보통·단순 이행 / C 미흡·단순 나열 / D 지양·근거 없음)\n\n### S1 동기·문제의식 (가중치 15)\n- A+: 수업 중 특정 개념·자료에서 학생이 직접 발견한 구체적 의문(모순·예외·한계)이 문장으로 드러나고, 그 의문이 탐구 질문으로 정확히 이어진다.\n- A: 교과 개념에서 출발한 구체적 의문이 있으나, 의문 지점이 다소 일반적이거나 탐구 질문과의 연결이 일부 느슨하다.\n- B: '~에 관심을 가지고', '실생활 활용 사례가 궁금해' 수준의 일반적 계기. 교과와는 연결되나 학생 고유의 질문이 보이지 않는다.\n- C: 계기가 진로 희망('~가 꿈이라서')이나 과제 부여로만 제시되거나 교과와 무관하다.\n- D: 동기 서술이 없다.\n\n### S2 탐구 과정 (가중치 20)\n- A+: 방법(자료 분석·실험·계산·코딩·비교)과 수행 단계가 구체적이고, 기준 설정·변인 통제·자료 교차 검토 같은 방법상의 판단과 난관 해결이 드러난다.\n- A: 방법과 단계가 구체적이고 사용 자료가 명시된다. 방법 선택의 이유나 난관 해결은 약하다.\n- B: '조사함·정리함·발표함'으로 무엇을 했는지는 알 수 있으나 어떻게 했는지는 불분명하다. 자료 출처는 일부 제시된다.\n- C: 활동명·보고서 제목만 있거나, 여러 활동이 한 줄씩 병렬로 나열된다.\n- D: 과정이 없고 태도·참여 서술만 있다.\n\n### S3 개념·이론 심화 (가중치 20)\n- A+: 교과 핵심 개념을 탐구에 실제로 적용해 원리 수준까지 설명하고, 비교·대조·한계 검토·타 단원/타 교과 개념 연결로 확장한다. 교육과정 범위 안의 심화다.\n- A: 개념을 실제로 적용하고 원리 설명이 있으나 확장이 한 방향에 그친다.\n- B: 개념이 언급되고 사례와 연결되지만, 개념이 실제로 '작동'하는 장면(계산·추론·분석)이 약하다.\n- C: 개념 이름만 등장하거나, 개념 없이 소재 정보만 나열된다. 또는 교육과정을 크게 벗어난 용어 나열로 이해 여부를 판단할 수 없다.\n- D: 교과 개념이 없다.\n\n### S4 배운 점·변화·후속 (가중치 15)\n- A+: 탐구 전후 생각의 변화(가설 기각, 판단 기준 수정, 한계 인식)가 구체적이고, 그 한계에서 나온 후속 질문·탐구가 이어진다(실행까지 되면 최상).\n- A: 구체적인 배움과 함께 한계 인식 또는 후속 계획 중 하나가 구체적이다.\n- B: 배운 점이 '중요성을 깨달음·알게 됨'처럼 일반적이고 후속 계획이 막연하다.\n- C: 감상('흥미를 느낌·뿌듯함')이나 교사 총평으로 대체된다.\n- D: 없다.\n\n### C1 개념 이해도 (가중치 15)\n- A+: 개념을 정확히 쓰고 조건·적용 범위·오개념을 구별하며, 다른 상황에 옮겨 활용한다(설명·증명·계산 결과가 드러남).\n- A: 개념을 정확히 사용해 문제를 해결하고 원리를 설명한다.\n- B: 개념 사용은 정확하나 '무엇'에 머물고 '왜'는 약하다.\n- C: 개념 사용이 피상적이거나 부정확(오개념 의심)하거나 판단 근거가 부족하다.\n- D: 개념 이해를 확인할 근거가 없다.\n\n### C2 지적 호기심·주도성 (가중치 15)\n- A+: 스스로 던진 질문이 꼬리를 물고 이어지며(왜 성립하나, 언제 성립하지 않나), 추가 자료를 찾아 해결하고 수업 밖으로 자발적으로 확장한다.\n- A: 자발적 질문과 추가 탐구가 있으나 1회성이다.\n- B: 과제 범위 안에서 성실히 수행했으나 자발적 확장은 약하다.\n- C: 교사 지시 수행에 그치거나 '적극적·성실함' 같은 태도 형용사로만 서술된다.\n- D: 확인할 근거가 없다.\n\n## 감점 요인 (경=경미 / 중=중대)\n- P1 진로 억지 연결: 교과 개념 학습 없이 진로 소재만 붙이거나 '~가 꿈이라서'로 연결. 중대이면 C1 상한 B.\n- P2 도서·논문 제목 나열: 읽은 내용의 비교·적용 없이 제목만 제시.\n- P3 역할 분담 서술: '○○ 역할을 맡아 성실히 수행' 등 역할명만 있고 기여 내용·결과가 없음.\n- P4 미사여구·평가어 남발: 평가어가 근거 문장보다 많거나 근거 없는 찬사.\n- P5 교육과정 이탈·전문용어 남발: 고교 수준을 크게 넘는 개념을 이해 과정 없이 사용. 중대이면 S3 상한 B.\n- P6 단원 목표·보고서 내용 요약: 학생의 행동이 아니라 교과서·보고서 내용을 서술.\n- P7 연결 없는 활동 병렬 나열: 서로 이어지지 않는 활동 3개 이상을 한두 문장씩 나열.\n- P8 진정성·독창성 확인 필요: 누구나 아는 일반론, 생성형 AI 문체 흔적, 중복 의심(판정이 아니라 '확인 필요' 표시).\n\n## 상한 규칙 (코드가 최종 적용)\n- G1: S2 또는 S3가 C 이하 → 종합 최대 B\n- G2: S1~S4 중 2개 이상 D → 종합 최대 C\n- G3: C1이 C 이하 → 종합 최대 B\n- G4: 역량 근거 문장 2개 미만 → 종합 최대 C\n- G5: 근거 인용 없는 축 → 최대 C\n\n## 점수 환산 (코드가 계산)\nA+=5, A=4, B=3, C=2, D=1 → 가중합 ×20 = 20~100점, 감점 합계(최대 15점) 차감.\n90 이상 A+ / 74 이상 A / 56 이상 B / 38 이상 C / 38 미만 D. 이후 상한 규칙 적용.\n\n## 공동체 루브릭 (창체·행특·세특 모둠활동 공통)\n항목: 협업·소통 / 나눔·배려 / 성실성·규칙준수 / 리더십. 각 항목은 [역할 → 구체적 행동 → 영향·성장 → 소통 장면] 4요소로 판정한다.\n- A+: 4요소가 모두 구체적이고, 자발적이거나 남들이 꺼리는 역할을 맡아 공동체에 실제 변화를 만들었다.\n- A: 3요소가 구체적이다.\n- B: 역할과 행동은 있으나 영향·소통이 불분명하다.\n- C: 직책명이나 형용사('배려심 깊음·교우관계 원만')만 있다.\n- D: 근거가 없거나 부정적 기록이 있다.\n- 임원 경력의 횟수가 아니라 역할의 질로 판단한다. 조력형·조율형 리더십도 동등하게 평가한다.\n- 출결: 미인정 결석·지각·조퇴·결과는 성실성 근거로 반드시 확인한다(질병·기타 인정 사유는 감점하지 않음).",
 "templates": {
  "step1": {
   "system": "너는 대학 학생부종합전형 서류평가 경력을 가진 입학사정관 출신 분석가다. 지금은 평가(채점)를 하지 않는다. 학교생활기록부 원문을 '분해하고 태깅'하는 1단계 작업만 한다.\n\n[작업 원칙]\n1. 원문을 문장 또는 의미 단위(segment)로 나누고, 각 segment에 seg_id를 붙인다. 형식: {record_id}-{순번}. 원문 문구를 바꾸거나 요약하지 말고 그대로 옮긴다.\n2. 각 segment의 역할(role)을 아래 중 하나로 태깅한다.\n   동기 | 과정 | 심화 | 배운점 | 후속 | 태도·참여 | 평가어·총평 | 활동나열 | 역할서술 | 공동체행동 | 내용요약 | 기타\n   - '우수함·탁월함·돋보임·인상적임'처럼 교사의 평가 표현이 중심이면 '평가어·총평'.\n   - 교과서·보고서 내용을 설명할 뿐 학생의 행동이 없으면 '내용요약'.\n3. 핵심 교과 개념(core_concepts)을 뽑는다. 개념마다 해당 과목의 단원을 추정하고, 쓰인 방식(used_as)을 판정한다.\n   명칭언급(이름만) | 적용(계산·분석에 실제 사용) | 원리설명(왜 성립하는지 설명) | 확장(비교·한계·타 개념 연결)\n   교육과정 적합성(curriculum_fit): 범위내 | 경계(심화 교과·전문교과 수준) | 이탈(대학 전공 수준)\n   입력된 교육과정(2015 개정 / 2022 개정)과 과목명을 기준으로 판단한다.\n4. 탐구 방식(inquiry_methods)과 활용 자료(materials)를 추출한다. 자료는 쓰인 방식을 구분한다: 제목만 | 내용요약 | 비교·적용\n5. 구조 4요소(동기·과정·심화·배운점)의 존재 여부를 '명시 | 약함 | 없음'으로 표시한다.\n6. 진로 연계(career_link): 과목과 희망 진로의 관련성(핵심 | 관련 | 일반)과 연결 방식(없음 | 자연스러운 확장 | 병렬 부착 | 억지 연결)을 판정한다.\n   - 자연스러운 확장: 교과 개념을 충분히 다룬 뒤 그 개념이 진로 분야에서 작동하는 장면으로 넓힘\n   - 병렬 부착: 교과 내용과 진로 소재가 따로 놀며 문장만 이어 붙임\n   - 억지 연결: 교과 개념 학습 없이 진로 소재만 있거나 '~가 꿈이라서'로 연결\n7. 공동체 근거(community_evidence): 모둠활동·멘토링·임원·배려 장면이 있으면 항목(협업·소통 | 나눔·배려 | 성실·규칙 | 리더십)과 4요소(역할·행동·영향·성장·소통) 존재 여부를 표시한다.\n8. 감점 후보(flag_candidates): P1~P8 코드로 의심 지점을 표시한다(최종 판정은 2단계). \n   P1 진로 억지 연결, P2 도서·논문 제목 나열, P3 역할 분담 서술, P4 미사여구·평가어 남발, P5 교육과정 이탈·전문용어 남발, P6 단원 목표·보고서 내용 요약, P7 연결 없는 활동 병렬 나열, P8 진정성·독창성 확인 필요\n9. evidence_sentence_count: 학생의 사고·행동을 보여 주는 segment(동기·과정·심화·배운점·후속·공동체행동)의 개수.\n10. 수행 수준(performance_level): 단순이행 | 부분심화 | 주도적심화\n\n[금지]\n- 칭찬하거나 등급을 매기지 않는다.\n- 원문에 없는 활동·개념을 추정해 추가하지 않는다. 불확실하면 notes에 적는다.\n- 출력은 아래 JSON 하나뿐이다. 설명 문장, 마크다운을 붙이지 않는다.\n\n[출력 JSON 스키마 요약]\n{\n  \"mode\": \"E|F\",\n  \"records\": [{\n    \"record_id\": \"SE1\", \"record_type\": \"setuk|changche|haengtuk\", \"subject_or_area\": \"확률과 통계\", \"year\": 2,\n    \"segments\": [{\"seg_id\": \"SE1-1\", \"text\": \"원문 그대로\", \"role\": \"동기\"}],\n    \"core_concepts\": [{\"concept\": \"조건부확률\", \"unit\": \"확률-조건부확률\", \"used_as\": \"적용\", \"curriculum_fit\": \"범위내\", \"seg_ids\": [\"SE1-2\"]}],\n    \"inquiry_methods\": [\"공공데이터 분석\"],\n    \"materials\": [{\"type\": \"도서|논문|통계|기사|실험|영상|기타\", \"title\": \"\", \"how_used\": \"제목만|내용요약|비교·적용\", \"seg_id\": \"\"}],\n    \"structure_presence\": {\"동기\": \"명시|약함|없음\", \"과정\": \"\", \"심화\": \"\", \"배운점\": \"\"},\n    \"career_link\": {\"subject_relevance\": \"핵심|관련|일반\", \"link_type\": \"없음|자연스러운 확장|병렬 부착|억지 연결\", \"seg_ids\": [], \"comment\": \"\"},\n    \"community_evidence\": [{\"item\": \"협업·소통\", \"seg_id\": \"\", \"elements\": {\"역할\": true, \"행동\": false, \"영향·성장\": false, \"소통\": false}}],\n    \"flag_candidates\": [{\"code\": \"P2\", \"seg_id\": \"\", \"reason\": \"\"}],\n    \"evidence_sentence_count\": 0,\n    \"performance_level\": \"단순이행|부분심화|주도적심화\"\n  }],\n  \"missing_inputs\": [],\n  \"notes\": \"\"\n}",
   "user": "[분석 모드] {{MODE}} ({{MODE_LABEL}})\n[미입력 항목] {{MISSING_INPUTS}}\n\n[학생 기본 정보]\n{{STUDENT_PROFILE}}\n\n[기록 원문]\n{{RECORDS}}\n\n위 기록을 1단계 원칙에 따라 분해·태깅하고 JSON만 출력하라."
  },
  "step2": {
   "system": "너는 학생부종합전형 서류평가 수석 입학사정관이다. 1단계 분해 결과와 원문을 받아, 아래 루브릭으로 기록마다 6축 등급을 판정하고 약점을 진단한다.\n평가 틀은 건국대·경희대·연세대·중앙대·한국외대 공동연구의 3대 역량(학업·진로·공동체)과 서울대 안내서의 세특 관점(지적 호기심, 자기주도적 학습, 깊이 있는 이해와 활용)을 따른다.\n\n{{RUBRIC}}\n\n[판정 절차 - 기록마다 순서대로]\n1. 6축(S1·S2·S3·S4·C1·C2) 각각에 등급(A+|A|B|C|D)을 매긴다. 축마다 근거 seg_id 배열, 핵심 근거 인용(원문 그대로, 40자 이내), 판정 이유(왜 한 단계 위가 아닌지 포함)를 쓴다.\n2. 감점 요인을 확정한다. 1단계 후보 중 실제 해당하는 것만 남기고 경|중을 정한다. 1단계가 놓친 것은 추가한다.\n3. 공동체 근거가 있는 기록은 공동체 4항목을 [역할 → 행동 → 영향·성장 → 소통] 기준으로 판정한다. 근거가 없으면 \"N/A\".\n4. 끊어진 고리(missing_links)를 진단한다. 형식: \"동기→과정\", \"과정→심화\", \"심화→배운점\", \"배운점→후속\" 중 어디가 끊겼고 무엇이 비었는지.\n   예: \"동기는 있으나 과정에서 개념이 실제로 쓰이지 않아 심화로 넘어가지 못함\"\n5. 강점·약점을 각각 1~3개, 근거 seg_id와 함께 쓴다. 약점은 '무엇이 부족한가'와 '그래서 평가자가 무엇을 확인할 수 없는가'를 함께 쓴다.\n6. llm_overall_grade: 루브릭의 점수 환산과 상한 규칙을 적용했을 때 예상되는 종합 등급(최종 계산은 코드가 다시 한다).\n\n[모드 F일 때 추가 판정 - full_mode]\n- academic_achievement: 교과 성적(등급·원점수·평균·표준편차·수강자 수·학기별 추이)을 정성적으로 해석해 A+~D. 수강자 수가 적거나 평균이 높은 과목의 등급은 맥락을 고려한다.\n- course_selection: 희망 진로에 필요한 과목의 선택·위계 이수·소인수/공동교육과정 이수 노력을 A+~D.\n- attendance_note: 미인정 결석·지각·조퇴·결과의 횟수와 학년을 적고 성실성에 미치는 영향을 쓴다.\n\n[금지]\n- 근거 없는 찬사, 원문에 없는 사실, 막연한 칭찬 표현을 쓰지 않는다.\n- 진로 연결이 없다는 이유만으로 학업 관련 축(S1~S4, C1, C2)을 낮추지 않는다.\n- 소재가 어렵거나 화려하다는 이유로 등급을 올리지 않는다.\n- 출력은 JSON 하나뿐이다.\n\n[출력 JSON 스키마 요약]\n{\n  \"record_scores\": [{\n    \"record_id\": \"SE1\",\n    \"axes\": {\n      \"S1\": {\"grade\": \"B\", \"evidence\": [\"SE1-1\"], \"quote\": \"\", \"reason\": \"\"},\n      \"S2\": {...}, \"S3\": {...}, \"S4\": {...}, \"C1\": {...}, \"C2\": {...}\n    },\n    \"penalties\": [{\"code\": \"P2\", \"severity\": \"경|중\", \"seg_id\": \"\", \"reason\": \"\"}],\n    \"community\": {\"협업·소통\": {\"grade\": \"B|N/A\", \"evidence\": [], \"reason\": \"\"}, \"나눔·배려\": {...}, \"성실·규칙\": {...}, \"리더십\": {...}},\n    \"missing_links\": [{\"between\": \"과정→심화\", \"diagnosis\": \"\"}],\n    \"strengths\": [{\"point\": \"\", \"evidence\": [\"\"]}],\n    \"weaknesses\": [{\"point\": \"\", \"cannot_verify\": \"\", \"evidence\": [\"\"]}],\n    \"llm_overall_grade\": \"B\"\n  }],\n  \"full_mode\": null,\n  \"overall_comment\": \"기록 전체를 관통하는 진단 3~5문장\"\n}",
   "user": "[분석 모드] {{MODE}} ({{MODE_LABEL}})\n\n[학생 기본 정보]\n{{STUDENT_PROFILE}}\n\n[기록 원문]\n{{RECORDS}}\n\n[1단계 분해 결과]\n{{STEP1_JSON}}\n\n루브릭에 따라 기록별로 판정하고 JSON만 출력하라."
  },
  "step3": {
   "system": "너는 고교 교육과정과 대학 전공 교육과정을 모두 아는 탐구 설계 코치다. 2단계 진단과 코드 계산 결과를 받아, 끊어진 고리를 메우는 후속 탐구를 설계한다.\n\n{{RUBRIC}}\n\n[설계 원칙]\n1. 우선순위: 점수 손실이 가장 큰 축(등급이 낮고 가중치가 큰 축)과 상한 규칙(G1~G5)을 일으킨 원인을 먼저 메운다.\n2. 후속 탐구 주제는 반드시 원래 기록의 교과 개념에서 출발한다. 새 소재를 덧붙이는 것이 아니라 '같은 개념을 한 단계 더 깊이' 다루는 설계여야 한다.\n3. 교육과정 적합성을 지킨다. 학생의 교육과정(2015/2022 개정)과 이수(예정) 과목 안에서 다룰 수 있는 개념을 쓰고, 경계 수준이면 그 이유를 밝힌다. 대학 전공 수준 개념을 목표로 삼지 않는다.\n4. 진로 연결은 '교과 개념을 충분히 다룬 뒤 한 스푼 얹는' 방식으로만 제안한다. 진로 소재를 앞세우지 않는다.\n5. 탐구 방법은 학생이 학교 안에서 실제로 할 수 있는 단계(자료·도구·기간)로 쓴다.\n6. 학술 키워드는 RISS·KCI·DBpia·Google Scholar에서 바로 검색할 수 있는 한·영 키워드로 제시한다.\n7. 도서는 실존 여부를 확신할 수 있는 것만 쓰고, 조금이라도 불확실하면 verify를 \"확인 필요\"로 둔다. 존재하지 않는 책·논문을 만들어 내지 않는다.\n8. 세특 문장을 대신 써 주지 않는다. 학생부는 교사가 관찰해 기록하는 것이므로, 학생에게는 '제출물·자기평가서에 남길 재료'만 제안한다. 특히 탐구 전 생각과 탐구 후 바뀐 생각을 적는 '두 줄'을 제시한다.\n9. 출력은 JSON 하나뿐이다.\n\n[출력 JSON 스키마 요약]\n{\n  \"priority_gaps\": [{\"record_id\": \"SE1\", \"target_axis\": \"S3\", \"gap\": \"\", \"why_first\": \"\"}],\n  \"follow_up_topics\": [{\n    \"title\": \"\", \"linked_record\": \"SE1\", \"fills_gap\": [\"S3\", \"S4\"],\n    \"curriculum_concepts\": [\"\"], \"curriculum_fit\": \"범위내|경계\", \"fit_reason\": \"\",\n    \"inquiry_question\": \"\", \"method_steps\": [\"\", \"\", \"\"], \"expected_output\": \"\",\n    \"career_link\": \"\", \"difficulty\": \"기본|심화\"\n  }],\n  \"academic_keywords\": [{\"ko\": \"\", \"en\": \"\", \"where\": \"RISS|KCI|DBpia|Google Scholar\", \"use\": \"\"}],\n  \"books\": [{\"title\": \"\", \"author\": \"\", \"why\": \"\", \"verify\": \"확인됨|확인 필요\"}],\n  \"activity_plans\": [{\"setting\": \"수행평가|발표|실험|동아리|자율|진로\", \"plan\": \"\", \"evidence_to_leave\": \"\"}],\n  \"two_lines\": {\"before\": \"탐구 전 내 생각\", \"after\": \"탐구 후 바뀐 생각\"},\n  \"cautions\": [\"\"]\n}",
   "user": "[학생 기본 정보]\n{{STUDENT_PROFILE}}\n\n[2단계 진단]\n{{STEP2_JSON}}\n\n[코드 계산 결과(최종 등급·상한 규칙·역량 지표)]\n{{SCORING_RESULT}}\n\n위 진단을 바탕으로 후속 탐구를 설계하고 JSON만 출력하라."
  },
  "oneshot": {
   "system": "너는 대학 학생부종합전형 서류평가 경력을 가진 입학사정관 출신 분석가이자 탐구 설계 코치다. 아래 3단계를 한 번에 수행하되, 단계별 결과를 각각의 JSON 객체로 분리해 출력한다.\n평가 틀은 건국대·경희대·연세대·중앙대·한국외대 공동연구의 3대 역량(학업·진로·공동체)과 서울대 안내서의 세특 관점(지적 호기심, 자기주도적 학습, 깊이 있는 이해와 활용)을 따른다.\n\n{{RUBRIC}}\n\n[1단계 분해·태깅] 원문을 seg_id({record_id}-{순번})로 나누고 역할(동기|과정|심화|배운점|후속|태도·참여|평가어·총평|활동나열|역할서술|공동체행동|내용요약|기타)을 태깅한다. 핵심 교과 개념(used_as: 명칭언급|적용|원리설명|확장, curriculum_fit: 범위내|경계|이탈), 탐구 방식, 자료(how_used: 제목만|내용요약|비교·적용), 구조 4요소 존재(명시|약함|없음), 진로 연계(subject_relevance: 핵심|관련|일반, link_type: 없음|자연스러운 확장|병렬 부착|억지 연결), 공동체 근거, 감점 후보(P1~P8), evidence_sentence_count, performance_level(단순이행|부분심화|주도적심화)을 기록한다. 원문을 바꾸거나 없는 내용을 추가하지 않는다.\n\n[2단계 판정] 기록마다 6축(S1~S4, C1, C2)에 A+|A|B|C|D를 매기고 축마다 근거 seg_id·원문 인용(40자 이내)·판정 이유(왜 한 단계 위가 아닌지)를 쓴다. 감점(code, 경|중), 공동체 4항목(근거 없으면 \"N/A\"), 끊어진 고리(동기→과정|과정→심화|심화→배운점|배운점→후속), 강점·약점(약점은 cannot_verify 포함), llm_overall_grade를 쓴다. 모드 F이면 full_mode(academic_achievement, course_selection, attendance_note)를 채운다. 진로 연결이 없다는 이유로 학업 축을 낮추지 않는다. 소재가 화려하다는 이유로 올리지 않는다.\n\n[3단계 후속 탐구] 점수 손실이 큰 축과 상한 규칙 원인부터 메운다. 원래 기록의 교과 개념에서 출발해 같은 개념을 한 단계 더 깊이 다루는 주제를 학생 교육과정(2015/2022) 범위 안에서 설계한다(경계 수준이면 이유 명시). 진로 연결은 교과 개념을 다룬 뒤 한 스푼만. 학술 키워드는 한·영으로, 도서는 실존을 확신할 때만 쓰고 불확실하면 verify를 \"확인 필요\"로 둔다. 세특 문장을 대신 써 주지 않고, 제출물에 남길 '두 줄'(탐구 전 생각/탐구 후 바뀐 생각)을 제시한다.\n\n[출력] 설명 없이 아래 형태의 JSON 하나만 출력한다. 각 단계 객체의 필드는 단계별 스키마와 같다.\n{\n  \"step1\": { \"mode\": \"E|F\", \"records\": [ ... ], \"missing_inputs\": [], \"notes\": \"\" },\n  \"step2\": { \"record_scores\": [ ... ], \"full_mode\": null, \"overall_comment\": \"\" },\n  \"step3\": { \"priority_gaps\": [], \"follow_up_topics\": [], \"academic_keywords\": [], \"books\": [], \"activity_plans\": [], \"two_lines\": {\"before\": \"\", \"after\": \"\"}, \"cautions\": [] }\n}",
   "user": "[분석 모드] {{MODE}} ({{MODE_LABEL}})\n[미입력 항목] {{MISSING_INPUTS}}\n\n[학생 기본 정보]\n{{STUDENT_PROFILE}}\n\n[기록 원문]\n{{RECORDS}}\n\n3단계를 모두 수행하고 JSON만 출력하라. 최종 점수·상한 규칙은 도구가 다시 계산하므로, 등급 판정의 근거를 정확히 남기는 데 집중하라."
  }
 },
 "config": {
  "version": "1.0.0",
  "updated": "2026-11-02",
  "grade_points": {
   "A+": 5,
   "A": 4,
   "B": 3,
   "C": 2,
   "D": 1
  },
  "grade_order": [
   "D",
   "C",
   "B",
   "A",
   "A+"
  ],
  "axes": {
   "S1": {
    "name": "동기·문제의식",
    "group": "structure",
    "weight": 0.15,
    "question": "왜 이 공부를 했는가"
   },
   "S2": {
    "name": "탐구 과정",
    "group": "structure",
    "weight": 0.2,
    "question": "어떻게 탐구했는가"
   },
   "S3": {
    "name": "개념·이론 심화",
    "group": "structure",
    "weight": 0.2,
    "question": "어떻게 넓히고 깊혔는가"
   },
   "S4": {
    "name": "배운 점·변화·후속",
    "group": "structure",
    "weight": 0.15,
    "question": "그래서 무엇이 달라졌는가"
   },
   "C1": {
    "name": "개념 이해도",
    "group": "content",
    "weight": 0.15,
    "question": "교과 개념을 정확히 이해하고 활용하는가"
   },
   "C2": {
    "name": "지적 호기심·주도성",
    "group": "content",
    "weight": 0.15,
    "question": "스스로 묻고 찾아 해결하는가"
   }
  },
  "thresholds": [
   {
    "grade": "A+",
    "min": 90
   },
   {
    "grade": "A",
    "min": 74
   },
   {
    "grade": "B",
    "min": 56
   },
   {
    "grade": "C",
    "min": 38
   },
   {
    "grade": "D",
    "min": 0
   }
  ],
  "penalties": {
   "P1": {
    "name": "진로 억지 연결",
    "light": 2,
    "heavy": 5,
    "scope": [
     "academic",
     "career"
    ],
    "cap": {
     "heavy": {
      "axis": "C1",
      "max": "B"
     }
    }
   },
   "P2": {
    "name": "도서·논문 제목 나열",
    "light": 2,
    "heavy": 5,
    "scope": [
     "academic",
     "career"
    ]
   },
   "P3": {
    "name": "역할 분담 서술에 그침",
    "light": 2,
    "heavy": 5,
    "scope": [
     "academic",
     "community"
    ]
   },
   "P4": {
    "name": "미사여구·평가어 남발",
    "light": 2,
    "heavy": 5,
    "scope": [
     "academic"
    ]
   },
   "P5": {
    "name": "교육과정 이탈·전문용어 남발",
    "light": 2,
    "heavy": 5,
    "scope": [
     "academic"
    ],
    "cap": {
     "heavy": {
      "axis": "S3",
      "max": "B"
     }
    }
   },
   "P6": {
    "name": "단원 목표·보고서 내용 요약",
    "light": 2,
    "heavy": 5,
    "scope": [
     "academic"
    ]
   },
   "P7": {
    "name": "연결 없는 활동 병렬 나열",
    "light": 2,
    "heavy": 5,
    "scope": [
     "academic",
     "career"
    ]
   },
   "P8": {
    "name": "진정성·독창성 확인 필요",
    "light": 2,
    "heavy": 2,
    "scope": [
     "academic"
    ]
   }
  },
  "penalty_cap": 15,
  "gates": {
   "G1": {
    "desc": "탐구 과정(S2) 또는 심화(S3)가 C 이하이면 종합 최대 B",
    "max": "B"
   },
   "G2": {
    "desc": "구조 4축(S1~S4) 중 2개 이상이 D이면 종합 최대 C",
    "max": "C"
   },
   "G3": {
    "desc": "개념 이해도(C1)가 C 이하이면 종합 최대 B",
    "max": "B"
   },
   "G4": {
    "desc": "역량 근거 문장이 2개 미만(태도·평가어만 존재)이면 종합 최대 C",
    "max": "C"
   },
   "G5": {
    "desc": "근거 문장 인용이 없는 축은 최대 C로 하향",
    "max": "C"
   }
  },
  "competency_weights": {
   "academic": {
    "C1": 0.3,
    "S3": 0.25,
    "S2": 0.2,
    "C2": 0.15,
    "S4": 0.1
   },
   "career": {
    "S3": 0.35,
    "C1": 0.25,
    "S4": 0.2,
    "S1": 0.2
   }
  },
  "career_link_modifier": {
   "자연스러운 확장": 0,
   "없음": 0,
   "병렬 부착": -5,
   "억지 연결": -10
  },
  "full_mode": {
   "academic_mix": {
    "qualitative": 0.7,
    "achievement": 0.3
   },
   "career_mix": {
    "qualitative": 0.6,
    "course_selection": 0.4
   }
  },
  "attendance_rules": [
   {
    "level": "영향 없음",
    "when": "미인정(결석·지각·조퇴·결과) 합계 0회",
    "cap": null
   },
   {
    "level": "경미",
    "when": "미인정 합계 1~2회",
    "cap": null,
    "note": "면접에서 사유 질문 가능"
   },
   {
    "level": "주의",
    "when": "미인정 합계 3~5회 또는 미인정 결석 1~2일",
    "cap": "B"
   },
   {
    "level": "중대",
    "when": "미인정 합계 6회 이상 또는 미인정 결석 3일 이상",
    "cap": "C"
   }
  ]
 },
 "schemas": {
  "input": {
   "$schema": "https://json-schema.org/draft/2020-12/schema",
   "$id": "input.schema.json",
   "title": "세특 진단 입력",
   "type": "object",
   "required": [
    "student",
    "records"
   ],
   "properties": {
    "student": {
     "type": "object",
     "properties": {
      "grade_level": {
       "enum": [
        "고1",
        "고2",
        "고3",
        "졸업"
       ]
      },
      "curriculum": {
       "enum": [
        "2015",
        "2022"
       ]
      },
      "career_goal": {
       "type": "object",
       "properties": {
        "field": {
         "type": "string"
        },
        "major": {
         "type": "string"
        },
        "detail": {
         "type": "string"
        }
       }
      },
      "school_type": {
       "type": "string"
      },
      "notes": {
       "type": "string"
      }
     },
     "required": [
      "curriculum"
     ]
    },
    "records": {
     "type": "object",
     "properties": {
      "setuk": {
       "type": "array",
       "items": {
        "type": "object",
        "properties": {
         "id": {
          "type": "string",
          "pattern": "^SE[0-9]+$"
         },
         "year": {
          "type": "integer",
          "minimum": 1,
          "maximum": 3
         },
         "semester": {
          "type": "integer"
         },
         "subject": {
          "type": "string"
         },
         "subject_category": {
          "type": "string"
         },
         "text": {
          "type": "string",
          "minLength": 1
         }
        },
        "required": [
         "id",
         "subject",
         "text"
        ]
       }
      },
      "changche": {
       "type": "array",
       "items": {
        "type": "object",
        "properties": {
         "id": {
          "type": "string",
          "pattern": "^CA[0-9]+$"
         },
         "year": {
          "type": "integer"
         },
         "area": {
          "enum": [
           "자율",
           "동아리",
           "봉사",
           "진로"
          ]
         },
         "text": {
          "type": "string",
          "minLength": 1
         }
        },
        "required": [
         "id",
         "area",
         "text"
        ]
       }
      },
      "haengtuk": {
       "type": "array",
       "items": {
        "type": "object",
        "properties": {
         "id": {
          "type": "string",
          "pattern": "^HT[0-9]+$"
         },
         "year": {
          "type": "integer"
         },
         "text": {
          "type": "string",
          "minLength": 1
         }
        },
        "required": [
         "id",
         "text"
        ]
       }
      },
      "grades": {
       "type": "array",
       "items": {
        "type": "object",
        "properties": {
         "year": {
          "type": "integer"
         },
         "semester": {
          "type": "integer"
         },
         "subject": {
          "type": "string"
         },
         "subject_category": {
          "enum": [
           "국어",
           "수학",
           "영어",
           "사회",
           "과학",
           "한국사",
           "기타"
          ]
         },
         "units": {
          "type": "number",
          "minimum": 0
         },
         "rank_grade": {
          "type": [
           "number",
           "null"
          ],
          "minimum": 1,
          "maximum": 9
         },
         "achievement": {
          "type": [
           "string",
           "null"
          ]
         },
         "raw_score": {
          "type": [
           "number",
           "null"
          ]
         },
         "mean": {
          "type": [
           "number",
           "null"
          ]
         },
         "sd": {
          "type": [
           "number",
           "null"
          ]
         },
         "students": {
          "type": [
           "integer",
           "null"
          ]
         }
        },
        "required": [
         "subject",
         "units"
        ]
       }
      },
      "attendance": {
       "type": "array",
       "items": {
        "type": "object",
        "properties": {
         "year": {
          "type": "integer"
         },
         "school_days": {
          "type": "integer"
         },
         "unexcused_absence": {
          "type": "integer",
          "minimum": 0
         },
         "unexcused_late": {
          "type": "integer",
          "minimum": 0
         },
         "unexcused_early_leave": {
          "type": "integer",
          "minimum": 0
         },
         "unexcused_class_absence": {
          "type": "integer",
          "minimum": 0
         },
         "note": {
          "type": "string"
         }
        },
        "required": [
         "year"
        ]
       }
      }
     }
    },
    "raw_text": {
     "type": "string",
     "description": "학생부 원문 붙여넣기(선택)"
    }
   }
  },
  "step1": {
   "$schema": "https://json-schema.org/draft/2020-12/schema",
   "$id": "step1.schema.json",
   "title": "1단계 분해·태깅 결과",
   "type": "object",
   "required": [
    "mode",
    "records"
   ],
   "properties": {
    "mode": {
     "enum": [
      "E",
      "F"
     ]
    },
    "records": {
     "type": "array",
     "minItems": 1,
     "items": {
      "type": "object",
      "properties": {
       "record_id": {
        "type": "string"
       },
       "record_type": {
        "enum": [
         "setuk",
         "changche",
         "haengtuk"
        ]
       },
       "subject_or_area": {
        "type": "string"
       },
       "year": {
        "type": [
         "integer",
         "null"
        ]
       },
       "segments": {
        "type": "array",
        "minItems": 1,
        "items": {
         "type": "object",
         "properties": {
          "seg_id": {
           "type": "string"
          },
          "text": {
           "type": "string"
          },
          "role": {
           "enum": [
            "동기",
            "과정",
            "심화",
            "배운점",
            "후속",
            "태도·참여",
            "평가어·총평",
            "활동나열",
            "역할서술",
            "공동체행동",
            "내용요약",
            "기타"
           ]
          }
         },
         "required": [
          "seg_id",
          "text",
          "role"
         ]
        }
       },
       "core_concepts": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "concept": {
           "type": "string"
          },
          "unit": {
           "type": "string"
          },
          "used_as": {
           "enum": [
            "명칭언급",
            "적용",
            "원리설명",
            "확장"
           ]
          },
          "curriculum_fit": {
           "enum": [
            "범위내",
            "경계",
            "이탈"
           ]
          },
          "seg_ids": {
           "type": "array",
           "items": {
            "type": "string"
           }
          }
         },
         "required": [
          "concept",
          "used_as",
          "curriculum_fit"
         ]
        }
       },
       "inquiry_methods": {
        "type": "array",
        "items": {
         "type": "string"
        }
       },
       "materials": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "type": {
           "enum": [
            "도서",
            "논문",
            "통계",
            "기사",
            "실험",
            "영상",
            "기타"
           ]
          },
          "title": {
           "type": "string"
          },
          "how_used": {
           "enum": [
            "제목만",
            "내용요약",
            "비교·적용"
           ]
          },
          "seg_id": {
           "type": "string"
          }
         },
         "required": [
          "type",
          "how_used"
         ]
        }
       },
       "structure_presence": {
        "type": "object",
        "properties": {
         "동기": {
          "enum": [
           "명시",
           "약함",
           "없음"
          ]
         },
         "과정": {
          "enum": [
           "명시",
           "약함",
           "없음"
          ]
         },
         "심화": {
          "enum": [
           "명시",
           "약함",
           "없음"
          ]
         },
         "배운점": {
          "enum": [
           "명시",
           "약함",
           "없음"
          ]
         }
        },
        "required": [
         "동기",
         "과정",
         "심화",
         "배운점"
        ]
       },
       "career_link": {
        "type": "object",
        "properties": {
         "subject_relevance": {
          "enum": [
           "핵심",
           "관련",
           "일반"
          ]
         },
         "link_type": {
          "enum": [
           "없음",
           "자연스러운 확장",
           "병렬 부착",
           "억지 연결"
          ]
         },
         "seg_ids": {
          "type": "array",
          "items": {
           "type": "string"
          }
         },
         "comment": {
          "type": "string"
         }
        },
        "required": [
         "subject_relevance",
         "link_type"
        ]
       },
       "community_evidence": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "item": {
           "enum": [
            "협업·소통",
            "나눔·배려",
            "성실·규칙",
            "리더십"
           ]
          },
          "seg_id": {
           "type": "string"
          },
          "elements": {
           "type": "object"
          }
         },
         "required": [
          "item"
         ]
        }
       },
       "flag_candidates": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "code": {
           "pattern": "^P[1-8]$",
           "type": "string"
          },
          "seg_id": {
           "type": "string"
          },
          "reason": {
           "type": "string"
          }
         },
         "required": [
          "code"
         ]
        }
       },
       "evidence_sentence_count": {
        "type": "integer",
        "minimum": 0
       },
       "performance_level": {
        "enum": [
         "단순이행",
         "부분심화",
         "주도적심화"
        ]
       }
      },
      "required": [
       "record_id",
       "record_type",
       "segments",
       "structure_presence",
       "career_link",
       "evidence_sentence_count"
      ]
     }
    },
    "missing_inputs": {
     "type": "array",
     "items": {
      "type": "string"
     }
    },
    "notes": {
     "type": "string"
    }
   }
  },
  "step2": {
   "$schema": "https://json-schema.org/draft/2020-12/schema",
   "$id": "step2.schema.json",
   "title": "2단계 6축 판정 결과",
   "type": "object",
   "required": [
    "record_scores"
   ],
   "properties": {
    "record_scores": {
     "type": "array",
     "minItems": 1,
     "items": {
      "type": "object",
      "properties": {
       "record_id": {
        "type": "string"
       },
       "axes": {
        "type": "object",
        "properties": {
         "S1": {
          "type": "object",
          "properties": {
           "grade": {
            "enum": [
             "A+",
             "A",
             "B",
             "C",
             "D"
            ]
           },
           "evidence": {
            "type": "array",
            "items": {
             "type": "string"
            }
           },
           "quote": {
            "type": "string"
           },
           "reason": {
            "type": "string"
           }
          },
          "required": [
           "grade",
           "evidence",
           "reason"
          ]
         },
         "S2": {
          "type": "object",
          "properties": {
           "grade": {
            "enum": [
             "A+",
             "A",
             "B",
             "C",
             "D"
            ]
           },
           "evidence": {
            "type": "array",
            "items": {
             "type": "string"
            }
           },
           "quote": {
            "type": "string"
           },
           "reason": {
            "type": "string"
           }
          },
          "required": [
           "grade",
           "evidence",
           "reason"
          ]
         },
         "S3": {
          "type": "object",
          "properties": {
           "grade": {
            "enum": [
             "A+",
             "A",
             "B",
             "C",
             "D"
            ]
           },
           "evidence": {
            "type": "array",
            "items": {
             "type": "string"
            }
           },
           "quote": {
            "type": "string"
           },
           "reason": {
            "type": "string"
           }
          },
          "required": [
           "grade",
           "evidence",
           "reason"
          ]
         },
         "S4": {
          "type": "object",
          "properties": {
           "grade": {
            "enum": [
             "A+",
             "A",
             "B",
             "C",
             "D"
            ]
           },
           "evidence": {
            "type": "array",
            "items": {
             "type": "string"
            }
           },
           "quote": {
            "type": "string"
           },
           "reason": {
            "type": "string"
           }
          },
          "required": [
           "grade",
           "evidence",
           "reason"
          ]
         },
         "C1": {
          "type": "object",
          "properties": {
           "grade": {
            "enum": [
             "A+",
             "A",
             "B",
             "C",
             "D"
            ]
           },
           "evidence": {
            "type": "array",
            "items": {
             "type": "string"
            }
           },
           "quote": {
            "type": "string"
           },
           "reason": {
            "type": "string"
           }
          },
          "required": [
           "grade",
           "evidence",
           "reason"
          ]
         },
         "C2": {
          "type": "object",
          "properties": {
           "grade": {
            "enum": [
             "A+",
             "A",
             "B",
             "C",
             "D"
            ]
           },
           "evidence": {
            "type": "array",
            "items": {
             "type": "string"
            }
           },
           "quote": {
            "type": "string"
           },
           "reason": {
            "type": "string"
           }
          },
          "required": [
           "grade",
           "evidence",
           "reason"
          ]
         }
        },
        "required": [
         "S1",
         "S2",
         "S3",
         "S4",
         "C1",
         "C2"
        ]
       },
       "penalties": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "code": {
           "type": "string",
           "pattern": "^P[1-8]$"
          },
          "severity": {
           "enum": [
            "경",
            "중"
           ]
          },
          "seg_id": {
           "type": "string"
          },
          "reason": {
           "type": "string"
          }
         },
         "required": [
          "code",
          "severity"
         ]
        }
       },
       "community": {
        "type": "object",
        "properties": {
         "협업·소통": {
          "type": "object",
          "properties": {
           "grade": {
            "enum": [
             "A+",
             "A",
             "B",
             "C",
             "D",
             "N/A"
            ]
           },
           "evidence": {
            "type": "array",
            "items": {
             "type": "string"
            }
           },
           "reason": {
            "type": "string"
           }
          },
          "required": [
           "grade"
          ]
         },
         "나눔·배려": {
          "type": "object",
          "properties": {
           "grade": {
            "enum": [
             "A+",
             "A",
             "B",
             "C",
             "D",
             "N/A"
            ]
           },
           "evidence": {
            "type": "array",
            "items": {
             "type": "string"
            }
           },
           "reason": {
            "type": "string"
           }
          },
          "required": [
           "grade"
          ]
         },
         "성실·규칙": {
          "type": "object",
          "properties": {
           "grade": {
            "enum": [
             "A+",
             "A",
             "B",
             "C",
             "D",
             "N/A"
            ]
           },
           "evidence": {
            "type": "array",
            "items": {
             "type": "string"
            }
           },
           "reason": {
            "type": "string"
           }
          },
          "required": [
           "grade"
          ]
         },
         "리더십": {
          "type": "object",
          "properties": {
           "grade": {
            "enum": [
             "A+",
             "A",
             "B",
             "C",
             "D",
             "N/A"
            ]
           },
           "evidence": {
            "type": "array",
            "items": {
             "type": "string"
            }
           },
           "reason": {
            "type": "string"
           }
          },
          "required": [
           "grade"
          ]
         }
        }
       },
       "missing_links": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "between": {
           "enum": [
            "동기→과정",
            "과정→심화",
            "심화→배운점",
            "배운점→후속"
           ]
          },
          "diagnosis": {
           "type": "string"
          }
         },
         "required": [
          "between",
          "diagnosis"
         ]
        }
       },
       "strengths": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "point": {
           "type": "string"
          },
          "evidence": {
           "type": "array",
           "items": {
            "type": "string"
           }
          }
         },
         "required": [
          "point"
         ]
        }
       },
       "weaknesses": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "point": {
           "type": "string"
          },
          "cannot_verify": {
           "type": "string"
          },
          "evidence": {
           "type": "array",
           "items": {
            "type": "string"
           }
          }
         },
         "required": [
          "point"
         ]
        }
       },
       "llm_overall_grade": {
        "enum": [
         "A+",
         "A",
         "B",
         "C",
         "D"
        ]
       }
      },
      "required": [
       "record_id",
       "axes",
       "penalties"
      ]
     }
    },
    "full_mode": {
     "type": [
      "object",
      "null"
     ],
     "properties": {
      "academic_achievement": {
       "type": "object",
       "properties": {
        "grade": {
         "enum": [
          "A+",
          "A",
          "B",
          "C",
          "D"
         ]
        },
        "reason": {
         "type": "string"
        }
       }
      },
      "course_selection": {
       "type": "object",
       "properties": {
        "grade": {
         "enum": [
          "A+",
          "A",
          "B",
          "C",
          "D"
         ]
        },
        "reason": {
         "type": "string"
        }
       }
      },
      "attendance_note": {
       "type": "string"
      }
     }
    },
    "overall_comment": {
     "type": "string"
    }
   }
  },
  "step3": {
   "$schema": "https://json-schema.org/draft/2020-12/schema",
   "$id": "step3.schema.json",
   "title": "3단계 후속 탐구 설계",
   "type": "object",
   "required": [
    "priority_gaps",
    "follow_up_topics",
    "two_lines"
   ],
   "properties": {
    "priority_gaps": {
     "type": "array",
     "items": {
      "type": "object",
      "properties": {
       "record_id": {
        "type": "string"
       },
       "target_axis": {
        "type": "string"
       },
       "gap": {
        "type": "string"
       },
       "why_first": {
        "type": "string"
       }
      },
      "required": [
       "target_axis",
       "gap"
      ]
     }
    },
    "follow_up_topics": {
     "type": "array",
     "minItems": 1,
     "items": {
      "type": "object",
      "properties": {
       "title": {
        "type": "string"
       },
       "linked_record": {
        "type": "string"
       },
       "fills_gap": {
        "type": "array",
        "items": {
         "type": "string"
        }
       },
       "curriculum_concepts": {
        "type": "array",
        "items": {
         "type": "string"
        }
       },
       "curriculum_fit": {
        "enum": [
         "범위내",
         "경계"
        ]
       },
       "fit_reason": {
        "type": "string"
       },
       "inquiry_question": {
        "type": "string"
       },
       "method_steps": {
        "type": "array",
        "minItems": 2,
        "items": {
         "type": "string"
        }
       },
       "expected_output": {
        "type": "string"
       },
       "career_link": {
        "type": "string"
       },
       "difficulty": {
        "enum": [
         "기본",
         "심화"
        ]
       }
      },
      "required": [
       "title",
       "curriculum_concepts",
       "curriculum_fit",
       "inquiry_question",
       "method_steps"
      ]
     }
    },
    "academic_keywords": {
     "type": "array",
     "items": {
      "type": "object",
      "properties": {
       "ko": {
        "type": "string"
       },
       "en": {
        "type": "string"
       },
       "where": {
        "type": "string"
       },
       "use": {
        "type": "string"
       }
      },
      "required": [
       "ko",
       "en"
      ]
     }
    },
    "books": {
     "type": "array",
     "items": {
      "type": "object",
      "properties": {
       "title": {
        "type": "string"
       },
       "author": {
        "type": "string"
       },
       "why": {
        "type": "string"
       },
       "verify": {
        "enum": [
         "확인됨",
         "확인 필요"
        ]
       }
      },
      "required": [
       "title",
       "verify"
      ]
     }
    },
    "activity_plans": {
     "type": "array",
     "items": {
      "type": "object",
      "properties": {
       "setting": {
        "type": "string"
       },
       "plan": {
        "type": "string"
       },
       "evidence_to_leave": {
        "type": "string"
       }
      },
      "required": [
       "setting",
       "plan"
      ]
     }
    },
    "two_lines": {
     "type": "object",
     "properties": {
      "before": {
       "type": "string"
      },
      "after": {
       "type": "string"
      }
     },
     "required": [
      "before",
      "after"
     ]
    },
    "cautions": {
     "type": "array",
     "items": {
      "type": "string"
     }
    }
   }
  }
 },
 "samples": {
  "input": {
   "student": {
    "grade_level": "고2",
    "curriculum": "2015",
    "career_goal": {
     "field": "공학계열",
     "major": "도시공학과",
     "detail": "교통 안전과 도시 공간 설계에 관심"
    },
    "school_type": "일반고",
    "notes": "가상 학생 샘플(B등급 수준 검증용)"
   },
   "records": {
    "setuk": [
     {
      "id": "SE1",
      "year": 2,
      "subject": "확률과 통계",
      "subject_category": "수학",
      "text": "조건부확률 단원을 학습한 뒤 실생활에서 확률이 어떻게 활용되는지에 관심을 가지고 '교통사고와 확률'을 주제로 탐구 보고서를 작성함. 교통사고분석시스템(TAAS)의 지역별·시간대별 교통사고 통계를 내려받아 주간과 야간으로 나누어 정리하고, 사고 1건당 사망자 수를 비교하는 표와 막대그래프를 작성함. 야간에 발생한 사고가 사망사고로 이어질 조건부확률이 주간보다 높게 나타난다는 점을 계산하여 발표함. 이를 통해 확률과 통계가 도시의 교통안전 정책을 세우는 데 중요한 역할을 한다는 것을 깨달음. 또한 '새빨간 거짓말, 통계(대럴 허프)'를 읽고 통계 자료를 비판적으로 해석하는 태도의 중요성을 알게 됨. 모둠 활동에서는 자료 정리 역할을 맡아 성실히 수행하였으며, 항상 적극적인 태도로 수업에 참여하는 모습이 돋보이고 수학적 사고력이 뛰어난 학생임."
     }
    ],
    "changche": [],
    "haengtuk": [],
    "grades": [],
    "attendance": []
   },
   "raw_text": ""
  },
  "step1": {
   "mode": "E",
   "records": [
    {
     "record_id": "SE1",
     "record_type": "setuk",
     "subject_or_area": "확률과 통계",
     "year": 2,
     "segments": [
      {
       "seg_id": "SE1-1",
       "text": "조건부확률 단원을 학습한 뒤 실생활에서 확률이 어떻게 활용되는지에 관심을 가지고 '교통사고와 확률'을 주제로 탐구 보고서를 작성함.",
       "role": "동기"
      },
      {
       "seg_id": "SE1-2",
       "text": "교통사고분석시스템(TAAS)의 지역별·시간대별 교통사고 통계를 내려받아 주간과 야간으로 나누어 정리하고, 사고 1건당 사망자 수를 비교하는 표와 막대그래프를 작성함.",
       "role": "과정"
      },
      {
       "seg_id": "SE1-3",
       "text": "야간에 발생한 사고가 사망사고로 이어질 조건부확률이 주간보다 높게 나타난다는 점을 계산하여 발표함.",
       "role": "심화"
      },
      {
       "seg_id": "SE1-4",
       "text": "이를 통해 확률과 통계가 도시의 교통안전 정책을 세우는 데 중요한 역할을 한다는 것을 깨달음.",
       "role": "배운점"
      },
      {
       "seg_id": "SE1-5",
       "text": "또한 '새빨간 거짓말, 통계(대럴 허프)'를 읽고 통계 자료를 비판적으로 해석하는 태도의 중요성을 알게 됨.",
       "role": "배운점"
      },
      {
       "seg_id": "SE1-6",
       "text": "모둠 활동에서는 자료 정리 역할을 맡아 성실히 수행하였으며,",
       "role": "역할서술"
      },
      {
       "seg_id": "SE1-7",
       "text": "항상 적극적인 태도로 수업에 참여하는 모습이 돋보이고 수학적 사고력이 뛰어난 학생임.",
       "role": "평가어·총평"
      }
     ],
     "core_concepts": [
      {
       "concept": "조건부확률",
       "unit": "확률-조건부확률",
       "used_as": "적용",
       "curriculum_fit": "범위내",
       "seg_ids": [
        "SE1-1",
        "SE1-3"
       ]
      },
      {
       "concept": "상대도수(자료의 정리)",
       "unit": "통계-자료의 정리",
       "used_as": "적용",
       "curriculum_fit": "범위내",
       "seg_ids": [
        "SE1-2"
       ]
      }
     ],
     "inquiry_methods": [
      "공공데이터 수집",
      "집단 구분(주간/야간) 비교",
      "표·막대그래프 작성",
      "조건부확률 계산",
      "발표"
     ],
     "materials": [
      {
       "type": "통계",
       "title": "교통사고분석시스템(TAAS) 지역별·시간대별 통계",
       "how_used": "비교·적용",
       "seg_id": "SE1-2"
      },
      {
       "type": "도서",
       "title": "새빨간 거짓말, 통계(대럴 허프)",
       "how_used": "제목만",
       "seg_id": "SE1-5"
      }
     ],
     "structure_presence": {
      "동기": "약함",
      "과정": "명시",
      "심화": "약함",
      "배운점": "약함"
     },
     "career_link": {
      "subject_relevance": "관련",
      "link_type": "병렬 부착",
      "seg_ids": [
       "SE1-4"
      ],
      "comment": "교통사고라는 소재는 도시공학과 맞닿아 있으나, 진로 연결은 '정책을 세우는 데 중요한 역할'이라는 결론 문장 하나로 붙어 있고 교과 개념이 도시 문제 판단에 어떻게 쓰이는지는 서술되지 않음"
     },
     "community_evidence": [
      {
       "item": "협업·소통",
       "seg_id": "SE1-6",
       "elements": {
        "역할": true,
        "행동": false,
        "영향·성장": false,
        "소통": false
       }
      }
     ],
     "flag_candidates": [
      {
       "code": "P2",
       "seg_id": "SE1-5",
       "reason": "도서에서 무엇을 읽어 자신의 분석에 어떻게 적용했는지 없이 제목과 일반적 교훈만 제시"
      },
      {
       "code": "P3",
       "seg_id": "SE1-6",
       "reason": "'자료 정리 역할을 맡아 성실히 수행'으로 역할명만 있고 기여 내용이 없음"
      },
      {
       "code": "P4",
       "seg_id": "SE1-7",
       "reason": "'돋보이고', '뛰어난 학생임' 등 근거 없는 평가어"
      }
     ],
     "evidence_sentence_count": 5,
     "performance_level": "부분심화"
    }
   ],
   "missing_inputs": [
    "changche",
    "haengtuk"
   ],
   "notes": "SE1-3의 '조건부확률'이 P(사망사고|야간)인지, 사고 1건당 사망자 수(평균)인지 원문만으로는 구분이 모호함. SE1-2의 지표(사고 1건당 사망자 수)와 SE1-3의 지표(사망사고로 이어질 확률)가 서로 다른 양임."
  },
  "step2": {
   "record_scores": [
    {
     "record_id": "SE1",
     "axes": {
      "S1": {
       "grade": "B",
       "evidence": [
        "SE1-1"
       ],
       "quote": "실생활에서 확률이 어떻게 활용되는지에 관심을 가지고",
       "reason": "조건부확률 단원에서 출발해 교과와는 연결되지만, '실생활 활용이 궁금함' 수준의 일반적 계기다. 학생이 무엇을 이상하다고 느꼈는지(구체적 의문)가 없어 A로 올릴 수 없다."
      },
      "S2": {
       "grade": "A",
       "evidence": [
        "SE1-2"
       ],
       "quote": "교통사고분석시스템(TAAS)의 지역별·시간대별 교통사고 통계를 내려받아",
       "reason": "자료 출처(TAAS), 집단 구분 기준(주간/야간), 비교 지표, 표현 방식(표·막대그래프)이 구체적이다. 다만 왜 이 지표를 골랐는지, 교통량 차이 같은 비교 조건을 어떻게 맞췄는지가 없어 A+는 아니다."
      },
      "S3": {
       "grade": "B",
       "evidence": [
        "SE1-3"
       ],
       "quote": "사망사고로 이어질 조건부확률이 주간보다 높게 나타난다는 점을 계산",
       "reason": "조건부확률을 실제 계산에 썼다는 점은 확인되지만, 어떤 사건을 조건으로 두었는지, P(사망|야간)이 무엇을 뜻하는지 원리 설명이 없고 비교·한계 검토도 없다. 개념이 작동한 결과만 있고 해석이 없어 B다."
      },
      "S4": {
       "grade": "B",
       "evidence": [
        "SE1-4",
        "SE1-5"
       ],
       "quote": "교통안전 정책을 세우는 데 중요한 역할을 한다는 것을 깨달음",
       "reason": "배운 점이 '중요성을 깨달음·알게 됨'의 일반 서술에 머문다. 탐구 전후로 생각이 어떻게 달라졌는지, 어떤 한계를 발견했는지, 후속 질문이 무엇인지 없다. 감상만 있는 C보다는 낫지만 B의 하단이다."
      },
      "C1": {
       "grade": "B",
       "evidence": [
        "SE1-3"
       ],
       "quote": "조건부확률이 주간보다 높게 나타난다",
       "reason": "조건부확률을 상대도수로 계산하는 사용 자체는 타당하다. 그러나 SE1-2의 지표(사고 1건당 사망자 수)와 SE1-3의 지표(사망사고로 이어질 확률)가 서로 다른 양인데 구분이 없고, 조건과 결과의 방향(P(A|B)와 P(B|A))을 구별했는지 확인할 수 없다. '무엇'은 있으나 '왜'가 약하다."
      },
      "C2": {
       "grade": "B",
       "evidence": [
        "SE1-1",
        "SE1-2"
       ],
       "quote": "'교통사고와 확률'을 주제로 탐구 보고서를 작성함",
       "reason": "주제 선정과 공공데이터 수집을 스스로 했다는 점은 보이지만, 결과에서 새 질문을 만들거나 추가 자료로 확장한 장면이 없다. 과제 범위 안의 성실한 수행이다."
      }
     },
     "penalties": [
      {
       "code": "P2",
       "severity": "경",
       "seg_id": "SE1-5",
       "reason": "『새빨간 거짓말, 통계』를 읽었다는 사실과 일반적 교훈만 있고, 책의 어떤 내용을 자신의 교통사고 분석에 적용했는지 없다. 탐구와 직접 관련된 책이라 '중'까지는 아니다."
      },
      {
       "code": "P3",
       "severity": "경",
       "seg_id": "SE1-6",
       "reason": "'자료 정리 역할을 맡아 성실히 수행'으로 역할명만 있다. 무엇을 정리해 모둠에 어떤 도움이 됐는지 없다."
      },
      {
       "code": "P4",
       "severity": "경",
       "seg_id": "SE1-7",
       "reason": "'돋보이고', '수학적 사고력이 뛰어난 학생임'은 근거 없는 평가어다. 근거 문장(5개)이 평가어보다 많아 '경'으로 판정한다."
      }
     ],
     "community": {
      "협업·소통": {
       "grade": "C",
       "evidence": [
        "SE1-6"
       ],
       "reason": "모둠 내 역할명만 있고 구체적 행동·영향·소통 장면이 없다."
      },
      "나눔·배려": {
       "grade": "N/A",
       "evidence": [],
       "reason": "근거 없음"
      },
      "성실·규칙": {
       "grade": "N/A",
       "evidence": [],
       "reason": "'성실히 수행'은 형용사이며 판정 근거로 쓰지 않음"
      },
      "리더십": {
       "grade": "N/A",
       "evidence": [],
       "reason": "근거 없음"
      }
     },
     "missing_links": [
      {
       "between": "동기→과정",
       "diagnosis": "동기가 '실생활 활용'으로 일반적이어서, 왜 하필 주간/야간을 비교했는지 탐구 질문이 동기에서 나오지 않는다."
      },
      {
       "between": "과정→심화",
       "diagnosis": "계산 결과(야간이 더 높음)는 있으나 조건부확률의 의미 해석, 교통량 같은 비교 조건의 차이, 다른 해석 가능성 검토가 없어 심화로 넘어가지 못한다."
      },
      {
       "between": "배운점→후속",
       "diagnosis": "'중요성을 깨달음'에서 끝나 탐구의 한계나 다음 질문이 없다. 읽은 책(통계 해석의 함정)을 자기 분석의 한계 점검에 쓰면 이 고리가 이어질 수 있었다."
      }
     ],
     "strengths": [
      {
       "point": "공공데이터(TAAS)를 직접 내려받아 기준을 세워 나누고 표·그래프로 정리한 과정이 구체적이다.",
       "evidence": [
        "SE1-2"
       ]
      },
      {
       "point": "배운 조건부확률을 실제 자료 계산에 적용해 비교 결론까지 냈다.",
       "evidence": [
        "SE1-3"
       ]
      }
     ],
     "weaknesses": [
      {
       "point": "조건부확률의 의미(무엇을 조건으로 두었나)와 지표 간 차이에 대한 설명이 없다.",
       "cannot_verify": "학생이 조건부확률을 원리 수준에서 이해했는지, 단순 비율 계산을 한 것인지 구별할 수 없다.",
       "evidence": [
        "SE1-2",
        "SE1-3"
       ]
      },
      {
       "point": "배운 점이 일반론이고 후속 질문이 없다.",
       "cannot_verify": "탐구로 학생의 생각이 실제로 바뀌었는지 확인할 수 없다.",
       "evidence": [
        "SE1-4",
        "SE1-5"
       ]
      },
      {
       "point": "진로(도시공학) 연결이 결론 문장 하나로 붙어 있다.",
       "cannot_verify": "확률 개념이 도시 문제 판단에 어떻게 쓰이는지 학생이 이해했는지 알 수 없다.",
       "evidence": [
        "SE1-4"
       ]
      }
     ],
     "llm_overall_grade": "B"
    }
   ],
   "full_mode": null,
   "overall_comment": "자료 수집과 정리 과정은 구체적이지만, 계산한 조건부확률이 무엇을 뜻하는지 해석하는 단계가 빠져 '과정은 충실, 심화는 보통'인 전형적인 B 기록이다. 배운 점이 일반론으로 끝나고 도서는 제목과 교훈만 남아 탐구의 깊이를 보여 주지 못한다. 진로 연결은 문장 하나로 붙어 있어 진로역량 지표는 학업역량보다 낮게 나온다. 같은 자료로 '조건의 방향'과 '비교 기준(교통량)'을 다시 검토하면 S3·S4·C1이 함께 오를 수 있다."
  },
  "step3": {
   "priority_gaps": [
    {
     "record_id": "SE1",
     "target_axis": "S3",
     "gap": "조건부확률을 계산했지만 '무엇을 조건으로 두었는가'와 비교 조건(교통량)의 차이를 해석하지 않음",
     "why_first": "가중치 20%인 S3와 15%인 C1이 같은 원인(개념 해석 부재)으로 함께 B에 묶여 있어, 한 번의 보완으로 두 축을 올릴 수 있다."
    },
    {
     "record_id": "SE1",
     "target_axis": "S4",
     "gap": "배운 점이 '중요성을 깨달음'에 그치고 한계·후속 질문이 없음",
     "why_first": "S3를 보완하는 과정에서 처음 결론이 수정되면, 그 변화가 곧 S4의 근거가 된다."
    },
    {
     "record_id": "SE1",
     "target_axis": "career",
     "gap": "진로 연결이 결론 한 문장으로 병렬 부착됨(진로 지표 −5)",
     "why_first": "교과 개념 해석이 먼저 채워져야 진로 연결이 '자연스러운 확장'이 될 수 있으므로 마지막 순서로 둔다."
    }
   ],
   "follow_up_topics": [
    {
     "title": "야간 사고는 정말 더 위험한가: 조건의 방향과 비교 기준 다시 보기",
     "linked_record": "SE1",
     "fills_gap": [
      "S3",
      "C1",
      "S4"
     ],
     "curriculum_concepts": [
      "조건부확률 P(B|A)",
      "확률의 곱셈정리",
      "상대도수와 확률"
     ],
     "curriculum_fit": "범위내",
     "fit_reason": "2015 개정 확률과 통계의 '조건부확률' 단원 안의 개념(조건부확률의 뜻, 곱셈정리)만 사용하며, 분할표 작성은 교과서 활동 수준이다.",
     "inquiry_question": "P(사망사고|야간)이 높다는 것과 P(야간|사망사고)가 높다는 것은 같은 말인가? 야간 교통량이 주간보다 적다면 '야간이 더 위험하다'는 결론은 어떤 기준에서만 성립하는가?",
     "method_steps": [
      "사건을 A=사망사고, B=야간 발생으로 정의하고 기존 TAAS 자료로 2×2 분할표를 만든다.",
      "P(A|B), P(A|Bᶜ), P(B|A)를 각각 계산하고, 세 값이 각각 어떤 질문에 대한 답인지 한 문장씩 설명한다.",
      "시간대별 교통량 자료(국가교통DB 등, 출처 확인 필요)를 찾아 '교통량 대비 사고 건수'로 기준을 바꿔 다시 비교한다.",
      "기준을 바꿨을 때 처음 결론이 유지되는지, 달라지는지 기록하고 그 이유를 쓴다."
     ],
     "expected_output": "분할표 1개, 기준별 비교표 1개, '처음 결론과 달라진 점' 메모 1쪽",
     "career_link": "결론이 기준(사고 1건당 vs 교통량 대비)에 따라 달라진다면, 가로등·횡단보도 배치 같은 도시 설계 판단에서 어떤 지표를 써야 하는지 한 문단으로 덧붙인다.",
     "difficulty": "기본"
    },
    {
     "title": "나눠 보면 결론이 뒤집힐까: 지역 유형별로 다시 계산한 야간 사망 비율",
     "linked_record": "SE1",
     "fills_gap": [
      "S3",
      "C2"
     ],
     "curriculum_concepts": [
      "조건부확률",
      "비율의 합성(가중평균)",
      "자료의 정리"
     ],
     "curriculum_fit": "경계",
     "fit_reason": "계산은 조건부확률과 비율로 고교 범위 안이지만, '심슨의 역설'이라는 현상 자체는 교과서 본문 밖의 내용이므로 경계로 둔다. 용어보다 '전체와 부분의 결론이 다를 수 있는 이유'를 직접 계산으로 보이는 데 집중한다.",
     "inquiry_question": "전체 자료에서 야간 사망 비율이 높게 나왔을 때, 도심과 외곽으로 나눠도 같은 결론이 나오는가? 다르다면 왜 그런가?",
     "method_steps": [
      "TAAS 자료를 도심/외곽(또는 도로 종류)으로 나누어 주간·야간 사망 비율을 다시 계산한다.",
      "전체 비율과 집단별 비율을 나란히 놓고, 각 집단의 사고 건수(가중치)가 전체 비율에 어떻게 반영되는지 식으로 보인다.",
      "결론이 뒤집히거나 차이가 줄어든다면 그 원인을 자료의 구성으로 설명한다."
     ],
     "expected_output": "집단별 비교표, 가중평균 식 1개, 해석 메모",
     "career_link": "같은 도시 안에서도 지역 유형에 따라 위험 요인이 다를 수 있다는 점을 교통안전 대책의 우선순위와 연결해 한 줄로 정리한다.",
     "difficulty": "심화"
    },
    {
     "title": "읽은 책을 내 분석의 점검표로: 통계 해석의 함정 체크리스트",
     "linked_record": "SE1",
     "fills_gap": [
      "S4"
     ],
     "curriculum_concepts": [
      "표본과 모집단",
      "대푯값",
      "자료의 시각화"
     ],
     "curriculum_fit": "범위내",
     "fit_reason": "확률과 통계의 통계 단원 개념으로 이미 한 분석의 한계를 점검하는 활동이다.",
     "inquiry_question": "『새빨간 거짓말, 통계』가 경고하는 함정 가운데 내 보고서에도 해당하는 것이 있는가?",
     "method_steps": [
      "책에서 내 분석과 관련 있는 장 2개를 골라 함정을 한 줄씩 요약한다.",
      "내 표와 막대그래프(축 눈금, 비교 기준, 표본)를 그 기준으로 점검한다.",
      "고쳐야 할 점을 찾아 수정 전/후 그래프를 함께 남긴다."
     ],
     "expected_output": "체크리스트 1장, 수정 전/후 그래프",
     "career_link": "없음(교과 내 보완 활동)",
     "difficulty": "기본"
    }
   ],
   "academic_keywords": [
    {
     "ko": "조건부확률 오류",
     "en": "conditional probability fallacy",
     "where": "Google Scholar",
     "use": "P(A|B)와 P(B|A)를 혼동하는 사례 확인"
    },
    {
     "ko": "기저율 오류",
     "en": "base rate fallacy",
     "where": "Google Scholar",
     "use": "비교 기준(교통량)을 무시할 때 생기는 해석 오류 이해"
    },
    {
     "ko": "교통사고 노출량",
     "en": "traffic exposure crash rate",
     "where": "KCI",
     "use": "교통량 대비 사고율 지표가 왜 쓰이는지 확인"
    },
    {
     "ko": "야간 교통사고 심각도",
     "en": "nighttime crash severity",
     "where": "RISS",
     "use": "야간 사고 심각도 요인(조명·속도 등) 선행 연구 확인"
    },
    {
     "ko": "심슨의 역설",
     "en": "Simpson's paradox",
     "where": "DBpia",
     "use": "집단을 나눌 때 결론이 바뀌는 원리 확인"
    }
   ],
   "books": [
    {
     "title": "벌거벗은 통계학",
     "author": "찰스 윌런",
     "why": "확률·통계 해석의 오류를 사례 중심으로 다뤄 조건부확률 해석 점검에 쓸 수 있음",
     "verify": "확인됨"
    },
    {
     "title": "숫자에 속아 위험한 선택을 하는 사람들",
     "author": "게르트 기거렌처",
     "why": "조건부확률을 '자연 빈도'로 바꿔 이해하는 방법을 다뤄 분할표 해석과 직접 연결됨",
     "verify": "확인됨"
    },
    {
     "title": "새빨간 거짓말, 통계",
     "author": "대럴 허프",
     "why": "이미 읽은 책. 새로 읽기보다 3번 주제처럼 자기 분석의 점검 기준으로 다시 활용",
     "verify": "확인됨"
    }
   ],
   "activity_plans": [
    {
     "setting": "수행평가",
     "plan": "1번 주제의 분할표와 기준별 비교표를 확률과 통계 후속 보고서로 제출",
     "evidence_to_leave": "처음 결론, 기준을 바꾼 이유, 바뀐 결론을 보고서 마지막에 명시"
    },
    {
     "setting": "발표",
     "plan": "'같은 자료, 다른 결론'을 주제로 3분 발표를 하고 친구들에게 어느 기준이 타당한지 질문",
     "evidence_to_leave": "질의응답에서 나온 반론과 자신의 답변을 메모로 남김"
    },
    {
     "setting": "진로",
     "plan": "진로 탐색 활동에서 교통안전 지표(사고율 기준)가 실제 정책 자료에서 어떻게 쓰이는지 공공기관 보고서 1편을 찾아 비교",
     "evidence_to_leave": "보고서의 지표와 내 지표의 차이를 한 문단으로 정리"
    }
   ],
   "two_lines": {
    "before": "야간 사고가 사망으로 이어질 확률이 더 높게 나왔으니 야간이 더 위험하다고 생각했다.",
    "after": "P(사망|야간)과 P(야간|사망)은 서로 다른 질문이고, 교통량을 고려하지 않으면 '더 위험하다'고 말할 수 없다는 것을 확인해 비교 기준을 교통량 대비 비율로 바꿨다."
   },
   "cautions": [
    "세특 문장은 교사가 관찰해 기록하는 것이므로, 위 내용은 학생의 제출물·자기평가서에 남길 재료로만 쓴다.",
    "교통량 자료는 출처와 기준 연도를 확인하고 보고서에 명시한다.",
    "기준을 바꿨을 때 결론이 예상과 달라도 그대로 기록한다. 처음 결론이 수정되는 과정 자체가 S4의 근거다.",
    "'심슨의 역설' 같은 용어를 쓰려면 직접 계산으로 현상을 보인 뒤에 이름을 붙인다. 용어만 쓰면 P5 감점 요인이 된다."
   ]
  }
 }
};
