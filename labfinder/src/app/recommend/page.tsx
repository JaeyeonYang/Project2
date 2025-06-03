import Link from "next/link";

const labs = [
  {
    id: "1",
    name: "Sara Achour Lab",
    school: "Stanford CS",
    score: 0.92,
    keywords: "Analog computing, Programming languages, Compilers, Runtime systems, Non-traditional hardware, Emerging computing platforms",
    description: "The research lab led by Assistant Professor Sara Achour at Stanford University focuses on bridging the gap between the ease of use desired by end-users and the complex intricacies of emerging analog computing platforms."
  },
  {
    id: "2",
    name: "Nima Anari Lab",
    school: "Stanford CS",
    score: 0.89,
    keywords: "Algorithms, Probability, Combinatorics, Theoretical Computer Science, Algorithm Design, Randomized Algorithms",
    description: "The lab focuses on theoretical computer science, particularly the interplay of algorithms, probability, and combinatorics."
  },
  {
    id: "3",
    name: "Zain Asgar Lab",
    school: "Stanford CS",
    score: 0.87,
    keywords: "Artificial Intelligence, AI Index, AI Governance, AI Ethics, Human-Computer Interaction, Robotics",
    description: "The lab is deeply involved in diverse aspects of artificial intelligence (AI) research and its societal implications."
  },
  {
    id: "4",
    name: "Peter Bailis Lab",
    school: "Stanford CS",
    score: 0.85,
    keywords: "Artificial Intelligence, AI Index, AI Governance, AI Ethics, Machine Learning, Deep Learning",
    description: "The lab focuses on artificial intelligence research and its societal implications, with a strong emphasis on both technological advancement and ethical considerations."
  },
  {
    id: "5",
    name: "Clark Barrett Lab",
    school: "Stanford CS",
    score: 0.83,
    keywords: "Automated Reasoning, AI, Centaur, Theorem Proving, Satisfiability Modulo Theories (SMT), Constraint Satisfaction",
    description: "The Center for Automated Reasoning (CAR) at Stanford University is a leading research hub dedicated to advancing the frontiers of automated reasoning and its applications in artificial intelligence."
  }
];

export default function Recommend() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f8f9fa] text-[#1a2233]">
      <main className="flex flex-col items-center gap-8 p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">연구실 추천 결과</h2>
        <div className="grid gap-6 w-full">
          {labs.map((lab) => (
            <div key={lab.id} className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{lab.name}</div>
                <div className="text-sm text-[#888]">{lab.school}</div>
                <div className="text-sm text-[#666] mt-1">{lab.keywords}</div>
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