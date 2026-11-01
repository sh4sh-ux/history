# 조선 518
React + TypeScript + Vite로 만든 서버 없는 역사 학습 PWA. 운영에 유료 API나 계정이 필요하지 않습니다.

## 실행
```sh
npm ci
npm run dev
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```
결과물은 `dist/`입니다. `dist/index.html`을 직접 열기보다 HTTP 서버로 서비스하세요.

## 구현 범위
- 27대 왕 전체 재위 연표, 왕→사건 역사 마인드맵, 학습용 시대 필터, 왕/연도/인물/사건 검색
- 태조~세종 8개 사건: 한자 명칭과 글자별 풀이, 의미, 배경, 인물, 전개, 결과, 비유, 일화, 출처, 사건 연결
- 5개 퀴즈와 오답 복습, 책갈피, 읽은 기록, localStorage 저장 및 복구
- 반응형 다크/라이트 UI, 키보드와 Escape, 대화상자 포커스 제한
- PWA manifest와 Workbox 오프라인 앱 캐시. 첫 온라인 방문 후 앱 파일을 저장합니다. 외부 출처 페이지는 오프라인에서 접근할 수 없습니다. 앱은 외부 웹 폰트 없이 시스템 글꼴을 사용합니다.
- 문종 이후는 재위 연표만 제공하며 상세/퀴즈는 준비 중임을 표시합니다.

## 구조와 확장
- `src/data/history.ts`: King / HistoryEvent 타입, 왕 27명, 시대, 사건, 퀴즈
- `src/main.tsx`: 화면과 상태/저장 동작
- `src/MindMap.tsx`: 왕과 사건을 연결하는 반응형 역사 지도
- `e2e/learning.spec.ts`: 데스크톱·모바일 Chromium 클릭/화면/PWA 오프라인 테스트
- `src/style.css`: 테마와 모바일/데스크톱 스타일
- `src/App.test.tsx`: 왕/사건 펼침, 검색, 복습, 저장 복원, 데이터 연결 무결성 테스트

다음 왕 확장 시 history.ts에 고유 사건 id, king 번호, 검토된 출처, 글자 풀이와 related를 추가하세요. 상세 제공 여부는 events의 왕 번호로 자동 판정합니다. 확장 범위에 맞게 화면의 태조~세종 안내 문구도 함께 갱신하세요. 퀴즈는 현재 조선 전기 5문항입니다. 다른 시대 확장 시 era 필드를 추가해 필터링하세요.

## 역사 편집 원칙과 검증 한계
사건 이름의 한자 표기는 원문 사료 문장과 구분합니다. 현재 본문은 사료 전문 번역을 제공하지 않습니다. 글자별 대표 훈음과 문맥 해석을 분리하고 고유명사와 간지를 직역하지 않습니다. 비유는 학습용이며, 사실/설화는 라벨을 붙입니다. 전문 역사학자의 감수는 아직 받지 않은 1차 학습 콘텐츠입니다. 공개 교육 서비스로 확장하기 전 사건별 사료와 한자 사전 대조 검토가 필요합니다.

참고한 자료와 개별 사건 링크는 앱에서 확인할 수 있습니다: 국사편찬위원회 우리역사넷, 한국학중앙연구원 한국민족문화대백과사전, 국립국어원 훈민정음 해설. 시대 경계는 정설을 단정하지 않는 학습용 분류입니다. 고종/순종 구간에는 1897년 이후 대한제국 시기가 포함됩니다.

## GitHub Pages 무료 배포
배포 대상: https://github.com/sh4sh-ux/history

접속 주소: https://sh4sh-ux.github.io/history/ `.github/workflows/deploy.yml`은 main 푸시 시 단위 테스트/빌드/브라우저 테스트 후 Pages에 배포합니다. 테스트 화면 캡처와 HTML 보고서는 Actions의 `browser-test-results` 아티팩트에서 내려받습니다.
1. 이 프로젝트를 public 저장소 `sh4sh-ux/history`에 올립니다.
2. 저장소 Settings → Pages → Source를 GitHub Actions로 선택합니다.
3. main에 푸시하거나 Actions에서 Deploy GitHub Pages를 실행합니다.
4. Actions의 github-pages environment URL로 접속합니다.
`base: '/history/'`를 사용해 저장소 하위 경로에서 앱 파일과 서비스 워커가 작동하도록 구성했습니다. URL은 해시/라우터를 쓰지 않아 새로고침 404가 발생하지 않습니다. HTTPS에서 PWA 설치/서비스 워커를 사용하세요.

기록은 기기와 브라우저별로 저장되며 기기 간 동기화는 없습니다. 브라우저 데이터 삭제 시 함께 삭제됩니다.
