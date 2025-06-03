import Link from "next/link";

const labs = [
  // Computer Science Department
  {
    id: "cs-1",
    name: "Sara Achour Lab",
    school: "Stanford CS",
    keywords: "Analog computing, Programming languages, Compilers, Runtime systems, Non-traditional hardware, Emerging computing platforms",
    description: "The research lab led by Assistant Professor Sara Achour at Stanford University focuses on bridging the gap between the ease of use desired by end-users and the complex intricacies of emerging analog computing platforms."
  },
  {
    id: "cs-2",
    name: "Nima Anari Lab",
    school: "Stanford CS",
    keywords: "Algorithms, Probability, Combinatorics, Theoretical Computer Science, Algorithm Design, Randomized Algorithms",
    description: "The lab focuses on theoretical computer science, particularly the interplay of algorithms, probability, and combinatorics."
  },
  {
    id: "cs-3",
    name: "Zain Asgar Lab",
    school: "Stanford CS",
    keywords: "Artificial Intelligence, AI Index, AI Governance, AI Ethics, Human-Computer Interaction, Robotics",
    description: "The lab is deeply involved in diverse aspects of artificial intelligence (AI) research and its societal implications."
  },
  {
    id: "cs-4",
    name: "Peter Bailis Lab",
    school: "Stanford CS",
    keywords: "Artificial Intelligence, AI Index, AI Governance, AI Ethics, Machine Learning, Deep Learning",
    description: "The lab focuses on artificial intelligence research and its societal implications, with a strong emphasis on both technological advancement and ethical considerations."
  },
  {
    id: "cs-5",
    name: "Clark Barrett Lab",
    school: "Stanford CS",
    keywords: "Automated Reasoning, AI, Centaur, Theorem Proving, Satisfiability Modulo Theories (SMT), Constraint Satisfaction",
    description: "The Center for Automated Reasoning (CAR) at Stanford University is a leading research hub dedicated to advancing the frontiers of automated reasoning and its applications in artificial intelligence."
  },

  // Electrical Engineering Department
  {
    id: "ee-1",
    name: "Amin Arbabian Lab",
    school: "Stanford EE",
    keywords: "Optics, Electronics, Valleytronics, Quantum Sensing, Energy Efficiency, Grid Reliability, Renewable Energy, Net Zero Transition, Climate Change, Global Environmental Policy",
    description: "The lab focuses on applied physics, energy, and related policy areas, with research spanning from optics and electronics to energy efficiency and environmental sustainability."
  },
  {
    id: "ee-2",
    name: "Lambertus Hesselink Lab",
    school: "Stanford EE",
    keywords: "Nanophotonics, Nanostructures, Diffraction Limit, Particle Trapping, Enhanced Photodetector, VCSELs, Data Storage, Lab-on-a-Chip, Microfluidics",
    description: "The Hesselink Research Group explores fundamental light-matter interactions and translates these discoveries into novel applications across diverse fields, including nanotechnology, bio-engineering, and information technology."
  },
  {
    id: "ee-3",
    name: "Siddharth Krishnan Lab",
    school: "Stanford EE",
    keywords: "Optics, Electronics, Valleytronics, Quantum Sensing, Energy Efficiency, Grid Reliability, Renewable Energy, Net-Zero Transition, Energy Transition",
    description: "The lab conducts interdisciplinary research focusing on applied physics, energy, and environmental policy, with significant crossovers into statistics, international security, and quantum technologies."
  },
  {
    id: "ee-4",
    name: "Subhasish Mitra Lab",
    school: "Stanford EE",
    keywords: "Robust systems, digital systems, NanoSystems, brain-computer interfaces, BCI, neuromorphic computing, hardware security, fault tolerance, embedded systems",
    description: "The Robust Systems Group (RSG) is dedicated to advancing the frontiers of digital systems with a strong focus on robust operation, NanoSystems, and brain-computer interfaces (BCIs)."
  },

  // Mechanical Engineering Department
  {
    id: "me-1",
    name: "Adam Boies Lab",
    school: "Stanford ME",
    keywords: "Aerosols, Nanotechnology, Energy Storage, Sustainable Nanocarbons, Self-Assembled Materials, Nanoparticles, Pollution, Air Quality, Catalysis",
    description: "The Aerosol and Nanotechnology for Energy and the Environment (ANEE) group focuses on developing innovative energy and environmental technologies leveraging the unique properties of aerosols and nanomaterials."
  },
  {
    id: "me-2",
    name: "Steven Hartley Collins Lab",
    school: "Stanford ME",
    keywords: "Biomechatronics, Wearable robots, Exoskeletons, Prostheses, Human-in-the-loop optimization, Gait analysis, Ankle push-off, Arm swinging, Energy economy",
    description: "The Biomechatronics Laboratory designs and develops robotic systems to enhance human mobility, particularly focusing on individuals with disabilities."
  },
  {
    id: "me-3",
    name: "Mark Cutkosky Lab",
    school: "Stanford ME",
    keywords: "Bioinspired Robotics, Tadpole Robotics, Gecko Adhesives, Dry Adhesives, Vertical Climbing Robots, Underwater Robotics, Tactile Sensing, Multi-limbed Robotics",
    description: "The Bio-inspired Dynamic Manipulation Lab (BDML) pushes the boundaries of robotics, particularly in the areas of bio-inspired design, advanced manipulation, and medical applications."
  },
  {
    id: "me-4",
    name: "Eric Darve Lab",
    school: "Stanford ME",
    keywords: "Molecular Dynamics, Multiscale Modeling, Stochastic Methods, Accelerated Molecular Dynamics, Coarse-Grained Modeling, Numerical Analysis, High-Performance Computing",
    description: "The lab focuses on the development and application of advanced computational methods to solve complex problems in various scientific and engineering domains."
  },

  // Materials Science and Engineering Department
  {
    id: "mse-1",
    name: "Alberto Salleo Lab",
    school: "Stanford MSE",
    keywords: "Organic semiconductors, charge transport, mixed ionic-electronic conductors, structure-property relationships, biosensors, electrocatalysis, neuromorphic computation",
    description: "The Salleo Research Group advances the fundamental understanding and technological application of organic semiconducting materials."
  },
  {
    id: "mse-2",
    name: "Sarah Heilshorn Lab",
    school: "Stanford MSE",
    keywords: "Biomaterials, Regenerative Medicine, Tissue Engineering, Protein Engineering, Biomimetic Materials, 3D Bioprinting, Human Organoids",
    description: "The Heilshorn Biomaterials Group focuses on the design and development of novel biomaterials for applications in regenerative medicine and tissue engineering."
  },
  {
    id: "mse-3",
    name: "William Chueh Lab",
    school: "Stanford MSE",
    keywords: "Lithium-ion batteries, Sodium-ion batteries, Battery lifetime, Electrode utilization, Energy storage, Energy conversion, Redox reactions, Materials chemistry",
    description: "The Chueh Group advances energy storage and conversion technologies through fundamental materials science and chemistry research."
  },
  {
    id: "mse-4",
    name: "Yi Cui Lab",
    school: "Stanford MSE",
    keywords: "Battery technology, Green energy, Next-generation batteries, Energy storage, Renewable energy, Material science, Nanomaterials, Electrochemistry",
    description: "The Cui lab focuses on next-generation battery technologies and sustainable energy solutions, with significant contributions to energy research and material science."
  }
];

