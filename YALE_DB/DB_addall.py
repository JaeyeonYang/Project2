import os
import json
import logging

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

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
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Split content by "Professor:" to get individual lab entries
        lab_entries = content.split("Professor:")[1:]  # Skip the first empty split
        
        labs = []
        # 파일명에서 확장자 제거 후 소문자로 변환
        major_short = os.path.basename(file_path).replace('.txt', '').lower()
        # 전체 학과명으로 매핑
        major = MAJOR_NAMES.get(major_short, major_short.title())
        
        logging.info(f"Processing {file_path}")
        logging.info(f"Found {len(lab_entries)} lab entries")
        
        for entry in lab_entries:
            try:
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
                
            except Exception as e:
                logging.error(f"Error processing lab entry: {str(e)}")
                continue
        
        return labs
        
    except Exception as e:
        logging.error(f"Error reading file {file_path}: {str(e)}")
        return []

def main():
    try:
        # Directory containing the txt files
        data_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Get all txt files
        txt_files = [f for f in os.listdir(data_dir) if f.endswith('.txt')]
        logging.info(f"Found {len(txt_files)} txt files: {txt_files}")
        
        all_labs = []
        
        # Process each file
        for txt_file in txt_files:
            file_path = os.path.join(data_dir, txt_file)
            labs = parse_lab_file(file_path)
            if labs:
                logging.info(f"{txt_file}: {len(labs)} labs parsed, major: {labs[0]['major']}")
                all_labs.extend(labs)
        
        if not all_labs:
            logging.error("No labs were processed successfully")
            return
        
        logging.info(f"New labs found: {len(all_labs)}")
        
        # Write to the TypeScript file (APPENDING LOGIC)
        output_path = r"C:\Users\kimji\OneDrive\바탕 화면\ai_project2\Project2\labfinder\src\app\database\labsData.ts"
        try:
            # 기존 파일 읽기
            with open(output_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # 줄바꿈 문자 통일 (CRLF -> LF)
            content = content.replace('\r\n', '\n')
            
            # labs 배열의 끝을 찾기
            end_marker = '];\n\nexport default labs;'
            end_idx = content.rfind(end_marker)
            
            if end_idx == -1:
                logging.error("Error: Could not find the end marker in the file")
                return

            # 새로운 labs 데이터를 JSON 문자열로 변환
            new_labs_json = json.dumps(all_labs, indent=2, ensure_ascii=False)
            
            # 기존 데이터가 있는지 확인
            if content[end_idx - 1].strip() == '[':
                # 배열이 비어있으면 쉼표 없이 추가
                final_content = content[:end_idx] + new_labs_json[1:-1] + content[end_idx:]
            else:
                # 기존 데이터가 있으면 쉼표와 줄바꿈 추가
                final_content = content[:end_idx] + ',\n' + new_labs_json[1:-1] + content[end_idx:]

            # 파일 쓰기
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(final_content)

            logging.info(f"\nSuccessfully added {len(all_labs)} Yale labs to {output_path}")

        except Exception as e:
            logging.error(f"Error writing to file: {e}")

    except Exception as e:
        logging.error(f"Error in main process: {str(e)}")

if __name__ == "__main__":
    main() 