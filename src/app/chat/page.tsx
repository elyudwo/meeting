"use client"; // 클라이언트 컴포넌트로 선언

import { useState } from "react";

interface Message {
  user: string;
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { user: "You", text: input }]);
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
