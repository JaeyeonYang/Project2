'use client';

import Link from "next/link";
import { useState } from "react";
import { labs, Lab } from "./labsData"; // 데이터 import

export default function Database() {
  const [expandedLab, setExpandedLab] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("All");
  const [selectedMajor, setSelectedMajor] = useState<string>("All");

  // 중복 없는 대학교와 학과 목록 만들기
  const universities = ["All", ...Array.from(new Set(labs.map(lab => lab.university)))];
  const majors = ["All", ...Array.from(new Set(labs.map(lab => lab.major)))];

  // 대학교와 학과별 필터링된 랩 목록
  const filteredLabs = labs.filter(lab => {
    const universityMatch = selectedUniversity === "All" || lab.university === selectedUniversity;
    const majorMatch = selectedMajor === "All" || lab.major === selectedMajor;
    return universityMatch && majorMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Research Labs Database</h1>

      {/* 필터 섹션 */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 대학교 필터 */}
        <div>
          <label htmlFor="university-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by University
          </label>
          <select
            id="university-filter"
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {universities.map((university) => (
              <option key={university} value={university}>
                {university}
              </option>
            ))}
          </select>
        </div>

        {/* 학과 필터 */}
        <div>
          <label htmlFor="major-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Major
          </label>
          <select
            id="major-filter"
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {majors.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredLabs.map((lab) => (
          <div key={lab.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Lab Header - Always Visible */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
              onClick={() => setExpandedLab(expandedLab === lab.id ? null : lab.id)}
            >
              <div>
                <h2 className="text-xl font-semibold">{lab.name}</h2>
                <p className="text-gray-600">{lab.major}</p>
                <p className="text-gray-600">{lab.university}</p>
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
              <div className="text-gray-500">
                {expandedLab === lab.id ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>

            {/* Lab Details - Visible when expanded */}
            {expandedLab === lab.id && (
              <div className="p-4 border-t border-gray-100">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Research Keywords</h3>
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
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Introduction</h3>
                  <p className="text-gray-700 whitespace-pre-line">{lab.introduction}</p>
                </div>
                <Link href={`/lab/${lab.id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    View Full Details
                  </button>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}