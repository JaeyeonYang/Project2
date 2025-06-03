import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f8f9fa] text-[#1a2233]">
      <main className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-4xl font-bold text-[#1a2233] mb-2">LabFinder</h1>
        <p className="text-lg max-w-xl text-center mb-8">
          이력서(CV) 및 활동 이력을 분석하여 관심 연구 키워드를 추출하고, 전 세계 연구실과의 벡터 유사도 분석을 통해 맞춤형 연구실을 추천하는 AI 웹 서비스입니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Link href="/upload" className="block">
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">CV 업로드</h2>
              <p className="text-[#666]">이력서를 업로드하여 맞춤형 연구실을 추천받으세요.</p>
            </div>
          </Link>
          <Link href="/database" className="block">
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">연구실 데이터베이스</h2>
              <p className="text-[#666]">전체 연구실 목록을 확인하고 검색하세요.</p>
            </div>
          </Link>
          <Link href="/about" className="block">
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">서비스 소개</h2>
              <p className="text-[#666]">LabFinder의 특징과 사용 방법 소개.</p>
            </div>
          </Link>
          <Link href="/contact" className="block">
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">문의하기</h2>
              <p className="text-[#666]">궁금한 점이 있으시다면 문의해 주세요.</p>
            </div>
          </Link>
        </div>
      </main>
      <footer className="mt-auto py-4 text-sm text-[#888]">&copy; 2024 LabFinder Group 3</footer>
    </div>
  );
}
