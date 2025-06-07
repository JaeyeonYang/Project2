"use client";

import Link from "next/link";
import { useState } from "react";

interface ExtractionResult {
  success: boolean;
  filename: string;
  extraction_method: string;
  keywords: string[];
  categories: Record<string, string[]>;
  confidence: string;
}

interface RecommendationResult {
  success: boolean;
  keywords: string[];
  total_labs: number;
  recommendations: Lab[];
  top_n: number;
}

interface Lab {
  id: string;
  name: string;
  major: string;
  keywords: string;
  introduction: string;
  similarity_score: number;
  common_keywords: string[];
  match_count: number;
}

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<string>("");
  
  // 키워드 확인/수정 단계
  const [editableKeywords, setEditableKeywords] = useState<string[]>([]);
  const [showKeywordEdit, setShowKeywordEdit] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  
  // 추천 결과
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError("PDF 파일만 업로드 가능합니다.");
        setSelectedFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("파일 크기는 10MB 이하여야 합니다.");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError("");
      setResult(null);
    }
  };

  const handleExtract = async () => {
    if (!selectedFile) {
      setError("파일을 선택해주세요.");
      return;
    }

    setIsExtracting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:8000/extract-keywords', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data: ExtractionResult = await response.json();
      setResult(data);
      setEditableKeywords([...data.keywords]);
      setShowKeywordEdit(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "키워드 추출 중 오류가 발생했습니다.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleKeywordRemove = (index: number) => {
    const updated = editableKeywords.filter((_, i) => i !== index);
    setEditableKeywords(updated);
  };

  const handleKeywordAdd = () => {
    if (newKeyword.trim() && !editableKeywords.includes(newKeyword.trim())) {
      setEditableKeywords([...editableKeywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const handleRecommendLabs = async () => {
    if (editableKeywords.length === 0) {
      setError("키워드를 선택해주세요.");
      return;
    }

    setIsRecommending(true);
    setError("");

    try {
      const response = await fetch('http://localhost:8000/recommend-labs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: editableKeywords,
          top_n: 10
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data: RecommendationResult = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "추천 검색 중 오류가 발생했습니다.");
    } finally {
      setIsRecommending(false);
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'openai': return '🤖 ChatGPT API';
      case 'openai_text': return '🤖 ChatGPT (텍스트)';
      case 'fallback': return '📋 수동 추출';
      default: return method;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f8f9fa] text-[#1a2233] p-4">
      <main className="flex flex-col items-center gap-8 p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold mb-2">CV 키워드 추출</h2>
        <p className="text-center max-w-md mb-4">
          PDF 파일을 업로드하면 ChatGPT API를 사용해서<br />
          자동으로 연구 키워드를 추출합니다.
        </p>

        {/* 파일 업로드 섹션 */}
        <div className="w-full flex flex-col items-center gap-4 max-w-md">
          <input 
            type="file" 
            accept=".pdf"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1a2233] file:text-[#f8f9fa] hover:file:bg-[#223366]" 
          />
          
          {selectedFile && (
            <div className="text-sm text-gray-600">
              선택된 파일: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
            </div>
          )}

          <button 
            onClick={handleExtract}
            disabled={!selectedFile || isExtracting}
            className={`px-6 py-2 rounded-full text-base font-semibold shadow transition-all ${
              !selectedFile || isExtracting 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-[#1a2233] text-[#f8f9fa] hover:bg-[#223366]'
            }`}
          >
            {isExtracting ? "키워드 추출 중..." : "키워드 추출"}
          </button>
        </div>

        {/* 에러 표시 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md w-full">
            {error}
          </div>
        )}

        {/* 키워드 추출 결과 */}
        {result && !showKeywordEdit && (
          <div className="w-full max-w-3xl">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">추출 결과</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getMethodLabel(result.extraction_method)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(result.confidence)}`}>
                    {result.confidence.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">파일: {result.filename}</p>
                <p className="text-sm text-gray-600">추출된 키워드: {result.keywords.length}개</p>
              </div>

              {/* 카테고리별 키워드 */}
              {Object.entries(result.categories).map(([category, keywords]) => (
                keywords.length > 0 && (
                  <div key={category} className="mb-4">
                    <h4 className="font-semibold mb-2 capitalize">
                      {category.replace('_', ' ')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-[#1a2233] text-[#f8f9fa] rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              ))}

              {/* 전체 키워드 */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold mb-2">전체 키워드</h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 키워드 확인/수정 단계 */}
        {showKeywordEdit && !recommendations && (
          <div className="w-full max-w-3xl">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">🔍 키워드 확인 및 수정</h3>
              <p className="text-gray-600 mb-6">
                추출된 키워드를 확인하고 수정하세요. 불필요한 키워드는 제거하고, 필요한 키워드는 추가할 수 있습니다.
              </p>

              {/* 현재 키워드들 */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">선택된 키워드 ({editableKeywords.length}개)</h4>
                <div className="flex flex-wrap gap-2 mb-4 min-h-[50px] p-3 border-2 border-dashed border-gray-300 rounded-lg">
                  {editableKeywords.length === 0 ? (
                    <span className="text-gray-400">키워드를 추가해주세요</span>
                  ) : (
                    editableKeywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="group px-3 py-1 bg-[#1a2233] text-[#f8f9fa] rounded-full text-sm flex items-center gap-2 hover:bg-[#223366] transition-colors"
                      >
                        {keyword}
                        <button
                          onClick={() => handleKeywordRemove(index)}
                          className="text-red-300 hover:text-red-100 ml-1"
                          title="키워드 제거"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* 키워드 추가 */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">키워드 추가</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleKeywordAdd()}
                    placeholder="새 키워드 입력..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a2233] focus:border-transparent"
                  />
                  <button
                    onClick={handleKeywordAdd}
                    disabled={!newKeyword.trim()}
                    className="px-4 py-2 bg-[#1a2233] text-white rounded-md hover:bg-[#223366] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    추가
                  </button>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  onClick={() => setShowKeywordEdit(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← 이전 단계
                </button>
                <button
                  onClick={handleRecommendLabs}
                  disabled={editableKeywords.length === 0 || isRecommending}
                  className={`px-6 py-2 rounded-md font-semibold transition-all ${
                    editableKeywords.length === 0 || isRecommending
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-[#1a2233] text-white hover:bg-[#223366]'
                  }`}
                >
                  {isRecommending ? "검색 중..." : "연구실 추천받기 🚀"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 추천 결과 */}
        {recommendations && (
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">🎯 추천 연구실</h3>
                <div className="text-sm text-gray-600">
                  총 {recommendations.total_labs}개 연구실 중 상위 {recommendations.recommendations.length}개
                </div>
              </div>

              {/* 검색 키워드 */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">검색 키워드</h4>
                <div className="flex flex-wrap gap-2">
                  {recommendations.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-[#1a2233] text-white rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* 추천 연구실 목록 */}
              <div className="space-y-4">
                {recommendations.recommendations.map((lab, index) => (
                  <div key={lab.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-[#1a2233]">
                          #{index + 1} {lab.name}
                        </h4>
                        <p className="text-gray-600">{lab.major}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-[#223366]">
                          유사도: {(lab.similarity_score * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          공통 키워드: {lab.match_count}개
                        </div>
                      </div>
                    </div>

                    {/* 공통 키워드 */}
                    {lab.common_keywords.length > 0 && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-700">공통 키워드: </span>
                        <div className="inline-flex flex-wrap gap-1 ml-2">
                          {lab.common_keywords.map((keyword, kIndex) => (
                            <span 
                              key={kIndex}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 연구실 키워드 */}
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">연구 분야: </span>
                      <span className="text-sm text-gray-600">{lab.keywords}</span>
                    </div>

                    {/* 소개 */}
                    <p className="text-sm text-gray-700 line-clamp-2">{lab.introduction}</p>
                  </div>
                ))}
              </div>

              {/* 액션 버튼들 */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setRecommendations(null);
                    setShowKeywordEdit(true);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← 키워드 수정
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setResult(null);
                    setShowKeywordEdit(false);
                    setRecommendations(null);
                    setEditableKeywords([]);
                    setError("");
                  }}
                  className="px-6 py-2 bg-[#1a2233] text-white rounded-md hover:bg-[#223366] transition-colors"
                >
                  새 CV 업로드
                </button>
              </div>
            </div>
          </div>
        )}

        <Link href="/recommend">
          <button className="mt-8 underline text-[#1a2233] hover:text-[#223366]">
            추천 결과로 이동 →
          </button>
        </Link>
      </main>
    </div>
  );
} 