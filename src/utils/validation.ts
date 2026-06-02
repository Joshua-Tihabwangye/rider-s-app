const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[1-9]\d{7,14}$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("+")) {
    return `+${trimmed.slice(1).replace(/\D/g, "")}`;
  }

  return trimmed.replace(/\D/g, "");
}

/** Validate an email string. Returns error message or empty string. */
export function validateEmail(email: string): string {
  const normalized = normalizeEmail(email);
  if (!normalized) return "Email is required.";
  if (!EMAIL_RE.test(normalized)) return "Please enter a valid email address.";
  return "";
}

export function validatePhone(phone: string): string {
  const normalized = normalizePhone(phone);
  if (!normalized) return "Phone number is required.";
  if (!PHONE_RE.test(normalized)) return "Please enter a valid phone number.";
  return "";
}

/** Validate a password. Returns error message or empty string. */
export function validatePassword(password: string): string {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
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

export interface RiderSignUpValidationInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city?: string;
  country?: string;
  preferredCurrency?: string;
}

export interface RiderProfileValidationInput {
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  preferredCurrency?: string;
}

export function validateRiderSignUpInput(input: RiderSignUpValidationInput): RiderSignUpValidationInput {
  const fullName = input.fullName.trim();
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const password = input.password;
  const city = input.city?.trim() || undefined;
  const country = input.country?.trim() || undefined;
  const preferredCurrency = input.preferredCurrency?.trim().toUpperCase() || undefined;

  const errors = [
    validateName(fullName),
    validateEmail(email),
    validatePhone(phone),
    validatePassword(password),
  ].filter(Boolean);

  if (errors.length > 0) {
    throw new Error(errors[0]);
  }

  return {
    fullName,
    email,
    phone,
    password,
    city,
    country,
    preferredCurrency,
  };
}

export function validateRiderProfileInput(input: RiderProfileValidationInput): RiderProfileValidationInput {
  const next = {
    fullName: input.fullName?.trim() || undefined,
    email: input.email ? normalizeEmail(input.email) : undefined,
    phone: input.phone ? normalizePhone(input.phone) : undefined,
    city: input.city?.trim() || undefined,
    country: input.country?.trim() || undefined,
    preferredCurrency: input.preferredCurrency?.trim().toUpperCase() || undefined,
  };

  if (next.fullName && validateName(next.fullName)) {
    throw new Error(validateName(next.fullName));
  }
  if (next.email && validateEmail(next.email)) {
    throw new Error(validateEmail(next.email));
  }
  if (next.phone && validatePhone(next.phone)) {
    throw new Error(validatePhone(next.phone));
  }

  return next;
}
