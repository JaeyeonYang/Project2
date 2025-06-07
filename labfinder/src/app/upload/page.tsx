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

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<string>("");

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "키워드 추출 중 오류가 발생했습니다.");
    } finally {
      setIsExtracting(false);
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

        {/* 결과 표시 */}
        {result && (
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

        <Link href="/recommend">
          <button className="mt-8 underline text-[#1a2233] hover:text-[#223366]">
            추천 결과로 이동 →
          </button>
        </Link>
      </main>
    </div>
  );
} 