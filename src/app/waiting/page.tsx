"use client"; // 클라이언트 컴포넌트로 선언

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Waiting: React.FC = () => {
  const router = useRouter();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (!storedToken) {
      console.error("JWT 토큰이 로컬 스토리지에 없습니다.");
      return;
    }

    // WebSocket 연결 시 토큰을 그대로 사용
    const ws = new WebSocket(`ws://localhost:5000/chat?token=${storedToken}`);

    ws.onopen = async () => {
      console.log("WebSocket 연결이 열렸습니다.");

      try {
        // HTTP 요청 시 토큰을 그대로 전달
        const url = `http://localhost:5000/api/chat/makeroom?token=${storedToken}`;
        await fetch(url, { method: "GET" });
      } catch (error) {
        console.error("HTTP 요청 중 오류 발생:", error);
      }
    };

    ws.onmessage = async (event) => {
      const response = JSON.parse(event.data);

      if (response.opponentId) {
        await localStorage.setItem("opponentId", response.opponentId);
        console.log("매칭 성공, 채팅 페이지로 이동");
        router.push("/chat");
      } else {
        console.log("응답:", response);
      }
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
  }, [router]);

  const cancelMatching = () => {
    if (socket) {
      socket.close();
    }
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">매칭 중...</h2>
      <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      <button
        onClick={cancelMatching}
        className="mt-8 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
      >
        취소하기
      </button>
    </div>
  );
};

export default Waiting;
