// Google Apps Script 코드
// 이 코드를 Google Apps Script에 배포하여 사용하세요

function doPost(e) {
  try {
    // 요청 데이터 파싱
    if (!e || !e.postData || !e.postData.contents) {
      return createCorsResponse({
        success: false,
        error: 'No post data received'
      });
    }
    
    const data = JSON.parse(e.postData.contents);
    const { webhookUrl, message } = data;
    
    // 입력 검증
    if (!webhookUrl) {
      return createCorsResponse({
        success: false,
        error: 'webhookUrl is missing'
      });
    }
    
    if (!message) {
      return createCorsResponse({
        success: false,
        error: 'message is missing'
      });
    }
    
    // 슬랙 Webhook URL 유효성 검사
    if (!webhookUrl.startsWith('https://hooks.slack.com/')) {
      return createCorsResponse({
        success: false,
        error: 'Invalid Slack webhook URL format'
      });
    }
    
    // 슬랙 Webhook으로 메시지 전송
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(message),
      muteHttpExceptions: true
    };
    
    Logger.log('Sending to Slack: ' + webhookUrl);
    const response = UrlFetchApp.fetch(webhookUrl, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log('Slack response code: ' + responseCode);
    Logger.log('Slack response text: ' + responseText);
    
    if (responseCode === 200) {
      return createCorsResponse({
        success: true,
        message: 'Message sent to Slack successfully'
      });
    } else {
      return createCorsResponse({
        success: false,
        error: 'Slack webhook failed with status ' + responseCode,
        statusCode: responseCode,
        response: responseText
      });
    }
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return createCorsResponse({
      success: false,
      error: error.toString(),
      stack: error.stack
    });
  }
}

function doGet(e) {
  return createCorsResponse({
    status: 'ok',
    message: 'Slack Webhook Proxy is running',
    timestamp: new Date().toISOString()
  });
}

// CORS 헤더를 포함한 응답 생성
function createCorsResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // CORS 헤더는 Google Apps Script에서 자동으로 처리되지 않으므로
  // 클라이언트 측에서 처리하거나 다른 방법을 사용해야 합니다
  return output;
}

// 테스트 함수 - GAS 편집기에서 실행하여 테스트
function testSlackWebhook() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        webhookUrl: "YOUR_SLACK_WEBHOOK_URL_HERE", // 여기에 실제 Webhook URL 입력
        message: {
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: "🧪 테스트 메시지",
                emoji: true
              }
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "Google Apps Script가 정상적으로 작동합니다!"
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

