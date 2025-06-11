'use client';

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiExternalLink, FiLoader } from "react-icons/fi";
import { slugify } from "@/app/utils/slugify";
import { useRouter } from "next/navigation";

// Lab 타입 정의
type Lab = {
  id: string;
  name: string;
  major: string;
  university: string;
  keywords: string;
  introduction: string;
};

export default function Database() {
  const [allLabs, setAllLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedLab, setExpandedLab] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("All");
  const [selectedMajor, setSelectedMajor] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await fetch("http://localhost:8000/all-labs");
        if (!response.ok) {
          throw new Error("Failed to fetch lab data");
        }
        const data = await response.json();
        if (data.success) {
          setAllLabs(data.labs);
        } else {
          throw new Error("API did not return a successful response.");
        }
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLabs();
  }, []);

  // 중복 없는 대학교 목록 만들기
  const universities = useMemo(() => 
    ["All", ...Array.from(new Set(allLabs.map(lab => lab.university)))],
    [allLabs]
  );
  
  // 선택된 대학에 따른 학과 목록 필터링
  const majors = useMemo(() => {
    if (selectedUniversity === "All") {
      return ["All", ...Array.from(new Set(allLabs.map(lab => lab.major)))];
    }
    return ["All", ...Array.from(new Set(
      allLabs
        .filter(lab => lab.university === selectedUniversity)
        .map(lab => lab.major)
    ))];
  }, [selectedUniversity, allLabs]);

  // 대학이 변경될 때 학과 필터 초기화
  const handleUniversityChange = (university: string) => {
    setSelectedUniversity(university);
    setSelectedMajor("All");
  };

  // 검색어, 대학교, 학과별 필터링된 랩 목록
  const filteredLabs = useMemo(() => {
    if (isLoading) return [];
    return allLabs.filter(lab => {
      const universityMatch = selectedUniversity === "All" || lab.university === selectedUniversity;
      const majorMatch = selectedMajor === "All" || lab.major === selectedMajor;
      const searchMatch = searchQuery === "" || 
        lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.keywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.introduction.toLowerCase().includes(searchQuery.toLowerCase());
      
      return universityMatch && majorMatch && searchMatch;
    });
  }, [selectedUniversity, selectedMajor, searchQuery, allLabs, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-800">Loading Lab Database...</h1>
          <p className="text-gray-500 mt-2">Please make sure the Python API server is running.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Failed to Load Data</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-500">
            Please ensure the backend server is running at <code className="bg-gray-200 p-1 rounded">http://localhost:8000</code> and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
            Research Labs Database
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Explore research opportunities from top universities worldwide
          </p>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            {/* Search Bar */}
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search labs by name, keywords, or research areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <FiFilter className="mr-2" />
              Filters
              {showFilters ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
            </button>

            {/* Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label htmlFor="university-filter" className="block text-sm font-medium text-gray-700 mb-2">
                        University
                      </label>
                      <select
                        id="university-filter"
                        value={selectedUniversity}
                        onChange={(e) => handleUniversityChange(e.target.value)}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {universities.map((university) => (
                          <option key={university} value={university}>
                            {university}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="major-filter" className="block text-sm font-medium text-gray-700 mb-2">
                        Major
                      </label>
                      <select
                        id="major-filter"
                        value={selectedMajor}
                        onChange={(e) => setSelectedMajor(e.target.value)}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        disabled={selectedUniversity === "All"}
                      >
                        {majors.map((major) => (
                          <option key={major} value={major}>
                            {major}
                          </option>
                        ))}
                      </select>
                      {selectedUniversity === "All" && (
                        <p className="mt-1 text-sm text-gray-500">
                          Select a university to filter by major
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredLabs.length} research labs
            </p>
          </div>

          {/* Labs Grid */}
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {filteredLabs.map((lab) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  {/* Lab Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedLab(expandedLab === lab.id ? null : lab.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{lab.name}</h2>
                        <div className="flex items-center text-gray-600 mb-3">
                          <span className="font-medium">{lab.university}</span>
                          <span className="mx-2">•</span>
                          <span>{lab.major}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {lab.keywords.split(", ").slice(0, 3).map((keyword, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                          {lab.keywords.split(", ").length > 3 && (
                            <span className="text-gray-500 text-sm">
                              +{lab.keywords.split(", ").length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-400">
                        {expandedLab === lab.id ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                      </div>
                    </div>
                  </div>

                  {/* Lab Details */}
                  <AnimatePresence>
                    {expandedLab === lab.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-6">
                          <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-500 mb-3">Research Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                              {lab.keywords.split(", ").map((keyword, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-500 mb-3">Introduction</h3>
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                              {lab.introduction}
                            </p>
                          </div>
                          <Link
                            href={`/lab/${slugify(lab.name)}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            View Full Details
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* No Results Message */}
          {filteredLabs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 text-lg">
                No research labs found matching your criteria.
              </p>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filters.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}