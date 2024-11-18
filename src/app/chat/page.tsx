"use client"; // 클라이언트 컴포넌트로 선언

import { useEffect, useState } from "react";

interface Message {
  user: string;
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // WebSocket 초기화
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000/chat?userId=lee");

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

    // 컴포넌트 언마운트 시 WebSocket 닫기
    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && socket) {
      const message = {
        from: "lee", // 현재 사용자 ID (보낸 사람)
        to: "nana", // 받을 사람 ID
        message: input, // 실제 메시지 내용
      };
      socket.send(JSON.stringify(message)); // 서버로 메시지 전송
      setMessages((prev) => [...prev, { user: "You", text: input }]); // 로컬에 추가 (보낸 사람: "You")
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded-lg ${
              message.user === "You"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            <strong>{message.user}: </strong>
            {message.text}
          </div>
        ))}
      </div>
      <div className="p-4 bg-white border-t border-gray-200 flex items-center">
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
  );
};

export default Chat;
