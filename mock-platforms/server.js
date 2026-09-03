const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// ─── Deterministic Seeded Random ─────────────────────────────────────────────
// Simple hash-based PRNG: same (seed) → same sequence every time.
function hashSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0; // Convert to 32-bit int
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  let s = hashSeed(seed);
  return function next() {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// Returns a random integer in [min, max] inclusive using the seeded generator
function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// Returns a random float rounded to 2 decimals
function randFloat(rng, min, max, decimals = 2) {
  return parseFloat((rng() * (max - min) + min).toFixed(decimals));
}

// Get the day-of-week (0=Sun, 6=Sat) for a date string
function getDayOfWeek(dateStr) {
  return new Date(dateStr + 'T00:00:00').getDay();
}

// ─── Helper: resolve date param ──────────────────────────────────────────────
function resolveDate(queryDate) {
  if (!queryDate || queryDate === 'today') {
    return new Date().toISOString().slice(0, 10);
  }
  // Validate YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(queryDate)) {
    return queryDate;
  }
  return null;
}

// ─── Zomato Earnings ─────────────────────────────────────────────────────────
// Pattern: Consistent daily 750-950, 18-22 deliveries, 7-9 hours. Sunday = off.
app.get('/zomato/earnings/:workerId', (req, res) => {
  const { workerId } = req.params;
  const date = resolveDate(req.query.date);
  if (!date) return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });

  const dow = getDayOfWeek(date);

  // Sunday is off day
  if (dow === 0) {
    return res.json({
      workerId,
      platform: 'zomato',
      date,
      earnings: 0,
      deliveries: 0,
      hoursWorked: 0,
      incentives: 0,
      rating: 0,
    });
  }

  const rng = seededRandom(`zomato:${workerId}:${date}`);
  const deliveries = randInt(rng, 18, 22);
  const hoursWorked = randFloat(rng, 7, 9, 1);
  const baseEarnings = randInt(rng, 750, 950);
  const incentives = randInt(rng, 50, 150);
  const rating = randFloat(rng, 4.2, 4.9, 1);

  res.json({
    workerId,
    platform: 'zomato',
    date,
    earnings: baseEarnings + incentives,
    deliveries,
    hoursWorked: parseFloat(hoursWorked),
    incentives,
    rating: parseFloat(rating),
  });
});

// ─── Swiggy Earnings ─────────────────────────────────────────────────────────
// Pattern: 4-5 days/week, 500-700 per day, random off days.
app.get('/swiggy/earnings/:workerId', (req, res) => {
  const { workerId } = req.params;
  const date = resolveDate(req.query.date);
  if (!date) return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });

  const rng = seededRandom(`swiggy:${workerId}:${date}`);

  // Decide if it's a working day (probability ~70% → 4-5 out of 7)
  const isWorkDay = rng() < 0.70;
  if (!isWorkDay) {
    return res.json({
      workerId,
      platform: 'swiggy',
      date,
      earnings: 0,
      deliveries: 0,
      hoursWorked: 0,
      incentives: 0,
      rating: 0,
    });
  }

  const deliveries = randInt(rng, 14, 20);
  const hoursWorked = randFloat(rng, 6, 8, 1);
  const baseEarnings = randInt(rng, 500, 700);
  const incentives = randInt(rng, 30, 120);
  const rating = randFloat(rng, 4.0, 4.8, 1);

  res.json({
    workerId,
    platform: 'swiggy',
    date,
    earnings: baseEarnings + incentives,
    deliveries,
    hoursWorked: parseFloat(hoursWorked),
    incentives,
    rating: parseFloat(rating),
  });
});

// ─── Uber Earnings ───────────────────────────────────────────────────────────
// Pattern: Highly variable 400-2500, works 2-4 days/week.
app.get('/uber/earnings/:workerId', (req, res) => {
  const { workerId } = req.params;
  const date = resolveDate(req.query.date);
  if (!date) return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });

  const rng = seededRandom(`uber:${workerId}:${date}`);

  // Works 2-4 days/week → probability ~43%
  const isWorkDay = rng() < 0.43;
  if (!isWorkDay) {
    return res.json({
      workerId,
      platform: 'uber',
      date,
      earnings: 0,
      rides: 0,
      hoursOnline: 0,
      surgeBonus: 0,
      rating: 0,
    });
  }

  const rides = randInt(rng, 5, 18);
  const hoursOnline = randFloat(rng, 4, 12, 1);
  const baseEarnings = randInt(rng, 400, 2500);
  const surgeBonus = randInt(rng, 0, 500);
  const rating = randFloat(rng, 4.1, 4.9, 1);

  res.json({
    workerId,
    platform: 'uber',
    date,
    earnings: baseEarnings + surgeBonus,
    rides,
    hoursOnline: parseFloat(hoursOnline),
    surgeBonus,
    rating: parseFloat(rating),
  });
});

// ─── Ola Earnings ────────────────────────────────────────────────────────────
// Pattern: Moderate 800-1200, works 3-4 days/week.
app.get('/ola/earnings/:workerId', (req, res) => {
  const { workerId } = req.params;
  const date = resolveDate(req.query.date);
  if (!date) return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });

  const rng = seededRandom(`ola:${workerId}:${date}`);

  // Works 3-4 days/week → probability ~50%
  const isWorkDay = rng() < 0.50;
  if (!isWorkDay) {
    return res.json({
      workerId,
      platform: 'ola',
      date,
      earnings: 0,
      rides: 0,
      hoursOnline: 0,
      peakBonus: 0,
      rating: 0,
    });
  }

  const rides = randInt(rng, 8, 15);
  const hoursOnline = randFloat(rng, 6, 10, 1);
  const baseEarnings = randInt(rng, 800, 1200);
  const peakBonus = randInt(rng, 50, 250);
  const rating = randFloat(rng, 4.0, 4.8, 1);

  res.json({
    workerId,
    platform: 'ola',
    date,
    earnings: baseEarnings + peakBonus,
    rides,
    hoursOnline: parseFloat(hoursOnline),
    peakBonus,
    rating: parseFloat(rating),
  });
});

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    platforms: ['zomato', 'swiggy', 'uber', 'ola'],
    timestamp: new Date().toISOString(),
  });
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 GigWallet Mock Platform APIs running on http://localhost:${PORT}`);
  console.log(`\n📡 Available endpoints:`);
  console.log(`   GET /zomato/earnings/:workerId?date=YYYY-MM-DD`);
  console.log(`   GET /swiggy/earnings/:workerId?date=YYYY-MM-DD`);
  console.log(`   GET /uber/earnings/:workerId?date=YYYY-MM-DD`);
  console.log(`   GET /ola/earnings/:workerId?date=YYYY-MM-DD`);
  console.log(`   GET /health`);
  console.log(`\n📌 Example:`);
  console.log(`   curl http://localhost:${PORT}/zomato/earnings/ZMT-R-1001?date=2026-09-03`);
  console.log(`   curl http://localhost:${PORT}/health\n`);
});
