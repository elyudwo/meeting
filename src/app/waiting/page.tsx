"use client"; // 클라이언트 컴포넌트로 선언

import { useRouter } from "next/navigation";

const Waiting: React.FC = () => {
  const router = useRouter();

  const cancelMatching = () => {
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
