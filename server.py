#!/usr/bin/env python3
"""
간단한 로컬 웹 서버
YouTube 플레이리스트 트래커를 실행하기 위한 서버입니다.

사용 방법:
1. 이 파일을 youtube-playlist-tracker.html과 같은 폴더에 저장
2. 터미널/명령 프롬프트에서 실행:
   python3 server.py
   또는
   python server.py
3. 브라우저에서 http://localhost:8000 접속
"""

import http.server
import socketserver
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS 헤더 추가
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"✅ 서버가 시작되었습니다!")
        print(f"🌐 브라우저에서 http://localhost:{PORT}/youtube-playlist-tracker.html 을 여세요")
        print(f"⏹️  중지하려면 Ctrl+C를 누르세요\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n서버를 종료합니다...")
            httpd.shutdown()
