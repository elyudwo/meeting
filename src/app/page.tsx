import Link from "next/link";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">랜덤 채팅</h1>
      <p className="text-lg text-gray-600 mb-8">
        새로운 사람들과 지금 바로 대화해보세요!
      </p>
      <Link href="/waiting">
        <button className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600">
          시작하기
        </button>
      </Link>
    </div>
  );
};

export default Home;
