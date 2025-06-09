import os
import json

# Major name mapping dictionary
MAJOR_NAMES = {
    "ms": "Materials Science",
    "me": "Mechanical Engineering", 
    "ece": "Electrical and Computer Engineering",
    "cs": "Computer Science",
    "be": "Bioengineering",
    "cee": "Civil and Environmental Engineering",
    "ap": "Applied Physics"
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
            "id": f"yale-{major_short}-{len(labs) + 1}",
            "name": name,
            "major": major,
            "university": "Yale University",
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
    
    # Write to the TypeScript file
    output_path = r'C:\Users\chany\coding\Project2\labfinder\src\app\database\page_copy.tsx'
    try:
        # 기존 파일 읽기
        existing_labs = []
        try:
            with open(output_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # 기존 labs 배열 추출
                start_marker = 'const labs: Lab[] = '
                end_marker = '];'
                start_idx = content.find(start_marker)
                if start_idx != -1:
                    start_idx += len(start_marker)
                    end_idx = content.find(end_marker, start_idx)
                    if end_idx != -1:
                        existing_json = content[start_idx:end_idx]
                        existing_labs = json.loads(existing_json)
        except Exception as e:
            print(f"기존 파일 읽기 실패 (새로 생성): {e}")
            existing_labs = []

        # 새로운 labs와 기존 labs 합치기
        all_labs = existing_labs + all_labs
        
        # 중복 제거 (id 기준)
        seen_ids = set()
        unique_labs = []
        for lab in all_labs:
            if lab['id'] not in seen_ids:
                seen_ids.add(lab['id'])
                unique_labs.append(lab)
        
        # TypeScript 파일 내용 생성
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

const labs: Lab[] = """ + json.dumps(unique_labs, indent=2, ensure_ascii=False) + """;

export default function Database() {
  const [expandedLab, setExpandedLab] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Research Labs Database</h1>
      <div className="space-y-4">
        {labs.map((lab) => (
          <div key={lab.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Lab Header - Always Visible */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
              onClick={() => setExpandedLab(expandedLab === lab.id ? null : lab.id)}
            >
              <div>
                <h2 className="text-xl font-semibold">{lab.name}</h2>
                <p className="text-gray-600">{lab.major}</p>
              </div>
              <div className="text-gray-500">
                {expandedLab === lab.id ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>

            {/* Lab Details - Visible when expanded */}
            {expandedLab === lab.id && (
              <div className="p-4 border-t border-gray-100">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Research Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {lab.keywords.split(", ").map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Introduction</h3>
                  <p className="text-gray-700 whitespace-pre-line">{lab.introduction}</p>
                </div>
                <Link href={`/lab/${lab.id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    View Full Details
                  </button>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}"""
        
        # 파일 쓰기
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(ts_content)
        
        print(f"\nSuccessfully wrote {len(ts_content)} bytes to {output_path}")
        print(f"Total labs after merge: {len(unique_labs)}")
        print(f"New labs added: {len(all_labs) - len(existing_labs)}")
        
    except Exception as e:
        print(f"Error writing to file: {e}")
    
    print(f"Processed {len(all_labs)} labs from {len(txt_files)} files")
    print(f"Output written to: {output_path}")

if __name__ == "__main__":
    main() 