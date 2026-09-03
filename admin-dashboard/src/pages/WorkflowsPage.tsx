import React, { useState } from 'react';
import { Play, CheckCircle2, Clock, RefreshCw, Layers, ShieldCheck, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  description: string;
  nodes: Array<{ title: string; type: string; detail: string }>;
  endpointToTrigger?: string;
  payload?: any;
}

const workflows: Workflow[] = [
  {
    id: 'earnings-sync',
    name: 'Multi-Platform Earnings Auto-Sync',
    trigger: 'Cron (Every 6h) / Webhook',
    description: 'Polls Zomato, Swiggy, Uber, and Ola APIs, normalizes daily earnings and trips, and stores in backend.',
    endpointToTrigger: 'http://localhost:3001/zomato/earnings/ZMT-R-1001',
    nodes: [
      { title: 'Cron Trigger', type: 'Trigger', detail: 'Runs every 6h or manual dispatch' },
      { title: 'HTTP: Ingest Zomato & Swiggy', type: 'Action', detail: 'GET http://localhost:3001/:platform/earnings' },
      { title: 'HTTP: Ingest Uber & Ola', type: 'Action', detail: 'GET http://localhost:3001/:platform/earnings' },
      { title: 'Normalize & Weight Data', type: 'Transform', detail: 'Merge daily trips, hours worked & surge' },
      { title: 'Persist to GigWallet Core', type: 'Webhook', detail: 'POST /webhooks/n8n/earnings-sync' },
    ],
  },
  {
    id: 'repayment-reminder',
    name: 'Deferred Loan Grace Period Reminders',
    trigger: 'Cron (Daily at 9:00 AM)',
    description: 'Checks loans in 5-day grace. At Day 3 sends polite prompt; at Day 5 sends alert. Never auto-deducts.',
    endpointToTrigger: 'http://localhost:3000/admin/loans',
    nodes: [
      { title: 'Daily Schedule', type: 'Trigger', detail: 'Runs every morning at 09:00' },
      { title: 'Query Active Loans', type: 'Action', detail: 'Filter status == "grace_period"' },
      { title: 'Calculate Grace Remaining', type: 'Transform', detail: 'Days left = graceDeadline - now' },
      { title: 'Push Notification Prompt', type: 'Webhook', detail: 'POST /webhooks/n8n/loan-reminder' },
    ],
  },
  {
    id: 'grace-expiry',
    name: 'Grace Period Expiry & Overdue Transition',
    trigger: 'Cron (Daily at Midnight)',
    description: 'Finds loans that exceeded the 5-day grace period without repayment and transitions to overdue status.',
    endpointToTrigger: 'http://localhost:3000/admin/loans',
    nodes: [
      { title: 'Midnight Scheduler', type: 'Trigger', detail: 'Runs daily at 00:00' },
      { title: 'Scan Expired Loans', type: 'Action', detail: 'Find graceDeadline < current_timestamp' },
      { title: 'Transition Status', type: 'Transform', detail: 'Set status = "overdue", overdueAt = now' },
      { title: 'Log Escalation Audit', type: 'Webhook', detail: 'POST /admin/loans/:id/override' },
    ],
  },
  {
    id: 'platform-health',
    name: 'Constant Platform Link Monitor',
    trigger: 'Cron (Every 12 Hours)',
    description: 'Ensures constant link between gig worker accounts and GigWallet. Flags connections as stale or broken.',
    endpointToTrigger: 'http://localhost:3000/admin/users',
    nodes: [
      { title: '12-Hour Cron', type: 'Trigger', detail: 'Runs twice daily' },
      { title: 'Check Last Sync Timestamps', type: 'Action', detail: 'Examine platform_connections.lastSyncAt' },
      { title: 'Classify Health State', type: 'Transform', detail: 'linked (<24h) | stale (24-72h) | broken (>72h)' },
      { title: 'Enforce Eligibility Safeguard', type: 'Webhook', detail: 'Require at least 1 active linked app' },
    ],
  },
  {
    id: 'monthly-rollover',
    name: 'Monthly Overdue Rollover & Fair Blocking',
    trigger: 'Cron (1st of Month at 01:00)',
    description: 'Rolls unpaid overdue balances into next monthly billing cycle. Only blocks user if unpaid across 2 cycles.',
    endpointToTrigger: 'http://localhost:3000/admin/loans',
    nodes: [
      { title: 'Month-End Cron', type: 'Trigger', detail: 'Runs 1st of month at 01:00' },
      { title: 'Query Overdue Loans', type: 'Action', detail: 'Find status == "overdue"' },
      { title: 'Cycle Counter Evaluation', type: 'Transform', detail: 'If 1 cycle -> Rollover; If 2 cycles -> Block' },
      { title: 'Update Account Status', type: 'Webhook', detail: 'Set status = "rolled_over" or "blocked"' },
    ],
  },
  {
    id: 'financial-alerts',
    name: 'Expense Volatility & Anomaly Engine',
    trigger: 'Event Driven / Scheduled',
    description: 'Detects unexpected anomalies such as fuel expenses spiking 25% above average or cross-platform dropoffs.',
    endpointToTrigger: 'http://localhost:3000/admin/analytics',
    nodes: [
      { title: 'Transaction Ingestion', type: 'Trigger', detail: 'Triggered on new expense record' },
      { title: 'Volatility Calculation', type: 'Action', detail: 'Compute rolling variance of operational costs' },
      { title: 'Threshold Evaluation', type: 'Transform', detail: 'Flag variance > +20% from baseline' },
      { title: 'Dispatch In-App Safe Tip', type: 'Webhook', detail: 'Push notification with action advice' },
    ],
  },
];

