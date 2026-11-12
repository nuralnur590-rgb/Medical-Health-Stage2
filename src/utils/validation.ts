const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

// Телефон: после удаления пробелов, скобок и дефисов должно остаться 10–15 цифр (допускается ведущий +)
export function isValidPhone(value: string): boolean {
  const cleaned = value.replace(/[\s()-]/g, '');
  return /^\+?\d{10,15}$/.test(cleaned);
}

export function isValidPassword(value: string): boolean {
  return value.length >= 8;
}
