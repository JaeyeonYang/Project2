import Link from "next/link";

const dummyLabs = [
  { id: "1", name: "Stanford AI Lab", score: 0.92, school: "Stanford" },
  { id: "2", name: "MIT CSAIL", score: 0.89, school: "MIT" },
  { id: "3", name: "Berkeley BAIR", score: 0.87, school: "UC Berkeley" },
  { id: "4", name: "Caltech AI Lab", score: 0.85, school: "Caltech" },
  { id: "5", name: "Harvard NLP Group", score: 0.83, school: "Harvard" },
];

export default function Recommend() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f8f9fa] text-[#1a2233]">
      <main className="flex flex-col items-center gap-8 p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">연구실 추천 결과</h2>
        <div className="grid gap-6 w-full">
          {dummyLabs.map((lab) => (
            <div key={lab.id} className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{lab.name}</div>
                <div className="text-sm text-[#888]">{lab.school}</div>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <span className="text-base font-bold text-[#223366]">유사도: {(lab.score * 100).toFixed(1)}%</span>
                <Link href={`/lab/${lab.id}`} className="underline text-[#1a2233]">상세보기</Link>
              </div>
            </div>
          ))}
        </div>
        <Link href="/upload">
          <button className="mt-8 underline text-[#1a2233]">CV 다시 업로드</button>
        </Link>
      </main>
    </div>
  );
} 