import { styleText } from 'node:util';

/**
 * Colors for STDOUT to bring attention to certain text like icons.
 */
export const theme = {
  /**
   * @param {string} text 
   * @returns {string}
   */
  ok: (text) => styleText('green', text),
  /**
   * @param {string} text 
   * @returns {string}
   */
  err: (text) => styleText('red', text),
}
