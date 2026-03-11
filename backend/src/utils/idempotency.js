const processed = new Set();

function isProcessed(key) {
  return processed.has(key);
}

function markProcessed(key) {
  processed.add(key);
}

module.exports = { isProcessed, markProcessed };
