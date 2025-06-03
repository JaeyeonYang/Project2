import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-[#1a365d] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              LabFinder
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-white/90">
              AI 기반 연구실 매칭 서비스로, 당신의 연구 경력과 관심사를 분석하여
              <br className="hidden md:block" />
              최적의 연구실을 추천해드립니다.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose LabFinder?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI 기술을 활용한 맞춤형 연구실 추천으로, 당신의 연구 경력을 한 단계 더 발전시켜보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="w-12 h-12 bg-[#1a365d]/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">CV 분석</h3>
            <p className="text-gray-600">
              이력서와 활동 이력을 AI가 분석하여 연구 관심사와 역량을 파악합니다.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="w-12 h-12 bg-[#1a365d]/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">맞춤형 추천</h3>
            <p className="text-gray-600">
              유사도 분석을 통해 당신에게 가장 적합한 연구실을 추천해드립니다.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="w-12 h-12 bg-[#1a365d]/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">전문 데이터베이스</h3>
            <p className="text-gray-600">
              전 세계 주요 대학의 연구실 정보를 한눈에 확인하고 검색할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/upload" className="block">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#1a365d]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">CV 업로드</h2>
              </div>
              <p className="text-gray-600 mb-4">
                이력서를 업로드하여 AI가 분석한 맞춤형 연구실 추천을 받아보세요.
              </p>
              <div className="text-[#1a365d] font-medium flex items-center gap-2">
                시작하기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/database" className="block">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#1a365d]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">연구실 데이터베이스</h2>
              </div>
              <p className="text-gray-600 mb-4">
                전 세계 주요 대학의 연구실 정보를 검색하고 필터링해보세요.
              </p>
              <div className="text-[#1a365d] font-medium flex items-center gap-2">
                둘러보기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2024 LabFinder Group 3. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <Link href="/about" className="hover:text-[#1a365d]">서비스 소개</Link>
              <Link href="/contact" className="hover:text-[#1a365d]">문의하기</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
