# YouTube 플레이리스트 → 슬랙 자동 공유 시스템 📺➡️💬

YouTube 플레이리스트의 최신 공개 영상을 자동으로 가져와서 슬랙으로 전송하는 웹 애플리케이션입니다.

## 🚀 빠른 시작

### 방법 1: 로컬 웹 서버 사용 (추천)

**Python 3가 설치되어 있는 경우:**
```bash
python3 server.py
```

그 다음 브라우저에서 접속:
```
http://localhost:8000/youtube-playlist-tracker.html
```

**Node.js가 설치되어 있는 경우:**
```bash
npx serve .
```

### 방법 2: 온라인 호스팅

HTML 파일을 다음 서비스에 업로드:
- [GitHub Pages](https://pages.github.com/)
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

### ⚠️ 주의: HTML 파일 직접 열기는 작동하지 않음

HTML 파일을 더블클릭해서 `file://` 프로토콜로 열면 브라우저의 CORS 정책 때문에 슬랙 자동 전송이 작동하지 않습니다. 반드시 위의 방법 중 하나를 사용하세요.

---

## 📋 초기 설정

### 1단계: YouTube Data API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성
3. "API 및 서비스" → "라이브러리"
4. "YouTube Data API v3" 검색 후 사용 설정
5. "사용자 인증 정보" → "API 키 만들기"
6. 생성된 API 키 복사

### 2단계: Google Apps Script 설정 (슬랙 자동 전송용)

1. [Google Apps Script](https://script.google.com) 접속
2. 새 프로젝트 생성
3. `slack-webhook-gas.js` 파일의 내용을 복사하여 붙여넣기
4. "배포" → "새 배포"
   - 유형: **웹 앱**
   - 액세스 권한: **모든 사용자** ⚠️ 중요!
5. 배포 URL 복사 (형식: `https://script.google.com/.../exec`)

📖 자세한 내용: `GAS_SETUP_GUIDE.md` 참조

### 3단계: 슬랙 Webhook 생성

1. [Slack API](https://api.slack.com/apps) 접속
2. "Create New App" → "From scratch"
3. 앱 이름과 워크스페이스 선택
4. "Incoming Webhooks" 활성화
5. "Add New Webhook to Workspace"
6. 메시지를 받을 채널 선택
7. Webhook URL 복사

---

## 💻 사용 방법

### 웹 앱 설정

1. **YouTube API 키** 입력
2. **플레이리스트 URL** 입력
3. **Google Apps Script URL** 입력 (선택사항)
4. **슬랙 Webhook URL** 입력 (선택사항)
5. "최신 영상 가져오기" 버튼 클릭

### 결과

- ✅ 최신 공개 영상의 정보와 링크 표시
- ✅ 슬랙 설정 시 자동으로 채널에 전송
- ✅ 링크 복사 버튼으로 수동 공유 가능

### 보안 기능

- 설정 정보는 저장 후 자동으로 숨겨짐
- "수정" 버튼으로 필요시에만 다시 열기
- 모든 데이터는 브라우저 로컬 스토리지에만 저장

---

## 📁 파일 구조

```
├── youtube-playlist-tracker.html  # 메인 웹 애플리케이션
├── slack-webhook-gas.js          # Google Apps Script 코드
├── server.py                     # 로컬 웹 서버 (Python)
├── GAS_SETUP_GUIDE.md           # GAS 설정 상세 가이드
├── TROUBLESHOOTING.md           # 문제 해결 가이드
└── README.md                    # 이 파일
```

---

## 🔧 문제 해결

### "슬랙 전송에 실패했습니다" 오류

1. **F12**로 개발자 도구 열기
2. **Console** 탭에서 오류 확인
3. `TROUBLESHOOTING.md` 파일의 단계별 가이드 참조

### 흔한 문제

**문제**: CORS 오류
- **원인**: HTML 파일을 직접 열었음
- **해결**: 로컬 서버 사용 또는 온라인 호스팅

**문제**: GAS에서 권한 오류
- **원인**: 배포 시 "액세스 권한"이 잘못 설정됨
- **해결**: "모든 사용자"로 재배포

**문제**: 슬랙에 메시지가 안 옴
- **원인**: Webhook URL 오류
- **해결**: GAS의 `testSlackWebhook()` 함수로 테스트

---

## 🎯 주요 기능

### ✅ 구현된 기능

- [x] YouTube 플레이리스트 최신 영상 자동 추출
- [x] 비공개/Unlisted 영상 자동 제외
- [x] 슬랙 자동 전송 (Google Apps Script 프록시 사용)
- [x] 풍부한 슬랙 메시지 (썸네일, 제목, 설명, 버튼)
- [x] 링크 복사 기능
- [x] 설정 정보 자동 저장 및 마스킹
- [x] 상세한 오류 메시지
- [x] 로컬 웹 서버 제공

### 💡 향후 개선 가능 사항

- [ ] 주기적 자동 체크 (크론 작업)
- [ ] 여러 플레이리스트 동시 모니터링
- [ ] 이메일 알림 추가
- [ ] 읽음/안 읽음 상태 관리

---

## 💰 비용

모든 서비스는 무료입니다!

- **YouTube Data API**: 하루 10,000 유닛 (영상 조회 1회 = 1유닛)
- **Google Apps Script**: 하루 20,000 URL Fetch 호출
- **슬랙 Webhook**: 무제한

---

## 🙏 도움말

문제가 발생하면:

1. `TROUBLESHOOTING.md` 확인
2. 브라우저 Console 로그 확인
3. GAS 실행 로그 확인

---

## 📜 라이선스

MIT License - 자유롭게 사용, 수정, 배포하세요!

---

## 🎉 완성!

이제 YouTube 플레이리스트의 최신 영상이 자동으로 슬랙에 공유됩니다!

궁금한 점이 있으면 문의해주세요. 😊
