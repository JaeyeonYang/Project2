'use client';

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { labs } from "@/app/database/labsData";

interface Lab {
  id: string;
  name: string;
  university: string;
  major: string;
  keywords: string;
  introduction: string;
}

export default function LabDetailPage() {
  const params = useParams();
  const labId = params?.slug as string;
  const router = useRouter();

  // labsData에서 해당 ID의 연구실 찾기
  const lab = labs.find(l => l.id === labId);

  if (!lab) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Lab not found</h1>
        <p className="text-gray-600">The requested lab could not be found.</p>
        <button
          onClick={() => router.push("/database")}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Database
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{lab.name}</h1>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Basic Information */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
          <p className="text-gray-700">{lab.university}</p>
          <p className="text-gray-700">{lab.major}</p>
        </section>

        {/* Research Keywords */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Research Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {lab.keywords.split(", ").map((kw, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {kw}
              </span>
            ))}
          </div>
        </section>

        {/* Introduction */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Introduction</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {lab.introduction}
          </p>
        </section>
      </div>
    </div>
  );
}
