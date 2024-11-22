"use client";

import { useRouter } from "next/navigation"; // App Router 전용 라우터
import { useState } from "react";

const Home = () => {
  const [nationality, setNationality] = useState<string>("한국");
  const [gender, setGender] = useState<string>("남자");
  const router = useRouter(); // App Router 전용 라우터

  const handleSubmit = async () => {
    const payload = { nationality, gender };

    try {
      const response = await fetch("http://localhost:5000/api/chat/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`서버 요청 실패: ${response.status}`);
      }

      const responseData = await response.json();

      // 쌍따옴표를 제거하기 위해 JWT를 그대로 저장
      localStorage.setItem("jwt", responseData.accessToken);
      console.log("jwt 데이터 :", responseData.accessToken);

      // 성공 시 /waiting 페이지로 리다이렉트
      router.push("/waiting"); // 클라이언트 리다이렉트
    } catch (error) {
      console.error("POST 요청 실패:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">정보 입력</h1>

      {/* 국적 선택 */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">국적</label>
        <select
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-64"
        >
          <option value="KOR">한국</option>
          <option value="JPN">일본</option>
        </select>
      </div>

      {/* 성별 선택 */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">성별</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-64"
        >
          <option value="MALE">남자</option>
          <option value="FEMALE">여자</option>
          <option value="NOSELECT">선택 안 함</option>
        </select>
      </div>

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        제출
      </button>
    </div>
  );
};

export default Home;
