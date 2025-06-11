'use client';
import { labs } from "../../database/labsData";
import { slugify } from "@/app/utils/slugify";
import { useParams } from "next/navigation";

export default function LabDetailPage() {
  const { slug } = useParams();
  const lab = labs.find(l => slugify(l.name) === slug);

  
  console.log('Current labId:', labId);
  console.log('Available labs:', labs.map(l => l.id));
  
  // 현재 lab 찾기
  const lab = labs.find(l => l.id === labId);

  if (!lab) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Lab not found</h1>
        <p className="text-gray-600">Lab ID: {labId}</p>
        <p className="text-gray-600">Available IDs: {labs.map(l => l.id).join(', ')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{lab.name}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
          <p className="text-gray-600">{lab.major}</p>
          <p className="text-gray-600">{lab.university}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Research Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {lab.keywords.split(", ").map((keyword, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Introduction</h2>
          <p className="text-gray-700 whitespace-pre-line">{lab.introduction}</p>
        </div>
      </div>
    </div>
  );
} 