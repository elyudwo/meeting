import { useEffect, useState } from "react";

interface WebSocketOptions {
  onMessage: (message: any) => void; // 메시지 처리 핸들러
  onOpen?: () => void; // WebSocket 연결 성공 시 실행
  onClose?: () => void; // WebSocket 연결 종료 시 실행
}

const useWebSocket = (url: string, options: WebSocketOptions) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket 연결이 열렸습니다.");
      options.onOpen?.();
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      options.onMessage(message);
    };

    ws.onerror = (error) => {
      console.error("WebSocket 오류:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket 연결이 닫혔습니다.");
      options.onClose?.();
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  return socket;
};

export default useWebSocket;
