import { ColumnType } from '../schema/schemaTypes';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
// simple URL regex
const URL_REGEX = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.-]*)*\/?$/i;
const IMAGE_REGEX = /\.(jpeg|jpg|gif|png|webp|svg|bmp)(\?.*)?$/i;

export const isEmail = (value: string): boolean => EMAIL_REGEX.test(value);

export const isImage = (value: string): boolean => {
  return URL_REGEX.test(value) && IMAGE_REGEX.test(value);
};

export const isUrl = (value: string): boolean => {
  if (isImage(value)) return false; // Give priority to image
  return URL_REGEX.test(value);
};

export const isDate = (value: any): boolean => {
  if (value instanceof Date) return !isNaN(value.getTime());
  if (typeof value === 'string' || typeof value === 'number') {
    // Prevent isolated raw numbers from being miscast to dates
    if (typeof value === 'number') return false;
    
    // Prevent purely numeric strings from being detected as dates
    if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) return false;
    
    // Strict regex check for common date formats to avoid false positives for "ORD-1001" etc.
    // Matches YYYY-MM-DD, DD-MM-YYYY, MM/DD/YYYY, and ISO strings
    const datePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z?)?$|^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/;
    if (typeof value === 'string' && !datePattern.test(value.trim())) {
      // If it doesn't match a standard pattern, be very conservative
      // new Date("ORD-1001") incorrectly results in a valid year 1001 in some environments
      return false;
    }

    const d = new Date(value);
    return !isNaN(d.getTime()) && String(d) !== 'Invalid Date';
  }
  return false;
};

export const isCurrency = (value: string): boolean => {
  return typeof value === 'string' && /^[£$€¥]?\s*-?\d+(?:,\d{3})*(?:\.\d+)?\s*[£$€¥]?$/.test(value) && /[£$€¥]/.test(value);
};

export const isPercentage = (value: string): boolean => {
  return typeof value === 'string' && /^-?\d+(?:\.\d+)?%$/.test(value);
};

export const isNumber = (value: any): boolean => {
  if (typeof value === 'number') return true;
  if (typeof value === 'string') {
    return value.trim() !== '' && !isNaN(Number(value));
  }
  return false;
};

export const isBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return true;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return lower === 'true' || lower === 'false' || lower === 'yes' || lower === 'no';
  }
  return false;
};

/**
 * Priority: 1 email 2 url 3 image 4 date 5 currency 6 percentage 7 number 8 boolean 9 string
 */
export const detectValueType = (value: any): ColumnType => {
  if (value === null || value === undefined || value === '') return 'string';
  
  const strVal = String(value);

  if (isEmail(strVal)) return 'email';
  if (isUrl(strVal)) return 'url';
  if (isImage(strVal)) return 'image';
  if (isDate(value)) return 'date';
  if (isCurrency(strVal)) return 'currency';
  if (isPercentage(strVal)) return 'percentage';
  if (isNumber(value)) return 'number';
  if (isBoolean(value)) return 'boolean';

  return 'string';
};
