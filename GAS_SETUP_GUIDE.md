# Google Apps Script 설정 가이드

## 📋 개요
이 가이드는 YouTube 플레이리스트 최신 영상을 슬랙으로 자동 전송하기 위한 Google Apps Script 설정 방법을 안내합니다.

## 🚀 설정 단계

### 1단계: Google Apps Script 프로젝트 생성

1. [Google Apps Script](https://script.google.com) 접속
2. 좌측 상단 **"새 프로젝트"** 클릭
3. 프로젝트 이름 설정 (예: "YouTube to Slack Webhook Proxy")

### 2단계: 코드 붙여넣기

1. 기본 `Code.gs` 파일의 모든 내용 삭제
2. 제공된 `slack-webhook-gas.js` 파일의 내용을 복사
3. `Code.gs` 파일에 붙여넣기
4. 상단 **저장 아이콘** 클릭 (또는 Ctrl+S / Cmd+S)

### 3단계: 웹 앱으로 배포

1. 우측 상단 **"배포"** → **"새 배포"** 클릭
2. **"유형 선택"** → **"웹 앱"** 선택
3. 설정:
   - **설명**: "Slack Webhook Proxy" (선택사항)
   - **다음 사용자로 실행**: **나**
   - **액세스 권한**: **모든 사용자** ⚠️ 중요!
4. **"배포"** 버튼 클릭
5. 권한 승인:
   - "권한 검토" 클릭
   - Google 계정 선택
   - "고급" → "안전하지 않은 페이지로 이동" 클릭 (본인이 만든 앱이므로 안전함)
   - "허용" 클릭

### 4단계: 배포 URL 복사

1. 배포 완료 후 표시되는 **"웹 앱 URL"** 복사
   - 형식: `https://script.google.com/macros/s/XXXXX.../exec`
2. 이 URL을 웹 애플리케이션의 "Google Apps Script 배포 URL" 필드에 입력

## 🔧 코드 설명

```javascript
function doPost(e) {
  // POST 요청을 받아서 처리
  const data = JSON.parse(e.postData.contents);
  const { webhookUrl, message } = data;
  
  // 슬랙 Webhook으로 메시지 전송
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(message)
  };
  
  UrlFetchApp.fetch(webhookUrl, options);
  // 성공 응답 반환
}
```

## ✅ 테스트 방법

### 방법 1: 웹 애플리케이션에서 테스트
1. YouTube API 키 입력
2. 플레이리스트 URL 입력
3. GAS 배포 URL 입력
4. 슬랙 Webhook URL 입력
5. "최신 영상 가져오기" 버튼 클릭
6. 슬랙 채널에 메시지가 전송되는지 확인

### 방법 2: 직접 테스트 (고급)
Google Apps Script 편집기에서:
```javascript
function testSlackWebhook() {
  const testData = {
    parameter: {},
    postData: {
      contents: JSON.stringify({
        webhookUrl: "YOUR_SLACK_WEBHOOK_URL",
        message: {
          text: "테스트 메시지입니다!"
        }
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
```

## 🔐 보안 고려사항

- **중요**: GAS URL과 슬랙 Webhook URL은 민감한 정보입니다
- 브라우저 로컬 스토리지에만 저장되며, 서버로 전송되지 않습니다
- GAS URL을 공개적으로 공유하지 마세요
- 필요시 배포를 삭제하고 재배포하여 새 URL을 생성할 수 있습니다

## 🛠️ 문제 해결

### "권한이 없습니다" 오류
- 배포 시 "액세스 권한"을 "모든 사용자"로 설정했는지 확인

### 슬랙에 메시지가 전송되지 않음
1. 슬랙 Webhook URL이 올바른지 확인
2. GAS 배포 URL이 `/exec`로 끝나는지 확인
3. Google Apps Script 실행 로그 확인:
   - 편집기 → "실행" 탭 → 최근 실행 내역 확인

### CORS 오류
- Google Apps Script는 CORS를 자동으로 처리하므로 발생하지 않아야 함
- 만약 발생한다면 GAS URL이 올바르게 배포되었는지 확인

## 📝 배포 업데이트

코드를 수정한 경우:
1. 코드 저장
2. "배포" → "배포 관리"
3. 기존 배포 옆의 연필 아이콘 클릭
4. "버전" → "새 버전"
5. "배포" 클릭

URL은 변경되지 않으므로 웹 애플리케이션에서 다시 입력할 필요가 없습니다.

## 💰 비용

Google Apps Script는 무료입니다!
- 하루 URL Fetch 호출: 20,000회
- 스크립트 실행 시간: 하루 90분

YouTube 영상 공유 용도로는 충분합니다.

## 🎉 완료!

이제 YouTube 플레이리스트의 최신 영상이 자동으로 슬랙으로 전송됩니다!
