import os
import json

# Major name mapping dictionary
MAJOR_NAMES = {
    "cheme": "Chemical Engineering",
    "cee": "Civil and Environmental Engineering",
    "icme": "Institute for Computational & Mathematical Engineering",
    "cs": "Computer Science",
    "ee": "Electrical Engineering",
    "msande": "Management Science and Engineering",
    "mse": "Materials Science and Engineering",
    "me": "Mechanical Engineering",
    "bioengineering": "Bioengineering",
    "aa": "Aeronautics and Astronautics"
}

def parse_lab_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split content by "Professor:" to get individual lab entries
    lab_entries = content.split("Professor:")[1:]  # Skip the first empty split
    
    labs = []
    # 파일명에서 확장자 제거 후 소문자로 변환
    major_short = os.path.basename(file_path).replace('.txt', '').lower()
    # 전체 학과명으로 매핑
    major = MAJOR_NAMES.get(major_short, major_short.title())  # 매핑이 없으면 첫 글자만 대문자로
    
    print(f"\nProcessing {file_path}")  # 디버깅용
    print(f"Found {len(lab_entries)} lab entries")  # 디버깅용
    
    for entry in lab_entries:
        # Split into sections by "Analysis:" and "Introduction:"
        parts = entry.split("Analysis:")
        if len(parts) < 2:
            continue
            
        # Get professor name (first line)
        name = parts[0].strip()
        
        # Split the rest into Keywords and Introduction
        rest = parts[1].split("Introduction:")
        if len(rest) < 2:
            continue
            
        # Get keywords (remove "Keywords:" prefix)
        keywords = rest[0].replace("Keywords:", "").strip()
        
        # Get introduction
        introduction = rest[1].strip()
        
        # Debug print for first lab
        if len(labs) == 0:
            print(f"\nFirst lab in {file_path}:")
            print(f"Name: {name}")
            print(f"Keywords: {keywords}")
            print(f"Introduction length: {len(introduction)}")
        
        # Create lab entry
        lab = {
            "id": f"{major_short}-{len(labs) + 1}",
            "name": name,
            "major": major,  # 전체 학과명으로 저장
            "university": "Stanford University",  # 학교 이름 추가
            "keywords": keywords,
            "introduction": introduction
        }
        
        labs.append(lab)
    
    return labs

def main():
    # Directory containing the txt files
    data_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Get all txt files
    txt_files = [f for f in os.listdir(data_dir) if f.endswith('.txt')]
    print(f"Found {len(txt_files)} txt files: {txt_files}")
    
    all_labs = []
    
    # Process each file
    for txt_file in txt_files:
        file_path = os.path.join(data_dir, txt_file)
        labs = parse_lab_file(file_path)
        print(f"{txt_file}: {len(labs)} labs parsed, major: {labs[0]['major'] if labs else 'N/A'}")
        all_labs.extend(labs)
    
    print(f"\nTotal labs found: {len(all_labs)}")
    if all_labs:
        print(f"First lab: {all_labs[0]}")
        print(f"Last lab: {all_labs[-1]}")
    
    # Convert to JSON and verify
    try:
        json_data = json.dumps(all_labs, indent=2)
        print(f"\nJSON data length: {len(json_data)}")
        print("First 100 characters of JSON data:")
        print(json_data[:100])
    except Exception as e:
        print(f"Error converting to JSON: {e}")
        return
    
    # Generate TypeScript file content
    ts_content = """'use client';

import Link from "next/link";
import { useState } from "react";

interface Lab {
  id: string;
  name: string;
  major: string;
  keywords: string;
  introduction: string;
}

const labs: Lab[] = """ + json_data + """;

export default function Database() {
  const [selectedMajor, setSelectedMajor] = useState<string>("All");
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique majors
  const majors = ["All", ...new Set(labs.map(lab => lab.major))];

  // Filter labs by selected major and search query
  const filteredLabs = labs.filter(lab => {
    const matchesMajor = selectedMajor === "All" || lab.major === selectedMajor;
    const matchesSearch = searchQuery === "" || 
      lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.keywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.introduction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMajor && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Stanford Research Labs Database</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore cutting-edge research laboratories across Stanford University's engineering departments. 
              Find labs that match your research interests and academic goals.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Bar */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Labs
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by lab name, keywords, or research areas..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Department Filter */}
              <div>
                <label htmlFor="major-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Department
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
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredLabs.length} of {labs.length} research labs
            </p>
          </div>
        </div>
      </div>

      {/* Labs List */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {filteredLabs.map((lab) => (
            <div 
              key={lab.id} 
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
              onClick={() => {
                setSelectedLab(lab);
                setIsModalOpen(true);
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{lab.name}</h2>
                  <p className="text-gray-600 mb-4">{lab.major}</p>
                </div>
                <div className="text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {lab.keywords.split(", ").map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="text-gray-700 line-clamp-3">
                {lab.introduction}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedLab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedLab.name}</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-4">{selectedLab.major}</p>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Research Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLab.keywords.split(", ").map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Introduction</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedLab.introduction}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}"""
    
    # Write to the TypeScript file
    output_path = '/Users/jaeyeonyang/Dropbox/학교/강의/EF/AI programming/Project2/labfinder/src/app/database/page.tsx'
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(ts_content)
        print(f"\nSuccessfully wrote {len(ts_content)} bytes to {output_path}")
        
        # Verify the file was written correctly
        with open(output_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if "const labs: Lab[] = []" in content:
                print("WARNING: File was written but labs array is empty!")
            else:
                print("File was written successfully with lab data")
                print("First 100 characters of written file:")
                print(content[:100])
    except Exception as e:
        print(f"Error writing to file: {e}")
    
    print(f"Processed {len(all_labs)} labs from {len(txt_files)} files")
    print(f"Output written to: {output_path}")

if __name__ == "__main__":
    main() 