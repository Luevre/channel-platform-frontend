/**
 * 格式化日期时间字符串，将 ISO 格式中的 "T" 替换为空格
 * 例如: "2026-03-30T14:45:05" -> "2026-03-30 14:45:05"
 * @param {string} value - 日期时间字符串
 * @returns {string} 格式化后的字符串，若为空则返回 '-'
 */
export const formatDateTime = (value) => {
  if (!value) return '-';
  return value.replace('T', ' ').substring(0, 19);
};
