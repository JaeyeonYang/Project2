'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
  const slug = params?.slug as string;
  const router = useRouter();
  const [lab, setLab] = useState<Lab | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const fetchLabDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`http://localhost:8000/lab-by-slug/${slug}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Lab not found");
          }
          const data = await response.json();
          if (data.success) {
            setLab(data.lab);
          } else {
            throw new Error("Failed to load lab details");
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLabDetails();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading lab details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-gray-600">Could not load lab details: {error}</p>
        <button
          onClick={() => router.back()}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Lab not found</h1>
        <p className="text-gray-600">The requested lab with slug "{slug}" could not be found.</p>
        <button
          onClick={() => router.push("/upload")}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload a new CV
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
