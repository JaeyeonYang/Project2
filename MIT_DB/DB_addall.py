import os
import json

# Major name mapping dictionary
MAJOR_NAMES = {
    "be": "Biological Engineering",
    "cheme": "Chemical Engineering",
    "cee": "Civil and Environmental Engineering",
    "dmse": "Department of Materials Science and Engineering",
    "imes": "Institute for Medical Engineering and Science",
    "meche": "Mechanical Engineering",
    "nse": "Nuclear Science and Engineering"
}

def parse_lab_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split content by "Professor:" to get individual lab entries
    lab_entries = content.split("Professor:")[1:]  # Skip the first empty split
    
    labs = []
    # 파일명에서 확장자 제거 후 소문자로 변환
    major_short = os.path.basename(file_path).replace('_analysis.txt', '').lower()
    # 전체 학과명으로 매핑
    major = MAJOR_NAMES.get(major_short, major_short.title())  # 매핑이 없으면 첫 글자만 대문자로
    
    print(f"\nProcessing {file_path}")  # 디버깅용
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
            "id": f"mit-{major_short}-{len(labs) + 1}",
            "name": name,
            "major": major,
            "university": "Massachusetts Institute of Technology",
            "keywords": analysis,
            "introduction": introduction
        }
        
        labs.append(lab)
    
    return labs

def main():
    # Directory containing the txt files
    data_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Get all analysis txt files
    txt_files = [f for f in os.listdir(data_dir) if f.endswith('_analysis.txt')]
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
    
    # Save as JSON file
    output_path = os.path.join(data_dir, 'mit_labs.json')
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(all_labs, f, indent=2, ensure_ascii=False)
        print(f"\nSuccessfully wrote to {output_path}")
        print(f"Total labs: {len(all_labs)}")
    except Exception as e:
        print(f"Error writing to file: {e}")
    
    print(f"Processed {len(all_labs)} labs from {len(txt_files)} files")
    print(f"Output written to: {output_path}")

if __name__ == "__main__":
    main() 