export const slugify = (text: string): string => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // 공백을 -로 교체
    .replace(/[^\w\-]+/g, '')       // 단어가 아닌 문자 제거
    .replace(/\-\-+/g, '-');        // 여러 개의 -를 단일 -로 교체
};

export function unslugify(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
}