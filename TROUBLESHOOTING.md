# 슬랙 전송 문제 해결 가이드 🔧

## 1단계: 브라우저 Console 확인

1. **F12** 키를 눌러 개발자 도구 열기
2. **Console** 탭 클릭
3. "최신 영상 가져오기" 버튼 다시 클릭
4. Console에 나타나는 오류 메시지 확인

### 확인할 내용:
- `GAS URL:` - Google Apps Script URL이 올바르게 출력되는지
- `Webhook URL:` - 슬랙 Webhook URL이 올바르게 출력되는지
- `Response status:` - 응답 상태 코드
- `Response data:` - 서버 응답 내용

---

## 2단계: GAS URL 확인

### ✅ 올바른 형식:
```
https://script.google.com/macros/s/AKfycby.../exec
```

### ❌ 잘못된 형식:
```
https://script.google.com/macros/s/AKfycby.../dev
https://script.google.com/home/...
```

### 확인 방법:
1. Google Apps Script로 이동
2. "배포" → "배포 관리"
3. 활성 배포의 "웹 앱 URL" 확인
4. URL이 `/exec`로 끝나는지 확인

---

## 3단계: GAS 배포 권한 확인

### 필수 설정:
- **액세스 권한**: "모든 사용자" ✅
- **다음 사용자로 실행**: "나"

### 재배포 방법:
1. Google Apps Script 편집기
2. "배포" → "배포 관리"
3. 연필 아이콘 (편집) 클릭
4. "새 버전" 클릭
5. "배포" 버튼 클릭

---

## 4단계: 슬랙 Webhook URL 확인

### ✅ 올바른 형식:
```
https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```

### 확인 방법:
1. [Slack Apps](https://api.slack.com/apps) 접속
2. 본인의 앱 선택
3. "Incoming Webhooks" 메뉴
4. "Webhook URL" 복사
5. URL이 `https://hooks.slack.com/services/`로 시작하는지 확인

---

## 5단계: GAS에서 직접 테스트

### 방법 1: 테스트 함수 실행

1. Google Apps Script 편집기 열기
2. 제공된 `testSlackWebhook()` 함수 찾기
3. `YOUR_SLACK_WEBHOOK_URL_HERE`를 실제 Webhook URL로 교체
4. 함수 선택 후 "실행" 버튼 클릭
5. 권한 승인 (처음 실행시)
6. 슬랙 채널에 테스트 메시지가 오는지 확인

```javascript
function testSlackWebhook() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        webhookUrl: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
        message: {
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "테스트 메시지입니다!"
              }
            }
          ]
        }
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
```

7. "보기" → "로그" 또는 "실행 로그"에서 결과 확인

### 방법 2: 브라우저에서 GAS URL 직접 접속

1. GAS 배포 URL을 브라우저 주소창에 입력
2. 다음과 같은 응답이 나와야 함:
```json
{
  "status": "ok",
  "message": "Slack Webhook Proxy is running",
  "timestamp": "2025-01-14T..."
}
```

3. 오류가 나오면 배포가 제대로 되지 않은 것

---

## 6단계: 흔한 오류 및 해결법

### 오류: "No post data received"
**원인**: GAS가 POST 요청을 받지 못함  
**해결**: 
- GAS URL이 `/exec`로 끝나는지 확인
- 웹 앱에서 URL 앞뒤 공백 제거

### 오류: "Invalid Slack webhook URL format"
**원인**: 슬랙 Webhook URL이 잘못됨  
**해결**: 
- URL이 `https://hooks.slack.com/services/`로 시작하는지 확인
- 슬랙에서 새 Webhook 생성

### 오류: "Slack webhook failed with status 404"
**원인**: 슬랙 Webhook URL이 유효하지 않음  
**해결**: 
- 슬랙 앱 설정에서 Webhook이 삭제되지 않았는지 확인
- 새 Webhook 생성 후 다시 시도

### 오류: "Slack webhook failed with status 403"
**원인**: Webhook 권한 문제  
**해결**: 
- 슬랙 앱이 채널에 추가되었는지 확인
- Webhook을 재생성

### 오류: Network error / Failed to fetch
**원인**: GAS URL 자체에 접근 불가  
**해결**: 
1. 배포 권한이 "모든 사용자"인지 확인
2. 브라우저에서 GAS URL 직접 접속하여 응답 확인
3. 새로 배포 후 새 URL 사용

---

## 7단계: 네트워크 탭 확인

1. **F12** → **Network** 탭
2. "최신 영상 가져오기" 버튼 클릭
3. GAS URL로 가는 요청 찾기
4. 클릭하여 상세 정보 확인:
   - **Request Headers**: Content-Type이 application/json인지
   - **Request Payload**: webhookUrl과 message가 포함되어 있는지
   - **Response**: 서버 응답 내용

---

## 8단계: 완전 재설정

모든 방법이 실패하면:

1. **GAS 재배포**:
   - 기존 배포 삭제
   - 코드 다시 붙여넣기
   - 새로 배포
   - 새 URL 받기

2. **슬랙 Webhook 재생성**:
   - 기존 Webhook 삭제
   - 새 Incoming Webhook 생성
   - 새 URL 받기

3. **웹 앱 초기화**:
   - 브라우저 개발자 도구 (F12)
   - Application 탭 → Local Storage
   - 모든 항목 삭제
   - 페이지 새로고침
   - 모든 정보 다시 입력

---

## 추가 도움

여전히 문제가 해결되지 않으면:

1. **Console 로그 전체 복사**
2. **Network 탭의 요청/응답 복사**
3. **GAS 실행 로그 복사**

이 정보를 가지고 문제를 분석할 수 있습니다.
