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
    "Biology_and_biological_engineering": "Biology and biological engineering",
    "Chemistry_and_Chemical_engineering": "Chemistry and Chemical engineering",
    "Engineering_and_applied_science": "Engineering and applied science"
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
        # 언더바를 공백으로 변환
        major = major.replace('_', ' ')
        
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
                    "id": f"caltech-{major_short}-{len(labs) + 1}",  # ID에 caltech 접두어 추가
                    "name": name,
                    "major": major,
                    "university": "Caltech",
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
        
        # Write to the TypeScript file (APPENDING LOGIC - similar to final Yale script)
        output_path = r"C:\Users\kimji\OneDrive\바탕 화면\ai_project2\Project2\labfinder\src\app\database\labsData.ts"
        try:
            # 기존 파일 읽기
            with open(output_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # 줄바꿈 문자 통일 (CRLF -> LF)
            content = content.replace('\r\n', '\n')
            
            # labs 배열의 끝을 찾기 (`];` 패턴)
            # 이 `];`는 파일의 가장 마지막에 있는 `];`여야 합니다.
            # `export default labs;` 바로 앞에 있는 `];`
            end_array_marker_pos = content.rfind('];')

            if end_array_marker_pos == -1:
                logging.error("Error: Could not find the end of labs array ('];') in existing file.")
                return

            # `];`까지의 내용을 prefix로 가져오고, 그 이후를 suffix로 가져옵니다.
            prefix = content[:end_array_marker_pos]
            suffix = content[end_array_marker_pos:] # This will be '];\n\nexport default labs;'

            # 새로운 labs 데이터를 JSON 문자열로 변환하고 대괄호 제거
            new_labs_json_part = json.dumps(all_labs, indent=2, ensure_ascii=False)[1:-1]

            # prefix의 마지막 문자(공백 제거 후)가 '['인지 확인하여 배열이 비어있는지 판단
            # 예를 들어, 'export const labs: Lab[] = [' 에서 '['가 마지막
            # 또는 '  {\n    ...\n  }\n' 에서 '}'가 마지막
            last_char_before_bracket = prefix.strip()[-1] if prefix.strip() else ''

            if last_char_before_bracket == '[':
                # 배열이 비어있으면 (예: `[...]` 안에 아무것도 없을 때) 쉼표 없이 추가
                # 최종적으로 `export const labs: Lab[] = [new_data];` 형태가 되도록
                final_content = prefix + new_labs_json_part + suffix
            else:
                # 배열이 비어있지 않으면 쉼표 추가 후 추가
                # 최종적으로 `..., existing_data,\nnew_data];` 형태가 되도록
                final_content = prefix + ',\n' + new_labs_json_part + suffix

            # 파일 쓰기
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(final_content)

            logging.info(f"\nSuccessfully added {len(all_labs)} labs to {output_path}")

        except Exception as e:
            logging.error(f"Error writing to file: {e}")

    except Exception as e:
        logging.error(f"Error in main process: {str(e)}")

if __name__ == "__main__":
    main() 