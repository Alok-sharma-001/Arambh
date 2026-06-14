export class CodeNormalizer {
  /**
   * Transforms raw code into a semantic-normalized string for rigid validators.
   * Handles spaces around operators, unifies quotes, etc.
   */
  static normalize(code: string): string {
    let normalized = code;
    
    // 1. Remove all spaces around operators
    normalized = normalized.replace(/\s*([=+\-*/<>!])\s*/g, '$1');
    
    // 2. Unify single quotes to double quotes
    normalized = normalized.replace(/'/g, '"');
    
    // 3. Remove all extra spaces between words (keep single space)
    normalized = normalized.replace(/\s+/g, ' ').trim();
    
    // 4. Specifically for loops, normalize "for x in range(5):" spacing
    normalized = normalized.replace(/for\s+([a-zA-Z_]\w*)\s+in\s+range\s*\(\s*(\d+)\s*\)\s*:/g, 'for $1 in range($2):');

    return normalized;
  }

  /**
   * For the old validators that did code.replace(/\s+/g, ''),
   * if they check `cleaned === 'x=5'`, if we pass the original string, it fails.
   * If we override the string passed to them, it might work.
   */
  static stripAll(code: string): string {
    return code.replace(/\s+/g, '').replace(/'/g, '"');
  }
}
