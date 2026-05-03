/**
 * Escape special regex characters in a string to prevent ReDoS attacks
 * when using user input in new RegExp().
 */
const escapeRegex = (string = '') =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export default escapeRegex
