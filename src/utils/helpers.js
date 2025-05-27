/**
 * Format date to a readable string
 * @param {string|Date} dateString - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-US", defaultOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: "...")
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50, suffix = "...") => {
  if (!text || typeof text !== "string") return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
};

/**
 * Copy text to clipboard with fallback for older browsers
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    // Modern browsers with secure context
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    textArea.remove();

    return successful;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch (error) {
    return false;
  }
};

/**
 * Validate short code format
 * @param {string} shortCode - Short code to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validateShortCode = (shortCode) => {
  if (!shortCode) {
    return { isValid: true, message: "" }; // Optional field
  }

  if (shortCode.length < 3) {
    return {
      isValid: false,
      message: "Short code must be at least 3 characters",
    };
  }

  if (shortCode.length > 20) {
    return {
      isValid: false,
      message: "Short code must be less than 20 characters",
    };
  }

  const validChars = /^[a-zA-Z0-9_-]+$/;
  if (!validChars.test(shortCode)) {
    return {
      isValid: false,
      message:
        "Short code can only contain letters, numbers, hyphens, and underscores",
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Debounce function to limit the rate of function calls
 * Fixed implementation that works with React hooks
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Create a debounced function using useCallback pattern
 * This version is optimized for React components
 * @param {Function} callback - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Array} dependencies - Dependencies array for useCallback
 * @returns {Function} Debounced callback
 */
export const useDebounce = (callback, delay, dependencies = []) => {
  // This should be used with React.useCallback
  // Example: const debouncedFn = useCallback(useDebounce(myFunction, 300), [dependency]);
  return debounce(callback, delay);
};

/**
 * Format number with commas for thousands
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (typeof num !== "number" && typeof num !== "string") return "0";
  const number = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(number)) return "0";
  return number.toLocaleString();
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {string|Date} dateString - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return formatDate(dateString, { month: "short", day: "numeric" });
  } catch (error) {
    console.error("Error calculating relative time:", error);
    return "Unknown";
  }
};

/**
 * Generate a random string for temporary IDs
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
export const generateRandomId = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Throttle function to limit function calls to once per interval
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone an object (for simple objects without functions)
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map((item) => deepClone(item));

  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

/**
 * Check if two values are equal (shallow comparison)
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean} Are equal
 */
export const isEqual = (a, b) => {
  if (a === b) return true;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (!a || !b || (typeof a !== "object" && typeof b !== "object")) {
    return a === b;
  }

  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }

  if (a.prototype !== b.prototype) return false;

  let keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }

  return keys.every((k) => isEqual(a[k], b[k]));
};