export default function LabDetail({ params }: { params: { id: string } }) {
  const lab = labs.find((l) => l.id === params.id);

  if (!lab) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-[#f8f9fa] text-[#1a2233]">
        <main className="flex flex-col items-center gap-8 p-8">
          <h1 className="text-2xl font-bold">연구실을 찾을 수 없습니다.</h1>
          <Link href="/database" className="text-[#1a2233] underline">
            연구실 목록으로 돌아가기
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f8f9fa] text-[#1a2233]">
      <main className="flex flex-col items-center gap-8 p-8 w-full max-w-4xl">
        <div className="w-full">
          <Link href="/database" className="text-[#1a2233] underline mb-4 inline-block">
            ← 연구실 목록으로 돌아가기
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow p-8 w-full">
          <h1 className="text-3xl font-bold mb-4">{lab.name}</h1>
          <div className="text-xl text-[#666] mb-6">{lab.school}</div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">주요 연구 키워드</h2>
            <div className="flex flex-wrap gap-2">
              {lab.keywords.split(", ").map((keyword, index) => (
                <span
                  key={index}
                  className="bg-[#f0f2f5] text-[#1a2233] px-3 py-1 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">연구실 소개</h2>
            <p className="text-[#666] leading-relaxed">{lab.description}</p>
          </div>
          
          <button className="bg-[#1a2233] text-white px-6 py-3 rounded-lg hover:bg-[#2a3243] transition">
            지원하기 (준비중)
          </button>
        </div>
      </main>
    </div>
  );
} 