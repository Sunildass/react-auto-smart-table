/**
 * Converts a string to Title Case.
 * Example: 'hello_world' -> 'Hello World', 'name' -> 'Name'
 */
const ACRONYMS = ['ID', 'URL', 'API', 'JSON', 'UUID', 'SKU', 'IP', 'VAT', 'GST'];

export const toTitleCase = (str: string): string => {
  if (!str) return '';
  
  // Replace underscores or camelCase with spaces
  const spaced = str
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .trim();

  return spaced
    .split(' ')
    .filter(Boolean)
    .map(word => {
      const upper = word.toUpperCase();
      // If it's a known acronym, return it as upper case
      if (ACRONYMS.includes(upper)) {
        return upper;
      }
      // Otherwise capitalize first char
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};
