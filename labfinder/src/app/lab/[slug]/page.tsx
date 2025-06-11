'use client';

import { useParams } from 'next/navigation';
import { labs } from '../database/labsData';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';

export default function LabDetail() {
  const params = useParams();
  const slug = params.slug as string;
  
  // 랩 찾기 - 더 유연한 매칭
  const lab = labs.find(l => {
    // 1. 정확한 ID 매칭
    if (l.id === slug) return true;
    
    // 2. 대학-전공-번호 형식 매칭
    const slugParts = slug.split('-');
    const labIdParts = l.id.split('-');
    
    // 대학 이름이 일치하는지 확인
    if (slugParts[0] !== labIdParts[0]) return false;
    
    // 전공과 번호가 일치하는지 확인
    if (slugParts.length >= 2 && labIdParts.length >= 2) {
      const slugMajor = slugParts[1];
      const labMajor = labIdParts[1];
      
      // 전공 이름이 부분적으로 일치하는지 확인
      if (labMajor.includes(slugMajor) || slugMajor.includes(labMajor)) {
        return true;
      }
    }
    
    return false;
  });

  if (!lab) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Lab Not Found</h1>
            <p className="text-gray-600 mb-4">The requested lab could not be found.</p>
            <p className="text-gray-500 text-sm mb-8">Lab ID: {slug}</p>
            <Link
              href="/database"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Database
            </Link>
          </div>
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
          <Link
            href="/database"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <FiArrowLeft className="mr-2" />
            Back to Database
          </Link>

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
              <Link
                href="/database"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Database
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
