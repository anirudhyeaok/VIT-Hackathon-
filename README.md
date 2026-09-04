# 🚀 GigWallet — Financial Resilience Platform for Gig & Informal Workers

> **VIT Hackathon Prototype**  
> *"Don't just give the worker money. Help them decide whether they actually need it — while aggregating their full multi-platform income."*

---

## 🌟 The 4 Core Differentiators 

Traditional apps like **KarmaLife** provide Earned Wage Access (EWA) and micro-credit, but have critical structural flaws for real-world gig workers. **GigWallet solves all four:**

| Dimension | KarmaLife / Existing Apps | **GigWallet (Our Solution)** |
|:---|:---|:---|
| **1. Platform Support** | ❌ Single contract only (e.g. only Zomato OR only Swiggy) | ✅ **Multi-Platform Aggregation**: Simultaneously aggregates Zomato, Swiggy, Uber, and Ola into one unified wallet. |
| **2. Consistency Scoring** | ❌ Evaluates consistency on a single platform only | ✅ **Cross-Platform Holistic Score**: Scores overall work frequency across all platforms. Working 4 days on Zomato + 3 days on Swiggy proves higher reliability than single-app reliance. |
| **3. Loan Recovery** | ❌ Auto-deducts loan balance from salary upon deposit | ✅ **Deferred Loan Recovery (Borrower-Friendly)**: Salary is deposited in full. Worker receives a **5-day grace period** to manually repay, followed by reminders, rollover, and fair escalation. |
| **4. Connection Link** | ❌ Static single-contract reliance | ✅ **Constant Platform Health Monitoring**: Live tracking (`linked`, `stale` >24h, `broken` >72h) ensures constant link with active gig employers. |

---

## 🏗️ System Architecture

```text
                                GIG WORKER (User)
                                        │
           ┌────────────────────────────┴────────────────────────────┐
           ▼                                                         ▼
  📱 Flutter Desktop App                                    💻 React Admin Panel
 (Worker Co-Pilot & Aggregation)                           (Lending & Health Oversight)
           │                                                         │
           └────────────────────────────┬────────────────────────────┘
                                        │ REST APIs / JWT (Zero OTP)
                                        ▼
                            🚀 NestJS Backend API
                       (Port 3000 • TypeScript + SQLite)
                                        │
     ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
     ▼                  ▼                               ▼                  ▼
📊 Financial       💰 Adaptive                    🤝 Deferred        🛡️ Platform
Resilience         Savings Engine                 Loan Recovery      Health Monitor
Score (0-100)      (Safe-to-Save)                 (5-Day Grace)      (Sync Tracking)
     │                  │                               │                  │
     └──────────────────┴───────────────┬───────────────┴──────────────────┘
                                        │
                                        ▼
                           🗄️ SQLite Database (Prisma ORM)
                                        ▲
                                        │ Webhooks
                                        ▼
                         🔄 n8n Automation Workflows
                      (Earnings Sync • Reminders • Rollovers)
                                        ▲
                                        │ REST Pull
                                        ▼
                        🌐 Mock Gig Platforms API
                       (Port 3001 • Express Server)
                    Zomato  •  Swiggy  •  Uber  •  Ola
```

---

## 📂 Project Structure

```
gigwallet/
├── backend/                  # NestJS API server (Port 3000)
│   ├── src/
│   │   ├── auth/             # Password/PIN login (zero-OTP as requested)
│   │   ├── platforms/        # Multi-platform connection & health checks
│   │   ├── earnings/         # Cross-platform earnings aggregation
│   │   ├── scoring/          # Financial Resilience & consistency scoring
│   │   ├── savings/          # Adaptive Safe-to-Save engine
│   │   ├── credit/           # Responsible credit affordability evaluation
│   │   ├── loans/            # 5-day grace deferred loan state machine
│   │   ├── dashboard/        # Single-call high-speed dashboard combo API
│   │   ├── admin/            # Oversight endpoints for admin portal
│   │   ├── webhooks/         # n8n webhook handlers
│   │   └── common/           # Standard error filter, JWT guards, DTOs
│   └── prisma/
│       ├── schema.prisma     # SQLite database models
│       └── seed.ts           # Deterministic demo seed (Ramesh, Priya, Arjun)
│
├── flutter_app/              # Flutter Desktop Application (Windows)
│   ├── lib/
│   │   ├── screens/
│   │   │   ├── dashboard_screen.dart     # Multi-tab hero interface
│   │   │   ├── account_link_screen.dart  # RBI Account Aggregator flow
│   │   │   └── login_screen.dart         # Simple login screen
│   │   ├── models/           # Dart data models
│   │   ├── services/         # ApiService with live and mock fallbacks
│   │   └── providers/        # AuthProvider state
│   └── pubspec.yaml
│
├── admin-dashboard/          # React Admin Dashboard (Port 5173)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx     # Executive KPIs & platform charts
│   │   │   ├── UsersPage.tsx         # Multi-platform user list with data masking
│   │   │   ├── LoansPage.tsx         # Visual deferred loan recovery funnel
│   │   │   ├── AnalyticsPage.tsx     # Cross-platform consistency analytics
│   │   │   └── ConsentsPage.tsx      # Account Aggregator consent oversight
│   │   └── components/       # Reusable UI cards, badges, Toast notifications
│   └── package.json
│
├── mock-platforms/           # Deterministic Gig Platform APIs (Port 3001)
│   ├── server.js             # Zomato, Swiggy, Uber, Ola endpoints
│   └── package.json
│
└── n8n-workflows/            # Importable JSON workflows for n8n Web UI
    ├── earnings-sync.json        # Auto-sync gig platform earnings
    ├── repayment-reminder.json   # Grace period reminder push
    ├── grace-expiry.json         # Move expired grace loans to overdue
    ├── monthly-rollover.json     # Monthly cycle rollover & blocking
    ├── platform-health.json      # Connection health check (24h/72h)
    └── financial-alerts.json     # Dynamic worker alerts
```

