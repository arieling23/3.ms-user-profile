function logInfo(message, data = {}) {
  console.log(`ℹ️  ${message}`, data);
}

function logError(message, error = {}) {
  console.error(`❌ ${message}`, error);
}

module.exports = { logInfo, logError };
