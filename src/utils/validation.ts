/** Validate an email string. Returns error message or empty string. */
export function validateEmail(email: string): string {
  if (!email.trim()) return "Email is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Please enter a valid email address.";
  return "";
}

/** Validate a password. Returns error message or empty string. */
export function validatePassword(password: string): string {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return "";
}

/** Validate a full name. Returns error message or empty string. */
export function validateName(name: string): string {
  if (!name.trim()) return "Full name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  return "";
}

/** Validate that confirm password matches password. Returns error message or empty string. */
export function validateConfirmPassword(password: string, confirm: string): string {
  if (!confirm) return "Please confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return "";
}
