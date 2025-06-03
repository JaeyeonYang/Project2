import { notFound } from "next/navigation";

const dummyLabs = [
  { id: "1", name: "Stanford AI Lab", school: "Stanford", desc: "Stanford AI Lab은 인공지능 분야의 선도적 연구실입니다." },
  { id: "2", name: "MIT CSAIL", school: "MIT", desc: "MIT CSAIL은 컴퓨터 과학 및 인공지능 연구의 중심입니다." },
  { id: "3", name: "Berkeley BAIR", school: "UC Berkeley", desc: "BAIR는 로봇, 딥러닝 등 다양한 AI 연구를 선도합니다." },
  { id: "4", name: "Caltech AI Lab", school: "Caltech", desc: "Caltech AI Lab은 혁신적인 AI 연구를 수행합니다." },
  { id: "5", name: "Harvard NLP Group", school: "Harvard", desc: "Harvard NLP Group은 자연어처리 분야의 연구를 이끕니다." },
];

export default function LabDetail({ params }: { params: { id: string } }) {
  const lab = dummyLabs.find((l) => l.id === params.id);
  if (!lab) return notFound();
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f8f9fa] text-[#1a2233]">
      <main className="flex flex-col items-center gap-8 p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-2">{lab.name}</h2>
        <div className="text-lg text-[#223366] font-semibold mb-2">{lab.school}</div>
        <p className="text-base text-center mb-4">{lab.desc}</p>
        <button className="bg-[#1a2233] text-[#f8f9fa] px-6 py-2 rounded-full text-base font-semibold shadow" disabled>
          지원하기 (준비중)
        </button>
      </main>
    </div>
  );
} 