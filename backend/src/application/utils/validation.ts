// Eenvoudige validatie & sanitatie helpers
export const sanitizeString = (value: string): string => value.trim();

export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Normaliseer e-mail (trim + lowercase) voor consistente opslag / matching
export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

// Normaliseer naam: trim, lowercase en eerste letter van elk woord hoofdletter voor presentatie-consistentie
export const normalizeName = (name: string): string => {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return trimmed;
  return trimmed
    .split(/\s+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

// Verzamelde normalisatie voor registratie
export const normalizeRegisterInput = (data: { name: string; email: string; password: string }) => ({
  name: normalizeName(data.name),
  email: normalizeEmail(data.email),
  password: data.password,
});

// Verzamelde normalisatie voor login
export const normalizeLoginInput = (data: { email: string; password: string }) => ({
  email: normalizeEmail(data.email),
  password: data.password,
});

// Minimaal 8 chars, 1 hoofdletter, 1 kleine letter, 1 cijfer, 1 speciaal teken
export const isStrongPassword = (password: string): boolean => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
};

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export const validateRegisterInput = (name: string, email: string, password: string): ValidationResult => {
  if (!name || sanitizeString(name).length < 2) {
    return { valid: false, message: 'Naam moet minimaal 2 karakters bevatten' };
  }
  if (!isValidEmail(email)) {
    return { valid: false, message: 'Ongeldig e-mailadres' };
  }
  if (!isStrongPassword(password)) {
  return { valid: false, message: 'Wachtwoord onvoldoende sterk (min. 8 tekens, hoofdletter, kleine letter, cijfer, speciaal teken)' };
  }
  return { valid: true };
};

export const validateLoginInput = (email: string, password: string): ValidationResult => {
  if (!isValidEmail(email)) {
    return { valid: false, message: 'Ongeldig e-mailadres' };
  }
  if (!password) {
    return { valid: false, message: 'Wachtwoord is verplicht' };
  }
  return { valid: true };
};