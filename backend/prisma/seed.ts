import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── DETERMINISTIC SEED DATA ──────────────────────────────
// Same data every time for rehearsed hackathon demo

async function main() {
  console.log('🌱 Seeding GigWallet database...');

  // ── Clean existing data ──
  await prisma.alert.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.resilienceScore.deleteMany();
  await prisma.loanRepayment.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.earningsRecord.deleteMany();
  await prisma.platformConnection.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash('password123', 10);

  // ═══════════════════════════════════════════════════════════
  // USER 1: Ramesh — Consistent multi-platform delivery worker
  // ═══════════════════════════════════════════════════════════
  const ramesh = await prisma.user.create({
    data: {
      id: 'user-ramesh',
      name: 'Ramesh Kumar',
      email: 'ramesh@demo.com',
      password: hash,
      phone: '9876543210',
      occupation: 'delivery_partner',
      incomeFrequency: 'daily',
      emergencyBuffer: 5000,
    },
  });

  // Ramesh's platform connections
  const rameshZomato = await prisma.platformConnection.create({
    data: {
      id: 'conn-ramesh-zomato',
      userId: ramesh.id,
      platform: 'zomato',
      platformName: 'Zomato',
      accountId: 'ZMT-R-1001',
      status: 'linked',
    },
  });

  const rameshSwiggy = await prisma.platformConnection.create({
    data: {
      id: 'conn-ramesh-swiggy',
      userId: ramesh.id,
      platform: 'swiggy',
      platformName: 'Swiggy',
      accountId: 'SWG-R-2001',
      status: 'linked',
    },
  });

  const rameshUber = await prisma.platformConnection.create({
    data: {
      id: 'conn-ramesh-uber',
      userId: ramesh.id,
      platform: 'uber',
      platformName: 'Uber',
      accountId: 'UBR-R-3001',
      status: 'linked',
    },
  });

  // Ramesh's earnings — 4 weeks of data across 3 platforms
  // He's consistent on Zomato, decent on Swiggy, sporadic on Uber
  const today = new Date();
  const earningsData: Array<{
    connectionId: string;
    platform: string;
    daysAgo: number;
    amount: number;
    trips: number;
    hours: number;
    incentives: number;
    rating: number;
  }> = [];

  // Zomato earnings (very consistent — works almost every day)
  const zomatoDailyEarnings = [
    850, 920, 780, 900, 950, 870, 0,    // Week 4 (oldest)
    880, 910, 830, 870, 960, 890, 0,    // Week 3
    900, 870, 920, 850, 980, 910, 0,    // Week 2
    920, 940, 860, 900, 970, 930, 0,    // Week 1 (most recent)
  ];

  // Swiggy earnings (decent — works 4-5 days/week)
  const swiggyDailyEarnings = [
    600, 0, 550, 620, 0, 580, 0,
    650, 0, 600, 0, 640, 610, 0,
    620, 580, 0, 650, 0, 630, 0,
    670, 640, 0, 680, 0, 660, 0,
  ];

  // Uber earnings (sporadic — works 2-3 days/week)
  const uberDailyEarnings = [
    0, 0, 1200, 0, 0, 1100, 0,
    0, 1300, 0, 0, 0, 1150, 0,
    1250, 0, 0, 0, 1180, 0, 0,
    0, 0, 1350, 0, 1200, 0, 0,
  ];

  for (let i = 0; i < 28; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (27 - i));

    if (zomatoDailyEarnings[i] > 0) {
      earningsData.push({
        connectionId: rameshZomato.id,
        platform: 'zomato',
        daysAgo: 27 - i,
        amount: zomatoDailyEarnings[i],
        trips: Math.floor(zomatoDailyEarnings[i] / 45),
        hours: 8 + Math.random() * 2,
        incentives: Math.floor(zomatoDailyEarnings[i] * 0.1),
        rating: 4.2 + Math.random() * 0.6,
      });
    }

    if (swiggyDailyEarnings[i] > 0) {
      earningsData.push({
        connectionId: rameshSwiggy.id,
        platform: 'swiggy',
        daysAgo: 27 - i,
        amount: swiggyDailyEarnings[i],
        trips: Math.floor(swiggyDailyEarnings[i] / 40),
        hours: 5 + Math.random() * 3,
        incentives: Math.floor(swiggyDailyEarnings[i] * 0.08),
        rating: 4.0 + Math.random() * 0.8,
      });
    }

    if (uberDailyEarnings[i] > 0) {
      earningsData.push({
        connectionId: rameshUber.id,
        platform: 'uber',
        daysAgo: 27 - i,
        amount: uberDailyEarnings[i],
        trips: Math.floor(uberDailyEarnings[i] / 150),
        hours: 6 + Math.random() * 4,
        incentives: Math.floor(uberDailyEarnings[i] * 0.12),
        rating: 4.3 + Math.random() * 0.5,
      });
    }
  }

  for (const e of earningsData) {
    const date = new Date(today);
    date.setDate(date.getDate() - e.daysAgo);
    await prisma.earningsRecord.create({
      data: {
        userId: ramesh.id,
        connectionId: e.connectionId,
        platform: e.platform,
        date,
        amount: e.amount,
        trips: e.trips,
        hoursWorked: parseFloat(e.hours.toFixed(1)),
        incentives: e.incentives,
        rating: e.rating ? parseFloat(e.rating.toFixed(1)) : null,
      },
    });
  }

  // Ramesh's transactions (expenses)
  const rameshExpenses = [
    { amount: 3500, category: 'rent', note: 'Room rent', daysAgo: 25 },
    { amount: 200, category: 'fuel', note: 'Petrol', daysAgo: 24 },
    { amount: 150, category: 'food', note: 'Groceries', daysAgo: 23 },
    { amount: 200, category: 'fuel', note: 'Petrol', daysAgo: 20 },
    { amount: 80, category: 'food', note: 'Lunch', daysAgo: 19 },
    { amount: 500, category: 'vehicle_maintenance', note: 'Bike service', daysAgo: 18 },
    { amount: 200, category: 'fuel', note: 'Petrol', daysAgo: 16 },
    { amount: 300, category: 'food', note: 'Groceries', daysAgo: 14 },
    { amount: 200, category: 'fuel', note: 'Petrol', daysAgo: 12 },
    { amount: 100, category: 'entertainment', note: 'Movie', daysAgo: 11 },
    { amount: 200, category: 'fuel', note: 'Petrol', daysAgo: 8 },
    { amount: 250, category: 'food', note: 'Groceries', daysAgo: 7 },
    { amount: 200, category: 'fuel', note: 'Petrol', daysAgo: 4 },
    { amount: 1000, category: 'emi', note: 'Phone EMI', daysAgo: 3 },
    { amount: 150, category: 'food', note: 'Lunch', daysAgo: 2 },
    { amount: 200, category: 'fuel', note: 'Petrol', daysAgo: 1 },
  ];

  for (const exp of rameshExpenses) {
    const date = new Date(today);
    date.setDate(date.getDate() - exp.daysAgo);
    await prisma.transaction.create({
      data: {
        userId: ramesh.id,
        amount: exp.amount,
        type: 'expense',
        category: exp.category,
        source: 'manual_entry',
        note: exp.note,
        date,
      },
    });
  }

  // Also add income transactions from platform earnings
  for (const e of earningsData) {
    const date = new Date(today);
    date.setDate(date.getDate() - e.daysAgo);
    await prisma.transaction.create({
      data: {
        userId: ramesh.id,
        amount: e.amount,
        type: 'income',
        category: 'platform_earning',
        source: e.platform,
        note: `${e.platform} earnings`,
        date,
      },
    });
  }

  // Ramesh's active loan
  const graceDeadline = new Date(today);
  graceDeadline.setDate(graceDeadline.getDate() + 3); // 3 days left in grace
  await prisma.loan.create({
    data: {
      id: 'loan-ramesh-1',
      userId: ramesh.id,
      principal: 3000,
      interestRate: 0,
      totalDue: 3000,
      amountRepaid: 0,
      status: 'grace_period',
      riskLevel: 'safe',
      disbursedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      graceDeadline,
    },
  });

  // Ramesh's resilience score
  await prisma.resilienceScore.create({
    data: {
      userId: ramesh.id,
      overallScore: 72,
      emergencyBufferScore: 22,
      incomeStabilityScore: 16,
      expenseStabilityScore: 11,
      debtBurdenScore: 14,
      savingsBehaviourScore: 9,
      platformConsistency: 5,
      explanation:
        'Strong emergency savings and low debt burden. Income is moderately variable across platforms. Consistent work on Zomato boosts your score. Swiggy activity is decent. Uber work is sporadic — increasing consistency there would improve your score.',
    },
  });

  // Ramesh's recommendations
  await prisma.recommendation.create({
    data: {
      userId: ramesh.id,
      type: 'savings',
      action: 'save',
      amount: 500,
      title: 'Save ₹500 this week',
      reason:
        'Your combined platform earnings this week are ₹4,820, which is above your weekly average. After essential expenses (₹2,100) and your active loan buffer, you can safely set aside ₹500.',
      consequence:
        'Skipping this savings opportunity may slow your emergency buffer growth. Your current buffer is ₹4,200 — below your ₹5,000 target.',
      priority: 1,
    },
  });

  await prisma.recommendation.create({
    data: {
      userId: ramesh.id,
      type: 'credit',
      action: 'wait',
      riskLevel: 'caution',
      title: 'Avoid additional borrowing this week',
      reason:
        'You have an active loan of ₹3,000 in grace period (3 days remaining). Taking more credit before clearing this would increase your debt burden score.',
      consequence:
        'Additional borrowing may push your resilience score below 65 and trigger high-risk status.',
      priority: 2,
    },
  });

  await prisma.recommendation.create({
    data: {
      userId: ramesh.id,
      type: 'general',
      action: 'save',
      title: 'Increase Uber consistency for better score',
      reason:
        'You worked only 6 days on Uber in the last 28 days vs 24 on Zomato. Cross-platform consistency improves your resilience score and loan eligibility.',
      priority: 3,
    },
  });

  // Ramesh's alerts
  await prisma.alert.create({
    data: {
      userId: ramesh.id,
      type: 'debt_alert',
      severity: 'warning',
      title: 'Loan grace period ending soon',
      message:
        'Your ₹3,000 loan grace period ends in 3 days. Please repay to avoid overdue status.',
    },
  });

  await prisma.alert.create({
    data: {
      userId: ramesh.id,
      type: 'savings_alert',
      severity: 'info',
      title: 'Emergency buffer below target',
      message:
        'Your emergency buffer is ₹4,200 — below your ₹5,000 target. Consider saving ₹500 this week.',
    },
  });

  // ═══════════════════════════════════════════════════════════
  // USER 2: Priya — Ride-hailing driver, volatile income
  // ═══════════════════════════════════════════════════════════
  const priya = await prisma.user.create({
    data: {
      id: 'user-priya',
      name: 'Priya Sharma',
      email: 'priya@demo.com',
      password: hash,
      phone: '9876543211',
      occupation: 'ride_hailing',
      incomeFrequency: 'daily',
      emergencyBuffer: 8000,
    },
  });

  const priyaUber = await prisma.platformConnection.create({
    data: {
      id: 'conn-priya-uber',
      userId: priya.id,
      platform: 'uber',
      platformName: 'Uber',
      accountId: 'UBR-P-3002',
      status: 'linked',
    },
  });

  const priyaOla = await prisma.platformConnection.create({
    data: {
      id: 'conn-priya-ola',
      userId: priya.id,
      platform: 'ola',
      platformName: 'Ola',
      accountId: 'OLA-P-4001',
      status: 'stale', // hasn't synced in >24h
      lastSyncAt: new Date(today.getTime() - 36 * 60 * 60 * 1000),
    },
  });

  // Priya's earnings — highly variable (the problem persona)
  const priyaUberEarnings = [
    1800, 800, 2200, 400, 1600, 2000, 0,
    600, 2400, 1000, 0, 1800, 500, 0,
    2100, 700, 1500, 2300, 0, 900, 0,
    1400, 2500, 600, 1900, 0, 1100, 0,
  ];

  const priyaOlaEarnings = [
    0, 1000, 0, 1200, 0, 0, 0,
    1100, 0, 0, 900, 0, 1050, 0,
    0, 1150, 0, 0, 1000, 0, 0,
    1200, 0, 1100, 0, 950, 0, 0,
  ];

  for (let i = 0; i < 28; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (27 - i));

    if (priyaUberEarnings[i] > 0) {
      await prisma.earningsRecord.create({
        data: {
          userId: priya.id,
          connectionId: priyaUber.id,
          platform: 'uber',
          date,
          amount: priyaUberEarnings[i],
          trips: Math.floor(priyaUberEarnings[i] / 180),
          hoursWorked: parseFloat((4 + Math.random() * 6).toFixed(1)),
          incentives: Math.floor(priyaUberEarnings[i] * 0.15),
          rating: parseFloat((4.0 + Math.random() * 0.8).toFixed(1)),
        },
      });

      await prisma.transaction.create({
        data: {
          userId: priya.id,
          amount: priyaUberEarnings[i],
          type: 'income',
          category: 'platform_earning',
          source: 'uber',
          date,
        },
      });
    }

    if (priyaOlaEarnings[i] > 0) {
      await prisma.earningsRecord.create({
        data: {
          userId: priya.id,
          connectionId: priyaOla.id,
          platform: 'ola',
          date,
          amount: priyaOlaEarnings[i],
          trips: Math.floor(priyaOlaEarnings[i] / 160),
          hoursWorked: parseFloat((3 + Math.random() * 5).toFixed(1)),
          incentives: Math.floor(priyaOlaEarnings[i] * 0.1),
          rating: parseFloat((3.8 + Math.random() * 1.0).toFixed(1)),
        },
      });

      await prisma.transaction.create({
        data: {
          userId: priya.id,
          amount: priyaOlaEarnings[i],
          type: 'income',
          category: 'platform_earning',
          source: 'ola',
          date,
        },
      });
    }
  }

  // Priya's expenses (higher fuel costs as ride-hailing)
  const priyaExpenses = [
    { amount: 6000, category: 'rent', daysAgo: 26 },
    { amount: 400, category: 'fuel', daysAgo: 25 },
    { amount: 350, category: 'fuel', daysAgo: 22 },
    { amount: 200, category: 'food', daysAgo: 21 },
    { amount: 400, category: 'fuel', daysAgo: 18 },
    { amount: 1200, category: 'vehicle_maintenance', daysAgo: 17 },
    { amount: 350, category: 'fuel', daysAgo: 15 },
    { amount: 300, category: 'food', daysAgo: 13 },
    { amount: 400, category: 'fuel', daysAgo: 11 },
    { amount: 350, category: 'fuel', daysAgo: 8 },
    { amount: 250, category: 'food', daysAgo: 6 },
    { amount: 2000, category: 'emi', daysAgo: 5 },
    { amount: 400, category: 'fuel', daysAgo: 3 },
    { amount: 350, category: 'fuel', daysAgo: 1 },
  ];

  for (const exp of priyaExpenses) {
    const date = new Date(today);
    date.setDate(date.getDate() - exp.daysAgo);
    await prisma.transaction.create({
      data: {
        userId: priya.id,
        amount: exp.amount,
        type: 'expense',
        category: exp.category,
        source: 'manual_entry',
        date,
      },
    });
  }

  // Priya's overdue loan (demonstrates the escalation flow)
  const priyaGraceDeadline = new Date(today);
  priyaGraceDeadline.setDate(priyaGraceDeadline.getDate() - 3);
  await prisma.loan.create({
    data: {
      id: 'loan-priya-1',
      userId: priya.id,
      principal: 5000,
      interestRate: 0,
      totalDue: 5000,
      amountRepaid: 0,
      status: 'overdue',
      riskLevel: 'caution',
      disbursedAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
      graceDeadline: priyaGraceDeadline,
      overdueAt: priyaGraceDeadline,
    },
  });

  // Priya's resilience score (lower due to volatility)
  await prisma.resilienceScore.create({
    data: {
      userId: priya.id,
      overallScore: 45,
      emergencyBufferScore: 12,
      incomeStabilityScore: 8,
      expenseStabilityScore: 10,
      debtBurdenScore: 8,
      savingsBehaviourScore: 7,
      platformConsistency: 2,
      explanation:
        'Your income is highly variable — ranging from ₹400 to ₹2,500 daily on Uber. Emergency buffer (₹2,800) is well below your ₹8,000 target. Ola connection is stale. Active overdue loan is reducing your score. Focus on building your emergency buffer before taking new credit.',
    },
  });

  // Priya's recommendations
  await prisma.recommendation.create({
    data: {
      userId: priya.id,
      type: 'emergency',
      action: 'build_buffer',
      amount: 300,
      title: 'Prioritize emergency fund',
      reason:
        'Your emergency buffer (₹2,800) is only 35% of your ₹8,000 target. On high-earning days (₹2,000+), set aside ₹300 for emergencies.',
      consequence:
        'Without an adequate emergency buffer, an unexpected vehicle repair could force expensive emergency borrowing.',
      priority: 1,
    },
  });

  await prisma.recommendation.create({
    data: {
      userId: priya.id,
      type: 'credit',
      action: 'wait',
      riskLevel: 'high_risk',
      title: 'Clear overdue loan before new borrowing',
      reason:
        'You have a ₹5,000 overdue loan. Additional borrowing would increase your debt-to-income ratio to dangerous levels given your income volatility.',
      consequence:
        'If the overdue loan rolls over to next month, your account may face restrictions.',
      priority: 1,
    },
  });

  await prisma.recommendation.create({
    data: {
      userId: priya.id,
      type: 'spending',
      action: 'reduce_spending',
      title: 'Fuel expenses are 25% above average',
      reason:
        'Your fuel spending (₹3,200/month) is 25% higher than the average for ride-hailing workers in your area. Consider fuel-efficient routes or vehicle maintenance check.',
      priority: 2,
    },
  });

  // Priya's alerts
  await prisma.alert.create({
    data: {
      userId: priya.id,
      type: 'debt_alert',
      severity: 'critical',
      title: 'Loan overdue — action required',
      message:
        'Your ₹5,000 loan is 3 days overdue. Please repay to avoid rollover to next month.',
    },
  });

  await prisma.alert.create({
    data: {
      userId: priya.id,
      type: 'platform_alert',
      severity: 'warning',
      title: 'Ola connection is stale',
      message:
        'Your Ola account hasn\'t synced in 36 hours. Please re-link to maintain accurate earnings tracking.',
    },
  });

  await prisma.alert.create({
    data: {
      userId: priya.id,
      type: 'income_alert',
      severity: 'warning',
      title: 'Income dropped this week',
      message:
        'Your combined earnings this week are 18% below your 4-week average. Consider picking up more rides to maintain your financial buffer.',
    },
  });

  // ═══════════════════════════════════════════════════════════
  // USER 3: Arjun — Freelancer, irregular payments
  // ═══════════════════════════════════════════════════════════
  const arjun = await prisma.user.create({
    data: {
      id: 'user-arjun',
      name: 'Arjun Patel',
      email: 'arjun@demo.com',
      password: hash,
      phone: '9876543212',
      occupation: 'freelancer',
      incomeFrequency: 'irregular',
      emergencyBuffer: 15000,
    },
  });

  // Arjun only does Swiggy part-time alongside freelancing
  const arjunSwiggy = await prisma.platformConnection.create({
    data: {
      id: 'conn-arjun-swiggy',
      userId: arjun.id,
      platform: 'swiggy',
      platformName: 'Swiggy',
      accountId: 'SWG-A-2002',
      status: 'linked',
    },
  });

  // Arjun's Swiggy earnings (part-time, weekends only)
  const arjunSwiggyEarnings = [
    0, 0, 0, 0, 0, 450, 520,
    0, 0, 0, 0, 0, 480, 500,
    0, 0, 0, 0, 0, 510, 470,
    0, 0, 0, 0, 0, 530, 490,
  ];

  for (let i = 0; i < 28; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (27 - i));

    if (arjunSwiggyEarnings[i] > 0) {
      await prisma.earningsRecord.create({
        data: {
          userId: arjun.id,
          connectionId: arjunSwiggy.id,
          platform: 'swiggy',
          date,
          amount: arjunSwiggyEarnings[i],
          trips: Math.floor(arjunSwiggyEarnings[i] / 50),
          hoursWorked: parseFloat((3 + Math.random() * 2).toFixed(1)),
          incentives: Math.floor(arjunSwiggyEarnings[i] * 0.05),
        },
      });

      await prisma.transaction.create({
        data: {
          userId: arjun.id,
          amount: arjunSwiggyEarnings[i],
          type: 'income',
          category: 'platform_earning',
          source: 'swiggy',
          date,
        },
      });
    }
  }

  // Arjun's freelance income (irregular large payments)
  const freelancePayments = [
    { amount: 15000, daysAgo: 22, note: 'Website project payment' },
    { amount: 8000, daysAgo: 10, note: 'Logo design payment' },
    { amount: 5000, daysAgo: 3, note: 'App UI mockup' },
  ];

  for (const fp of freelancePayments) {
    const date = new Date(today);
    date.setDate(date.getDate() - fp.daysAgo);
    await prisma.transaction.create({
      data: {
        userId: arjun.id,
        amount: fp.amount,
        type: 'income',
        category: 'freelance',
        source: 'manual_entry',
        note: fp.note,
        date,
      },
    });
  }

  // Arjun's expenses
  const arjunExpenses = [
    { amount: 8000, category: 'rent', daysAgo: 27 },
    { amount: 500, category: 'internet', daysAgo: 26 },
    { amount: 400, category: 'food', daysAgo: 22 },
    { amount: 1500, category: 'equipment', daysAgo: 18, note: 'Mouse + keyboard' },
    { amount: 300, category: 'food', daysAgo: 15 },
    { amount: 100, category: 'fuel', daysAgo: 12 },
    { amount: 350, category: 'food', daysAgo: 8 },
    { amount: 600, category: 'entertainment', daysAgo: 5 },
    { amount: 250, category: 'food', daysAgo: 2 },
  ];

  for (const exp of arjunExpenses) {
    const date = new Date(today);
    date.setDate(date.getDate() - exp.daysAgo);
    await prisma.transaction.create({
      data: {
        userId: arjun.id,
        amount: exp.amount,
        type: 'expense',
        category: exp.category,
        source: 'manual_entry',
        note: exp.note,
        date,
      },
    });
  }

  // Arjun's resilience score (moderate — irregular but good savings)
  await prisma.resilienceScore.create({
    data: {
      userId: arjun.id,
      overallScore: 61,
      emergencyBufferScore: 20,
      incomeStabilityScore: 10,
      expenseStabilityScore: 13,
      debtBurdenScore: 18, // no debt = good
      savingsBehaviourScore: 8,
      platformConsistency: 1,
      explanation:
        'No active debt is a strong positive. Income is highly irregular — freelance payments are unpredictable and Swiggy is weekend-only. Emergency buffer (₹10,500) is 70% of your ₹15,000 target. Consider adding another gig platform for more consistent income.',
    },
  });

  await prisma.recommendation.create({
    data: {
      userId: arjun.id,
      type: 'savings',
      action: 'save',
      amount: 2000,
      title: 'Save ₹2,000 from recent project payment',
      reason:
        'You received ₹5,000 from your app UI mockup project. With no active debt and moderate expenses, you can safely save ₹2,000 toward your emergency buffer target.',
      consequence:
        'Your emergency buffer would reach ₹12,500 — 83% of your ₹15,000 target.',
      priority: 1,
    },
  });

  await prisma.recommendation.create({
    data: {
      userId: arjun.id,
      type: 'general',
      action: 'save',
      title: 'Consider adding another delivery platform',
      reason:
        'You only earn from Swiggy on weekends (₹3,950/month). Adding Zomato or Uber Eats could provide ₹4,000-6,000 additional monthly income during freelance gaps.',
      priority: 2,
    },
  });

  console.log('✅ Seed complete!');
  console.log(`   → 3 users: Ramesh (consistent), Priya (volatile), Arjun (irregular)`);
  console.log(`   → ${earningsData.length + 16} earnings records across 4 platforms`);
  console.log(`   → 2 active loans (grace_period + overdue)`);
  console.log(`   → 3 resilience scores with explanations`);
  console.log(`   → 8 personalized recommendations`);
  console.log(`   → 5 financial alerts`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
