const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, 'renders', 'analytics', 'circuit-breakers.json');

function ensureParentDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
}

function readState() {
  try {
    if (!fs.existsSync(STATE_FILE)) {
      return {};
    }
    const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    return {};
  }
}

function writeState(nextState) {
  ensureParentDir(STATE_FILE);
  fs.writeFileSync(STATE_FILE, JSON.stringify(nextState, null, 2));
}

function getCircuitState(key) {
  const state = readState();
  const entry = state[String(key || '')] || null;
  if (!entry) {
    return {
      key,
      failures: 0,
      blockedUntilMs: 0,
      blocked: false,
      lastError: null,
    };
  }

  const blockedUntilMs = Number(entry.blockedUntilMs) || 0;
  return {
    key,
    failures: Math.max(0, Number(entry.failures) || 0),
    blockedUntilMs,
    blocked: blockedUntilMs > Date.now(),
    lastError: entry.lastError || null,
    lastFailureAt: entry.lastFailureAt || null,
    lastSuccessAt: entry.lastSuccessAt || null,
  };
}

function canAttempt(key) {
  return !getCircuitState(key).blocked;
}

function recordCircuitSuccess(key) {
  const state = readState();
  state[String(key || '')] = {
    failures: 0,
    blockedUntilMs: 0,
    lastError: null,
    lastFailureAt: state[String(key || '')] && state[String(key || '')].lastFailureAt
      ? state[String(key || '')].lastFailureAt
      : null,
    lastSuccessAt: new Date().toISOString(),
  };
  writeState(state);
}

function recordCircuitFailure(key, error, options = {}) {
  const normalizedKey = String(key || '').trim();
  if (!normalizedKey) {
    return getCircuitState(key);
  }

  const threshold = Math.max(1, Number(options.threshold) || 3);
  const cooldownMs = Math.max(1000, Number(options.cooldownMs) || 15 * 60 * 1000);
  const state = readState();
  const existing = state[normalizedKey] || {};
  const failures = Math.max(0, Number(existing.failures) || 0) + 1;
  const blockedUntilMs = failures >= threshold ? Date.now() + cooldownMs : 0;
  state[normalizedKey] = {
    failures,
    blockedUntilMs,
    lastError: String(error && error.message ? error.message : error || '').slice(0, 280),
    lastFailureAt: new Date().toISOString(),
    lastSuccessAt: existing.lastSuccessAt || null,
  };
  writeState(state);
  return getCircuitState(normalizedKey);
}

module.exports = {
  canAttempt,
  getCircuitState,
  recordCircuitFailure,
  recordCircuitSuccess,
};
