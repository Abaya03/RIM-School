/**
 * Utility functions for Mauritanian and international number formatting.
 * Ensures numbers, telephone numbers, NNI, matricules, and financial values
 * always start from Left-to-Right (LTR) and strictly use Latin numerals (0-9).
 */

const EASTERN_ARABIC_DIGITS: Record<string, string> = {
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
};

/**
 * Converts any Eastern Arabic (٠-٩) or Persian (۰-۹) digits into standard Latin digits (0-9).
 */
export function toLatinDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str.replace(/[٠-٩۰-۹]/g, (char) => EASTERN_ARABIC_DIGITS[char] || char);
}

/**
 * Cleans and formats phone number input to ensure:
 * 1. Strictly Latin digits (0-9)
 * 2. Starts from left to right (LTR)
 * 3. Preserves leading '+' for international code
 * 4. Strips disallowed characters
 */
export function cleanPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  // Convert any Arabic digits first
  let cleaned = toLatinDigits(phone).trim();
  
  // Keep only +, digits, and spaces
  const hasPlus = cleaned.startsWith('+');
  cleaned = cleaned.replace(/[^\d\s]/g, '').trim();
  if (hasPlus) {
    cleaned = '+' + cleaned;
  }
  return cleaned;
}

/**
 * Formats a phone number for clean Mauritanian display (e.g. +222 45 25 18 90 or 45 25 18 90).
 */
export function formatPhoneDisplay(phone: string | null | undefined): string {
  if (!phone) return '';
  const cleaned = cleanPhoneNumber(phone);
  
  // Extract just the raw digits
  const rawDigits = cleaned.replace(/\D/g, '');
  
  // Mauritanian number with +222
  if (rawDigits.startsWith('222') && rawDigits.length === 11) {
    const num = rawDigits.slice(3);
    return `+222 ${num.slice(0, 2)} ${num.slice(2, 4)} ${num.slice(4, 6)} ${num.slice(6, 8)}`;
  }
  
  // 8-digit Mauritanian local number
  if (rawDigits.length === 8) {
    return `${rawDigits.slice(0, 2)} ${rawDigits.slice(2, 4)} ${rawDigits.slice(4, 6)} ${rawDigits.slice(6, 8)}`;
  }

  // Already formatted or international with plus
  return cleaned;
}

/**
 * Formats any number into Latin digits with thousand separator spacing (e.g. 14 000).
 */
export function formatLatinNumber(num: number | string, decimals = 0): string {
  const n = typeof num === 'string' ? parseFloat(toLatinDigits(num)) : num;
  if (isNaN(n)) return '0';
  
  const parts = n.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
}
