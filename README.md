# 현대 모터스튜디오 교육 실시간 입력 앱

7명의 교육생이 각자 폰(개인 창)으로 4가지 문항을 작성하고, 강사는 노트북에서 실시간으로 확인·발표합니다. (리더십 워크숍 앱과 동일한 구조이며, 완전히 별도의 프로젝트/데이터베이스입니다.)

1. 표정을 보고 "가이드를 맡기겠다" / "못맡기겠다" 선택 + 각각 이유 (칸 2개)
2. 응대자의 확증편향은 무엇인가 (텍스트)
3. 사례 분석 — 들은 사실 / 확인이 필요한 정보 / 고객 요구 / 고객이 느끼는 감정 (칸 4개)
4. 주차요금 설명 — WHY / WHAT / HOW (질문은 고정, 답변 칸만 작성)

참고 슬라이드(표정 이미지, 사례 슬라이드, 주차요금 표)는 앱에 넣지 않았습니다. 현장에서 강사가 화면으로 직접 보여주고, 교육생은 이 앱에는 답변만 입력합니다.

페이지 구성
- `/` : 교육생 입장 화면 (이름 입력)
- `/trainee` : 교육생 개인 입력 화면 (자동 저장)
- `/instructor` : 강사 실시간 대시보드 (암호로 보호, 카드 클릭 시 전체 화면으로 확대해서 같이 볼 수 있음)

---

## 1. Firebase 프로젝트 만들기 (5분)

리더십 워크숍 때와 완전히 같은 방식이지만, **새 프로젝트**를 하나 더 만드는 것입니다 (기존 `leader-workshop` 프로젝트를 재사용하지 않습니다).

1. https://console.firebase.google.com 접속 → **프로젝트 추가**
2. 프로젝트 이름 아무거나 입력 (예: `motorstudio-training`) → 애널리틱스는 꺼도 됩니다
3. 왼쪽 메뉴 **빌드 > Firestore Database** → **데이터베이스 만들기** → 위치는 아무 리전(예: `asia-northeast3` 서울) → **테스트 모드로 시작** (Standard 버전 선택)
4. Firestore가 만들어지면 **규칙(Rules)** 탭으로 가서 이 저장소의 `firestore.rules` 내용으로 교체 후 **게시**
   (교육 이후 자동으로 잠기도록 날짜를 넣어뒀습니다. 필요하면 날짜를 수정하세요.)
5. 왼쪽 위 **프로젝트 설정(톱니바퀴) > 일반** → 아래로 스크롤해서 **내 앱** > **웹 앱 추가(`</>` 아이콘)**
6. 앱 닉네임 아무거나 입력 → 등록하면 `firebaseConfig` 객체가 보입니다. 이 값들을 복사해두세요.

## 2. 환경 변수 채우기

`.env.example`을 복사해서 `.env`로 만들고, 방금 복사한 값을 채웁니다.

```
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_INSTRUCTOR_CODE=원하는 암호로 변경
```

`VITE_INSTRUCTOR_CODE`는 `/instructor` 페이지 접속할 때 입력하는 암호입니다. 교육생에게 노출되지 않도록 원하는 값으로 바꿔주세요.

## 3. 로컬에서 확인 (선택)

```
npm install
npm run dev
```

## 4. GitHub에 올리기

리더십 워크숍 때 쓰신 것과 같은 방법(GitHub 웹사이트에서 "Add file → Upload files")으로 올리셔도 되고, `git`을 쓰신다면:

```
git init
git add .
git commit -m "현대 모터스튜디오 교육 실시간 입력 앱"
gh repo create motorstudio-training --private --source=. --push
```
(`gh` CLI가 없다면 GitHub에서 **새 저장소**를 만들고, 안내되는 `git remote add origin ...` 명령을 사용하세요.)

⚠️ `.env` 파일은 `.gitignore`에 포함되어 있어 자동으로 제외됩니다. 실수로 올리지 않도록 커밋 전 목록을 한 번 확인하세요.

## 5. Vercel 배포

1. https://vercel.com 에서 **Add New > Project** → 방금 만든 GitHub 저장소(`motorstudio-training`) 선택
2. Framework는 자동으로 Vite로 인식됩니다. 그대로 두면 됩니다
3. **Environment Variables**에 위 `.env`에 넣었던 7개 값을 그대로 이름/값 쌍으로 등록 (Secret/Config 여부는 Config로 두면 됩니다)
4. **Deploy** 클릭 → 몇 분 뒤 `https://xxxx.vercel.app` 같은 주소가 나옵니다
5. `/instructor` 처럼 `/`가 아닌 경로에서 새로고침 시 404가 뜨면, 이 저장소의 `vercel.json`(SPA 라우팅 리라이트)이 잘 올라갔는지 확인하고, 안 올라갔다면 GitHub에 추가 후 재배포하세요. (리더십 워크숍 때 겪었던 것과 동일한 문제이며, 이번 프로젝트에는 처음부터 `vercel.json`을 포함해 두었습니다.)

## 6. 당일(9/7) 사용법

- 교육생에게 배포된 **기본 주소**(예: `https://motorstudio-training.vercel.app`)를 QR코드나 링크로 공유 → 이름 입력하면 바로 개인 입력 화면
- 강사는 같은 주소 뒤에 `/instructor`를 붙여서 접속 (예: `https://motorstudio-training.vercel.app/instructor`) → 설정한 암호 입력
- 표정 이미지·사례 슬라이드·주차요금 안내표는 강사가 화면 공유나 스크린으로 직접 보여주고, 교육생은 폰으로 답변만 입력합니다
- 강사 화면은 교육생이 입력할 때마다 실시간으로 카드가 갱신됩니다. 카드를 클릭하면 전체 화면으로 확대되어 다 같이 보기 좋습니다
- 문항 순서대로 진행해도 되고, 순서 상관없이 아무 때나 작성해도 됩니다. 항목마다 따로 자동 저장되기 때문에 진행 속도를 자유롭게 조절하셔도 문제 없습니다

## 무료 사용량 관련

Firebase Firestore, Vercel 모두 무료(Spark/Hobby) 플랜으로 충분합니다. 7명이 하루 사용하는 정도의 트래픽은 무료 한도에 전혀 걸리지 않습니다.
