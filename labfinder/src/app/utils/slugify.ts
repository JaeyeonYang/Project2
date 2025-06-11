export function slugify(str: string) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[\s\.]+/g, "-")      // 공백·마침표 → 대시
      .replace(/[^a-z0-9\-]/g, "");   // 영문/숫자/대시만
  }
  export function unslugify(slug: string) {
    return slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, char => char.toUpperCase());
  }