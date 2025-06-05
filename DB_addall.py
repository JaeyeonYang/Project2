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
    "aeronautics and astronautics": "Aeronautics and Astronautics"
    "ap" : "Applied Physics"
    "be" : "Biomedical Engineering"
    "ece" : "Eelctrical & Computer Engineering"
    "ms" : "Materials Science"
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
    
    print(f"Processing {file_path}")  # 디버깅용
    print(f"Found {len(lab_entries)} lab entries")  # 디버깅용
    
    for entry in lab_entries:
        lines = entry.strip().split('\n')
        if not lines:
            continue
            
        # Get professor name
        name = lines[0].strip()
        
        # Find Analysis and Introduction sections
        analysis = ""
        introduction = ""
        current_section = None
        
        for line in lines[1:]:
            line = line.strip()
            if line == "Analysis:":
                current_section = "analysis"
                continue
            elif line == "Introduction:":
                current_section = "introduction"
                continue
            elif not line:
                continue
                
            if current_section == "analysis":
                analysis += line + ", "
            elif current_section == "introduction":
                introduction += line + " "
        
        # Clean up the strings
        analysis = analysis.strip(", ")
        introduction = introduction.strip()
        
        # Create lab entry
        lab = {
            "id": f"{major_short}-{len(labs) + 1}",
            "name": name,
            "major": major,  # 전체 학과명으로 저장
            "keywords": analysis,
            "introduction": introduction
        }
        
        labs.append(lab)
    
    return labs

def main():
    # Directory containing the txt files
    data_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Get all txt files
    txt_files = [f for f in os.listdir(data_dir) if f.endswith('.txt')]
    print(f"Found {len(txt_files)} txt files: {txt_files}")  # 디버깅용
    
    all_labs = []
    
    # Process each file
    for txt_file in txt_files:
        file_path = os.path.join(data_dir, txt_file)
        labs = parse_lab_file(file_path)
        print(f"{txt_file}: {len(labs)} labs parsed, major: {labs[0]['major'] if labs else 'N/A'}")
        all_labs.extend(labs)
    
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

const labs: Lab[] = """ + json.dumps(all_labs, indent=2) + """;

export default function Database() {
  const [selectedMajor, setSelectedMajor] = useState<string>("All");
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get unique majors
  const majors = ["All", ...new Set(labs.map(lab => lab.major))];

  // Filter labs by selected major
  const filteredLabs = selectedMajor === "All" 
    ? labs 
    : labs.filter(lab => lab.major === selectedMajor);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lab Database</h1>
      
      {/* Major Filter */}
      <div className="mb-6">
        <label htmlFor="major-filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Major
        </label>
        <select
          id="major-filter"
          value={selectedMajor}
          onChange={(e) => setSelectedMajor(e.target.value)}
          className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {majors.map((major) => (
            <option key={major} value={major}>
              {major}
            </option>
          ))}
        </select>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLabs.map((lab) => (
          <div 
            key={lab.id} 
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedLab(lab);
              setIsModalOpen(true);
            }}
          >
            <h2 className="text-xl font-semibold mb-2">{lab.name}</h2>
            <p className="text-gray-600 mb-2">{lab.major}</p>
            <div className="flex flex-wrap gap-2">
              {lab.keywords.split(", ").map((keyword, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedLab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
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
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded"
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
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f"Processed {len(all_labs)} labs from {len(txt_files)} files")
    print(f"Output written to: {output_path}")

if __name__ == "__main__":
    main() 