export const WorkflowsPage: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow>(workflows[0]);
  const [running, setRunning] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [activeStep, setActiveStep] = useState<number>(-1);

  const handleRunTest = async (wf: Workflow) => {
    setRunning(true);
    setActiveStep(0);
    setLastResult(null);

    // Step-by-step animation simulating node execution
    for (let i = 1; i <= wf.nodes.length; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setActiveStep(i);
    }

    try {
      if (wf.endpointToTrigger) {
        const res = await axios.get(wf.endpointToTrigger);
        setLastResult({ success: true, status: res.status, data: res.data });
      } else {
        setLastResult({ success: true, message: 'Workflow pipeline executed successfully!' });
      }
    } catch (err: any) {
      setLastResult({
        success: false,
        message: err.message || 'Execution error',
        detail: 'Ensure backend (port 3000) and mock-platforms (port 3001) are active.',
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Clean Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#DCDDD7] gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#F0F1EC] text-[#5F7563] rounded-lg border border-[#DCDDD7]">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-[#30332F]">Automated Workflow Orchestrator</h1>
              <p className="text-xs text-[#6B706A]">
                Multi-platform ingest, 5-day grace lifecycle, and platform link reliability monitors.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Workflow List */}
        <div className="space-y-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#6B706A] px-1">Active Pipelines (6)</h2>
          {workflows.map((wf) => {
            const isSelected = wf.id === selectedWorkflow.id;
            return (
              <button
                key={wf.id}
                onClick={() => {
                  setSelectedWorkflow(wf);
                  setActiveStep(-1);
                  setLastResult(null);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-colors flex flex-col gap-1 ${
                  isSelected
                    ? 'border-[#5F7563] bg-[#E3EAE3] text-[#30332F]'
                    : 'border-[#DCDDD7] bg-white text-[#6B706A] hover:bg-[#F9F9F7]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#30332F]">{wf.name}</span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white text-[#6B706A] border border-[#DCDDD7]">
                    {wf.id.split('-')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#6B706A]">
                  <Clock className="w-3 h-3 text-[#8A8F89]" />
                  <span>{wf.trigger}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Interactive Canvas */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-6 rounded-xl border border-[#DCDDD7] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#5F7563] uppercase tracking-wider">Configured Pipeline</span>
                <h3 className="text-base font-bold text-[#30332F] mt-0.5">{selectedWorkflow.name}</h3>
                <p className="text-xs text-[#6B706A] mt-1">{selectedWorkflow.description}</p>
              </div>
              <button
                disabled={running}
                onClick={() => handleRunTest(selectedWorkflow)}
                className={`px-4 py-2 rounded-lg text-white font-medium text-xs flex items-center gap-2 transition-colors shrink-0 ${
                  running ? 'bg-[#5F7563]/60 cursor-not-allowed' : 'bg-[#5F7563] hover:bg-[#4D6151]'
                }`}
              >
                {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                {running ? 'Executing Nodes...' : 'Run Pipeline Test'}
              </button>
            </div>

            {/* Visual Flow Nodes */}
            <div className="mt-6 space-y-3">
              <div className="text-[10px] font-bold text-[#6B706A] uppercase tracking-wider">Node Sequence Graph</div>
              <div className="flex flex-col gap-2.5">
                {selectedWorkflow.nodes.map((node, idx) => {
                  const isFinished = activeStep > idx;
                  const isCurrent = activeStep === idx;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                        isFinished
                          ? 'border-[#DCDDD7] bg-[#E9EFEA]'
                          : isCurrent
                          ? 'border-[#5F7563] bg-[#F0F1EC] ring-1 ring-[#5F7563]'
                          : 'border-[#DCDDD7] bg-[#F9F9F7]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold ${
                            isFinished
                              ? 'bg-[#5F7563] text-white'
                              : isCurrent
                              ? 'bg-[#5F7563] text-white animate-pulse'
                              : 'bg-white text-[#6B706A] border border-[#DCDDD7]'
                          }`}
                        >
                          {isFinished ? '✓' : idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-[#30332F] flex items-center gap-2">
                            {node.title}
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white text-[#6B706A] border border-[#DCDDD7]">
                              {node.type}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#6B706A] font-mono mt-0.5">{node.detail}</div>
                        </div>
                      </div>

                      {isFinished && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#62806A]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                        </span>
                      )}
                      {isCurrent && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#526A57]">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Active
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Execution Result Box */}
            {lastResult && (
              <div
                className={`mt-5 p-3.5 rounded-lg border text-xs ${
                  lastResult.success ? 'bg-[#E9EFEA] border-[#DCDDD7] text-[#30332F]' : 'bg-[#F8EDEB] border-[#DCDDD7] text-[#A96861]'
                }`}
              >
                <div className="font-semibold flex items-center gap-2 mb-1.5">
                  {lastResult.success ? <CheckCircle2 className="w-4 h-4 text-[#62806A]" /> : <AlertTriangle className="w-4 h-4 text-[#A96861]" />}
                  {lastResult.success ? 'Step Execution Succeeded' : 'Notice'}
                </div>
                {lastResult.detail && <p className="text-[11px] text-[#6B706A] mb-2">{lastResult.detail}</p>}
                <pre className="bg-white p-2.5 rounded text-[11px] font-mono overflow-x-auto max-h-40 border border-[#DCDDD7]">
                  {JSON.stringify(lastResult.data || lastResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
