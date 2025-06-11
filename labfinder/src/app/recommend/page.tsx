"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { labs } from "@/app/database/labsData";
import { LabMatcher } from "@/app/utils/lab_matcher";
import { useRouter } from "next/navigation";

interface Lab {
  id: string;
  name: string;
  university: string;
  major: string;
  keywords: string;
  introduction: string;
  similarity_score: number;
  match_count: number;
  matching_keywords: string[];
}

export default function Recommend() {
  const [recommendedLabs, setRecommendedLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 세션 스토리지에서 키워드 가져오기
    const storedKeywords = sessionStorage.getItem("cvKeywords");
    
    if (!storedKeywords) {
      // 키워드가 없으면 업로드 페이지로 리다이렉트
      router.push("/upload");
      return;
    }

    try {
      const cvKeywords = JSON.parse(storedKeywords);
      const matcher = new LabMatcher();
      const recommendations = matcher.get_top_recommendations(cvKeywords);
      setRecommendedLabs(recommendations);
    } catch (error) {
      console.error("Error getting recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recommended Labs</h1>
      
      {recommendedLabs.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No labs found matching your criteria.</p>
          <p className="mt-2">Try adjusting your keywords or search criteria.</p>
          <button
            onClick={() => router.push("/upload")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload New CV
          </button>
        </div>
      ) : (
        <div className="w-full space-y-4">
          {recommendedLabs.map((lab: Lab) => (
            <div key={lab.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">{lab.name}</h2>
                    <span className="text-sm text-gray-500">
                      (Score: {(lab.similarity_score * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <p className="text-gray-600">{lab.university} - {lab.major}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {lab.keywords.split(", ").slice(0, 3).map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  {lab.matching_keywords && lab.matching_keywords.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Matching keywords:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lab.matching_keywords.map((keyword: string, index: number) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <Link href={`/lab/${lab.id}`} className="inline-block">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 