import { labs } from "@/app/database/labsData";

interface Lab {
  id: string;
  name: string;
  university: string;
  major: string;
  keywords: string;
  introduction: string;
}

interface RecommendationResult {
  id: string;
  name: string;
  university: string;
  major: string;
  keywords: string;
  introduction: string;
  similarity_score: number;
  match_count: number;
  matching_keywords: string[];
}

export class LabMatcher {
  private labs_data: Lab[];
  private stop_words: Set<string>;

  constructor() {
    this.labs_data = labs;
    this.stop_words = new Set([
      "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
      "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
      "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
      "or", "an", "will", "my", "one", "all", "would", "there", "their", "what"
    ]);
  }

  private _extract_keywords(keywords_str: string): string[] {
    return keywords_str.split(", ").map(k => k.trim());
  }

  private _calculate_cosine_similarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
  }

  private _text_to_vector(text: string): number[] {
    // 간단한 단어 빈도 기반 벡터화
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq: { [key: string]: number } = {};
    
    words.forEach(word => {
      if (!this.stop_words.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    // 모든 고유 단어의 빈도로 벡터 생성
    const uniqueWords = Object.keys(wordFreq);
    return uniqueWords.map(word => wordFreq[word]);
  }

  private _find_common_keywords(cv_keywords: string[], lab_keywords: string[]): string[] {
    const cv_set = new Set(cv_keywords.map(kw => kw.toLowerCase().trim()));
    const lab_set = new Set(lab_keywords.map(kw => kw.toLowerCase().trim()));
    
    // 정확한 매치만 반환
    return Array.from(cv_set).filter(x => lab_set.has(x));
  }

  public get_top_recommendations(cv_keywords: string[], top_n: number = 10): RecommendationResult[] {
    const results: RecommendationResult[] = [];
    const cv_text = cv_keywords.join(" ");
    const cv_vector = this._text_to_vector(cv_text);
    
    for (const lab of this.labs_data) {
      // 연구실의 키워드와 소개를 합쳐서 벡터화
      const lab_text = `${lab.keywords} ${lab.introduction}`;
      const lab_vector = this._text_to_vector(lab_text);
      
      // 벡터 길이를 맞추기 위해 0으로 패딩
      const maxLength = Math.max(cv_vector.length, lab_vector.length);
      const padded_cv = [...cv_vector, ...Array(maxLength - cv_vector.length).fill(0)];
      const padded_lab = [...lab_vector, ...Array(maxLength - lab_vector.length).fill(0)];
      
      const similarity_score = this._calculate_cosine_similarity(padded_cv, padded_lab);
      const common_keywords = this._find_common_keywords(
        cv_keywords,
        this._extract_keywords(lab.keywords)
      );
      
      if (similarity_score > 0.0001 || common_keywords.length > 0) {
        results.push({
          ...lab,
          similarity_score,
          match_count: common_keywords.length,
          matching_keywords: common_keywords
        });
      }
    }
    
    // 유사도 점수로 정렬
    results.sort((a, b) => b.similarity_score - a.similarity_score);
    
    // 대학별 그룹화
    const university_groups: { [key: string]: RecommendationResult[] } = {};
    for (const result of results) {
      if (!university_groups[result.university]) {
        university_groups[result.university] = [];
      }
      university_groups[result.university].push(result);
    }
    
    // 각 대학에서 최대 4개씩 선택
    const selected_results: RecommendationResult[] = [];
    let remaining_slots = top_n;
    
    for (const university in university_groups) {
      if (remaining_slots > 0) {
        const selected_count = Math.min(4, university_groups[university].length, remaining_slots);
        selected_results.push(...university_groups[university].slice(0, selected_count));
        remaining_slots -= selected_count;
      }
    }
    
    // 남은 자리 채우기
    if (remaining_slots > 0) {
      const remaining_results = results.filter(
        result => !selected_results.some(selected => selected.id === result.id)
      );
      selected_results.push(...remaining_results.slice(0, remaining_slots));
    }
    
    return selected_results;
  }
} 