---

## ⚡ Quick Start Guide (Zero Docker Required)

### 1. Start the Mock Gig Platforms (Terminal 1)
```powershell
cd c:\Users\LENOVO\Downloads\gigwallet\mock-platforms
npm install
node server.js
```
*API runs on `http://localhost:3001` (provides deterministic earnings for Zomato, Swiggy, Uber, Ola).*

### 2. Setup and Start the Backend (Terminal 2)
```powershell
cd c:\Users\LENOVO\Downloads\gigwallet\backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run start:dev
```
*NestJS API runs on `http://localhost:3000` with Swagger and SQLite DB.*  
*Demo Accounts seeded:*
- **Ramesh Kumar**: `ramesh@demo.com` / `password123` (Multi-platform worker, Score 72, Active loan in Grace Period)
- **Priya Sharma**: `priya@demo.com` / `password123` (Volatile earnings, Overdue loan)
- **Arjun Patel**: `arjun@demo.com` / `password123` (Freelancer, irregular income)

### 3. Run the React Admin Dashboard (Terminal 3)
```powershell
cd c:\Users\LENOVO\Downloads\gigwallet\admin-dashboard
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

### 4. Run the Flutter Desktop App (Terminal 4)
```powershell
cd c:\Users\LENOVO\Downloads\gigwallet\flutter_app
flutter create --platforms=windows .
flutter run -d windows
```

### 5. (Optional) Run n8n Automation (Terminal 5)
```powershell
npx n8n
```
*Open `http://localhost:5678` in your browser. Go to **Workflows → Import from File** and import any of the workflow JSONs from `c:\Users\LENOVO\Downloads\gigwallet\n8n-workflows\`.*

---

## 🎯 Hackathon Demonstration Flow

When presenting to judges, follow this 5-minute winning script:

1. **The Core Problem**: Explain that gig workers in India work for *multiple* apps simultaneously (e.g. Zomato lunch, Swiggy dinner, Uber weekends), but existing EWA apps (like KarmaLife) only partner with a single platform and trap them in rigid auto-debit deductions.
2. **Show Flutter Desktop Tab 1 (Platform Hub)**: Point out that Ramesh has Zomato, Swiggy, Uber, and Ola connected simultaneously. Click **"Force Sync Now"** to demonstrate live real-time status.
3. **Show Tab 0 (Resilience Score & Consistency)**: Show the circular **72/100 Resilience Score**. Explain that working across multiple platforms boosts his consistency score by giving him 26 earning days out of 28.
4. **Show Hero 3 Banner (Deferred Loan Recovery)**: Highlight the yellow banner: *"Loan Grace Period: 3 days remaining"*. Explain that we **do NOT snatch money from salary deposits**. The worker receives their full wage, gets a 5-day grace buffer, and can manually repay.
5. **Show React Admin (Loan Recovery Funnel)**: Switch to the web dashboard (`http://localhost:5173/admin/loans`). Point out the **Disbursed → Grace Period → Overdue → Rolled Over → Blocked** pipeline showing our borrower-first escalation path.
6. **Show Credit Affordability Simulator**: Enter `₹20,000` on Flutter Tab 4. Point out the **🔴 HIGH RISK** warning and explain: *"Our platform helps workers decide whether they can safely afford credit, rather than blindly pushing debt."*
