"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/extract-keywords", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed");
      }

      const data = await response.json();
      setExtractedKeywords(data.keywords);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRecommend = () => {
    if (extractedKeywords.length > 0) {
      // 키워드를 세션 스토리지에 저장
      sessionStorage.setItem("cvKeywords", JSON.stringify(extractedKeywords));
      router.push("/recommend");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upload Your CV</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select your CV file (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading || !file}
            className={`w-full py-2 px-4 rounded font-bold ${
              isUploading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {extractedKeywords.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Extracted Keywords:</h2>
              <div className="flex flex-wrap gap-2">
                {extractedKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <button
                onClick={handleRecommend}
                className="mt-4 w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded font-bold"
              >
                View Recommended Labs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 