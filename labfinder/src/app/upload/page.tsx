import Link from "next/link";

export default function Upload() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f8f9fa] text-[#1a2233]">
      <main className="flex flex-col items-center gap-8 p-8">
        <h2 className="text-2xl font-bold mb-2">CV 업로드</h2>
        <p className="text-center max-w-md mb-4">
          PDF, DOCX, TXT 파일을 업로드하면 자동으로 연구 키워드를 추출합니다.<br />
          (파일 업로드 및 키워드 추출 기능은 추후 구현 예정)
        </p>
        <div className="w-full flex flex-col items-center gap-4">
          <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1a2233] file:text-[#f8f9fa] hover:file:bg-[#223366]" disabled />
          <button className="bg-[#1a2233] text-[#f8f9fa] px-6 py-2 rounded-full text-base font-semibold shadow opacity-50 cursor-not-allowed" disabled>
            키워드 추출 (준비중)
          </button>
        </div>
        <Link href="/recommend">
          <button className="mt-8 underline text-[#1a2233]">(임시) 추천 결과로 이동</button>
        </Link>
      </main>
    </div>
  );
} 