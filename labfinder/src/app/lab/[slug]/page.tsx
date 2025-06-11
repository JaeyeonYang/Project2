'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiLoader } from 'react-icons/fi';
import Link from 'next/link';

interface Lab {
  id: string;
  name: string;
  university: string;
  major: string;
  keywords: string;
  introduction: string;
}

export default function LabDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [lab, setLab] = useState<Lab | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchLabData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/lab-by-slug/${slug}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Error: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success && data.lab) {
          setLab(data.lab);
        } else {
          throw new Error('Lab not found in API response.');
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Failed to fetch lab data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-800">Loading Lab Details...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Failed to Load Lab</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-500 text-sm mb-8">Slug: {slug}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  if (!lab) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Lab Not Found</h1>
            <p className="text-gray-600 mb-4">The requested lab could not be found.</p>
            <p className="text-gray-500 text-sm mb-8">Slug: {slug}</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Go Back
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <FiArrowLeft className="mr-2" />
            Back to previous page
          </button>

          {/* Lab Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{lab.name}</h1>
            <div className="flex items-center text-gray-600 mb-6">
              <span className="font-medium">{lab.university}</span>
              <span className="mx-2">•</span>
              <span>{lab.major}</span>
            </div>
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

          {/* Lab Details */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Research Overview</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {lab.introduction}
              </p>
            </div>

            {/* Additional Information */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">University</p>
                  <p className="text-gray-900">{lab.university}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Department</p>
                  <p className="text-gray-900">{lab.major}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`https://www.google.com/search?q=${encodeURIComponent(lab.name + ' ' + lab.university)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiExternalLink className="mr-2" />
                Search on Google
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
