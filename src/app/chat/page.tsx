"use client";

import { useEffect, useState } from "react";

interface Message {
  to: string;
  message: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // WebSocket 초기화
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.error("JWT 토큰이 로컬 스토리지에 없습니다.");
      return;
    }
    const ws = new WebSocket(
      `ws://localhost:5000/chat?token=${encodeURIComponent(token)}`
    );

    ws.onopen = () => {
      console.log("WebSocket 연결이 열렸습니다.");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as Message;
      setMessages((prev) => [...prev, message]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket 오류:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket 연결이 닫혔습니다.");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = async () => {
    if (input.trim() && socket) {
      const opponent = await localStorage.getItem("opponentId");
      const message = {
        to: opponent, // 받을 사람 ID
        message: input, // 실제 메시지 내용
      };
      socket.send(JSON.stringify(message));
      setMessages((prev) => [...prev, { to: "You", message: input }]);
      setInput("");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-50">
      <div className="w-full max-w-3xl mx-auto flex flex-col h-[90%] bg-white rounded-lg shadow-lg">
        {/* 메시지 리스트 */}
        <div className="flex-grow overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex flex-col ${
                message.to === "You" ? "items-end" : "items-start"
              }`}
            >
              {/* 발신자 이름 */}
              <span className="text-sm text-gray-500">{message.to}</span>
              {/* 메시지 박스 */}
              <div
                className={`max-w-xs p-3 rounded-lg text-sm ${
                  message.to === "You"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.message}
              </div>
            </div>
          ))}
        </div>

        {/* 메시지 입력창 */}
        <div className="p-4 bg-gray-100 border-t border-gray-300 flex items-center">
          <input
            type="text"
            className="flex-grow border border-gray-300 rounded-lg p-2"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
