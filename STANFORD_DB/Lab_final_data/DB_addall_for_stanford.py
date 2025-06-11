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
            "id": f"stanford-{major_short}-{len(labs) + 1}",
            "name": name,
            "major": major,  # 전체 학과명으로 저장
            "university": "Stanford",  # 학교 이름 추가
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
    output_path = r'C:\Users\kimji\OneDrive\바탕 화면\ai_project2\Project2\labfinder\src\app\database\labsData.ts'
    try:
        # 기존 파일 읽기
        with open(output_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # labs 배열의 끝을 찾기
        end_marker = '];'
        end_idx = content.rfind(end_marker)
        
        if end_idx == -1:
            print("Error: Could not find the end of labs array")
            return
            
        # 새로운 labs 데이터를 기존 배열에 추가
        # 마지막 객체 뒤에 쉼표 추가하고 새로운 데이터 삽입
        # [1:-1]로 대괄호 제거!
        new_content = content[:end_idx] + ',\n' + json.dumps(all_labs, indent=2, ensure_ascii=False)[1:-1] + content[end_idx:]
        
        # 파일 쓰기
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"\nSuccessfully added {len(all_labs)} labs to {output_path}")
        
    except Exception as e:
        print(f"Error writing to file: {e}")
    
    print(f"Processed {len(all_labs)} labs from {len(txt_files)} files")
    print(f"Output written to: {output_path}")

if __name__ == "__main__":
    main() 