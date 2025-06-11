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
    "cheme": "Chemical Engineering",
    "cee": "Civil and Environmental Engineering",
    "icme": "Institute for Computational & Mathematical Engineering",
    "cs": "Computer Science",
    "ee": "Electrical Engineering",
    "msande": "Management Science and Engineering",
    "mse": "Materials Science and Engineering",
    "me": "Mechanical Engineering",
    "bioengineering": "Bioengineering",
    "aa": "Aeronautics and Astronautics",
    "Biology_and_biological_engineering":"Biology_and_biological_engineering",
    "Chemistry_and_Chemical_engineering":"Chemistry_and_Chemical_engineering"
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

def read_existing_labs(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # 기존 labs 배열 추출
            start_marker = 'export const labs: Lab[] = '
            end_marker = '];'
            start_idx = content.find(start_marker)
            if start_idx != -1:
                start_idx += len(start_marker)
                end_idx = content.find(end_marker, start_idx)
                if end_idx != -1:
                    existing_json = content[start_idx:end_idx]
                    return json.loads(existing_json)
    except Exception as e:
        logging.warning(f"Error reading existing labs file: {str(e)}")
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
        
        # Read existing labs
        output_path = r"C:\data structure inclass\Groupassignment\Project2\labfinder\src\app\database\labsData copy.ts"
        existing_labs = read_existing_labs(output_path)
        logging.info(f"Existing labs: {len(existing_labs)}")
        
        # Combine existing and new labs
        combined_labs = existing_labs + all_labs
        
        # Remove duplicates based on id
        seen_ids = set()
        unique_labs = []
        for lab in combined_labs:
            if lab['id'] not in seen_ids:
                seen_ids.add(lab['id'])
                unique_labs.append(lab)
        
        logging.info(f"Total labs after combining and removing duplicates: {len(unique_labs)}")
        logging.info(f"New labs added: {len(unique_labs) - len(existing_labs)}")
        
        # Convert to JSON
        json_data = json.dumps(unique_labs, indent=2, ensure_ascii=False)
        
        # TypeScript 파일 내용 생성
        ts_content = """'use client';

interface Lab {
  id: string;
  name: string;
  major: string;
  university: string;
  keywords: string;
  introduction: string;
}

export const labs: Lab[] = """ + json_data + """;

export default labs;"""
        
        # 파일 쓰기
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(ts_content)
        
        logging.info(f"Successfully wrote {len(ts_content)} bytes to {output_path}")
        
    except Exception as e:
        logging.error(f"Error in main process: {str(e)}")

if __name__ == "__main__":
    main() 