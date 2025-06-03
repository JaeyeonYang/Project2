import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f8f9fa] text-[#1a2233]">
      <main className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-4xl font-bold text-[#1a2233] mb-2">LabFinder</h1>
        <p className="text-lg max-w-xl text-center mb-4">
          이력서(CV) 및 활동 이력을 분석하여 관심 연구 키워드를 추출하고, 전 세계 연구실과의 벡터 유사도 분석을 통해 맞춤형 연구실을 추천하는 AI 웹 서비스입니다.
        </p>
        <Link href="/upload">
          <button className="bg-[#1a2233] text-[#f8f9fa] px-8 py-3 rounded-full text-lg font-semibold shadow hover:bg-[#223366] transition">시작하기</button>
        </Link>
      </main>
      <footer className="mt-auto py-4 text-sm text-[#888]">&copy; 2024 LabFinder Group 3</footer>
    </div>
  );
}
