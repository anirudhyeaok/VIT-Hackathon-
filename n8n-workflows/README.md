# GigWallet n8n Workflows

This directory contains 6 importable n8n workflow JSON files that automate key GigWallet backend operations.

## Prerequisites

- **n8n** running (locally or Docker): `npx n8n` or `docker run -it --rm -p 5678:5678 n8nio/n8n`
- **GigWallet Backend** running on `http://localhost:3000`
- **Mock Platform APIs** running on `http://localhost:3001` (see `../mock-platforms/`)

## How to Import Workflows

1. Open the n8n web UI at `http://localhost:5678`
2. Click the **☰ menu** → **Workflows**
3. Click the **Import from File** button (or use `Ctrl+O`)
4. Select the `.json` file you want to import
5. Click **Save** and then **Activate** the workflow

Repeat for each workflow file.

## Workflows

### 1. `earnings-sync.json` — Earnings Sync
| Field | Value |
|-------|-------|
| **Schedule** | Every 6 hours (+ manual trigger) |
| **What it does** | Fetches today's earnings from all 4 mock platforms (Zomato, Swiggy, Uber, Ola) and POSTs them to the GigWallet backend webhook |
| **Endpoints called** | `GET /zomato/earnings/ZMT-R-1001`, `GET /swiggy/earnings/SWG-R-2001`, `GET /uber/earnings/UBR-R-3001`, `GET /ola/earnings/OLA-P-4001` |
| **Backend webhook** | `POST /webhooks/n8n/earnings-sync` |

### 2. `repayment-reminder.json` — Repayment Reminder
| Field | Value |
|-------|-------|
| **Schedule** | Daily at 9:00 AM (+ manual trigger) |
| **What it does** | Fetches all loans, filters for `grace_period` loans with deadline within 3 days, sends reminders |
| **Backend endpoints** | `GET /admin/loans`, `POST /webhooks/n8n/loan-reminder` |

### 3. `grace-expiry.json` — Grace Period Expiry Check
| Field | Value |
|-------|-------|
| **Schedule** | Daily at midnight (+ manual trigger) |
| **What it does** | Finds loans where grace period has expired and overrides their status to `overdue` |
| **Backend endpoints** | `GET /admin/loans`, `POST /admin/loans/:id/override` |

### 4. `monthly-rollover.json` — Monthly Loan Rollover
| Field | Value |
|-------|-------|
| **Schedule** | 1st of every month at 1:00 AM (+ manual trigger) |
| **What it does** | Rolls over `overdue` loans to `rolled_over`, blocks loans that have been `rolled_over` for 2+ months |
| **Backend endpoints** | `GET /admin/loans`, `POST /admin/loans/:id/override` |

### 5. `platform-health.json` — Platform Health Check
| Field | Value |
|-------|-------|
| **Schedule** | Every 12 hours (+ manual trigger) |
| **What it does** | Checks each user's platform connections. Flags `stale` (>24h since last sync) and `broken` (>72h) |
| **Backend endpoints** | `GET /admin/users` |

### 6. `financial-alerts.json` — Financial Alerts
| Field | Value |
|-------|-------|
| **Schedule** | Daily at 8:00 AM (+ manual trigger) |
| **What it does** | Analyzes each user's earnings and forecast. Generates alerts for income drops (>30%), expense spikes (>25%), and low buffer (<₹2000) |
| **Backend endpoints** | `GET /admin/users`, `GET /earnings/:userId/summary`, `GET /earnings/:userId/forecast`, `POST /webhooks/n8n/financial-alert` |

## Workflow Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Cron/Manual │────▶│  HTTP Requests    │────▶│  Function Nodes │
│  Triggers    │     │  (Fetch Data)     │     │  (Process Data) │
└─────────────┘     └──────────────────┘     └────────┬────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │  HTTP POST to   │
                                              │  Backend Webhook │
                                              └─────────────────┘
```

## Testing with Manual Trigger

Every workflow includes a **Manual Trigger** node. To test:

1. Open the workflow in the n8n editor
2. Click the **Execute Workflow** button
3. The workflow will run once using the Manual Trigger path
4. Check the output of each node by clicking on it

## Notes

- All workflows use n8n v1 format and should import cleanly into n8n >= 0.200
- Cron triggers use IST-compatible times
- HTTP requests have standard error handling — failed requests will show in the n8n execution log
- The `Function` nodes contain JavaScript logic for data transformation and filtering
