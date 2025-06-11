'use client';

import React from "react";
import { labs } from "../../database/labsData";
import { slugify } from "@/app/utils/slugify";
import { useParams, useRouter } from "next/navigation";

export default function LabDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  // 디버깅용 로그
  console.log("Current slug:", slug);
  console.log("Available slugs:", labs.map(l => slugify(l.name)));

  // slug 기반으로 해당 연구실 찾기
  const lab = labs.find(l => slugify(l.name) === slug);

  // 없는 slug면 404 혹은 리다이렉트
  if (!lab) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Lab not found</h1>
        <p className="text-gray-600">Requested slug: {slug}</p>
        <p className="text-gray-600">
          Try one of:{" "}
          {labs
            .map(l => slugify(l.name))
            .slice(0, 10)
            .join(", ")}
          … and more.
        </p>
        <button
          onClick={() => router.push("/recommend")}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go back to recommendations
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
