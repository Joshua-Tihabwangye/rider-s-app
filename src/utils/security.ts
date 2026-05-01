/**
 * Security utilities for input validation and sanitization
 */

export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, maxLength);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validatePhoneNumber(phone: string): boolean {
  // Basic phone validation (allows international formats)
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function sanitizeUserInput(input: unknown): string {
  if (typeof input !== "string") return "";
  // Remove potentially dangerous characters and limit length
  return input.replace(/[<>\"'&]/g, "").trim().slice(0, 500);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
}