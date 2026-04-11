const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const LEDGER_DIR = path.join(ROOT_DIR, 'renders', 'analytics');
const FEEDBACK_MODEL_PATH = path.join(LEDGER_DIR, 'feedback-model.json');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 7A: Performance Analyzer - Builds scoring model from past performance
function buildFeedbackModel() {
  ensureDir(LEDGER_DIR);
  
  const model = {
    topicScores: {},
    hookStyleScores: {},
    durationSweet: { optimal: 42, range: [35, 55] },
    uploadTimeScores: {},
    lowPerformers: [],
    lastUpdated: new Date().toISOString()
  };

  if (!fs.existsSync(LEDGER_DIR)) return model;

  // 1. Read YouTube Metrics
  const metricFiles = fs.readdirSync(LEDGER_DIR)
    .filter(f => f.startsWith('youtube-metrics-') && f.endsWith('.json'))
    .sort()
    .reverse();
    
  if (metricFiles.length === 0) {
    console.log('[Analytics] No YouTube metrics found. Starting with baseline model.');
    saveFeedbackModel(model);
    return model;
  }

  const latestMetrics = JSON.parse(fs.readFileSync(path.join(LEDGER_DIR, metricFiles[0]), 'utf8'));
  
  if (!latestMetrics.records || latestMetrics.records.length === 0) {
    saveFeedbackModel(model);
    return model;
  }

  // Calculate scores
  const topicStats = {};
  const hookStats = {};
  const hourMap = {};
  const durations = [];
  
  const minViewsToCount = 100;

  for (const record of latestMetrics.records) {
    const views = record.viewCount || 0;
    
    // Track low performers to avoid similar topics (views < 500)
    if (views < 500 && record.topic) {
      if (!model.lowPerformers.includes(record.topic)) {
        model.lowPerformers.push(record.topic);
      }
    }

    if (views < minViewsToCount) continue; // Skip noise
    
    // Topic scoring
    if (record.topic) {
      if (!topicStats[record.topic]) topicStats[record.topic] = { total: 0, count: 0 };
      topicStats[record.topic].total += views;
      topicStats[record.topic].count += 1;
    }

    // Heuristically determine hook style from title
    // Real implementation would pull this from ledger entries, but we proxy by keywords
    const title = String(record.title || '').toLowerCase();
    let hookStyle = 'standard';
    if (title.includes('secret') || title.includes('truth')) hookStyle = 'consequence';
    else if (title.includes('how to') || title.includes('why')) hookStyle = 'specificity';
    else if (title.includes('vs') || title.includes('shocking')) hookStyle = 'tension';
    
    if (!hookStats[hookStyle]) hookStats[hookStyle] = { total: 0, count: 0 };
    hookStats[hookStyle].total += views;
    hookStats[hookStyle].count += 1;

    // Time scoring (IST upload hour proxy from publishedAt)
    if (record.publishedAt) {
      const dbDate = new Date(record.publishedAt);
      const istHour = (dbDate.getUTCHours() + 5) % 24; // approximation for 5:30 -> ignore minutes
      const slot = `${istHour.toString().padStart(2, '0')}:00`;
      if (!hourMap[slot]) hourMap[slot] = { total: 0, count: 0 };
      hourMap[slot].total += views;
      hourMap[slot].count += 1;
    }

    // Duration mapping
    if (record.duration) {
      // PT1M5S format parse
      const durationMatch = String(record.duration).match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
      if (durationMatch) {
         const m = parseInt(durationMatch[1] || 0, 10);
         const s = parseInt(durationMatch[2] || 0, 10);
         const sec = (m * 60) + s;
         if (sec > 10 && sec < 60) {
            durations.push({ sec, views });
         }
      }
    }
  }

  // Average computation
  for (const [topic, st] of Object.entries(topicStats)) {
    model.topicScores[topic] = Number((Math.log10(st.total / st.count)).toFixed(2));
  }
  for (const [style, st] of Object.entries(hookStats)) {
    model.hookStyleScores[style] = Number((Math.log10(st.total / st.count)).toFixed(2));
  }
  for (const [slot, st] of Object.entries(hourMap)) {
    model.uploadTimeScores[slot] = Number((Math.log10(st.total / st.count)).toFixed(2));
  }

  if (durations.length > 5) {
    durations.sort((a,b) => b.views - a.views);
    const top20 = durations.slice(0, Math.max(3, Math.floor(durations.length * 0.2)));
    const avgTopSec = Math.floor(top20.reduce((sum, d) => sum + d.sec, 0) / top20.length);
    model.durationSweet.optimal = avgTopSec;
    model.durationSweet.range = [Math.max(20, avgTopSec - 10), Math.min(59, avgTopSec + 10)];
  }

  // Top 50 low performers max
  model.lowPerformers = model.lowPerformers.slice(0, 50);

  saveFeedbackModel(model);
  console.log('[Analytics] Feedback loop trained from', latestMetrics.records.length, 'records.');
  return model;
}

function saveFeedbackModel(model) {
  fs.writeFileSync(FEEDBACK_MODEL_PATH, JSON.stringify(model, null, 2));
}

function loadFeedbackModel() {
  try {
    if (fs.existsSync(FEEDBACK_MODEL_PATH)) {
      return JSON.parse(fs.readFileSync(FEEDBACK_MODEL_PATH, 'utf8'));
    }
  } catch (err) {}
  return { topicScores: {}, hookStyleScores: {}, lowPerformers: [] };
}

// Run standalone
if (require.main === module) {
  buildFeedbackModel();
}

module.exports = {
  buildFeedbackModel,
  loadFeedbackModel
};
