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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recommended Labs</h1>
      
      <div className="w-full space-y-4">
        {labs.map((lab) => (
          <div key={lab.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center">
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{lab.name}</h2>
                <p className="text-gray-600">{lab.school}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {lab.keywords.split(", ").slice(0, 3).map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ml-4">
                <Link href={`/lab/${lab.id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 