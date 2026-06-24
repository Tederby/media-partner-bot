/**
 * Helper utilities for the bot
 */

/**
 * Wait for a specific amount of time.
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Wait for a random amount of time between min and max.
 * @param {number} min - Minimum seconds
 * @param {number} max - Maximum seconds
 * @returns {Promise<void>}
 */
export const randomDelay = async (min = 10, max = 30) => {
  const seconds = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`[INFO] Menunggu delay acak selama ${seconds} detik...`);
  await delay(seconds * 1000);
};

/**
 * Format string to be used safely in filenames
 * @param {string} str 
 * @returns {string}
 */
export const sanitizeFilename = (str) => {
  return str.replace(/[^a-z0-9_.-]/gi, '_').toLowerCase();
};
