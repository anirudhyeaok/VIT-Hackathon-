import React, { useState } from 'react';
import { Play, CheckCircle2, Clock, ArrowRight, Zap, RefreshCw, Layers, ShieldCheck, AlertTriangle } from 'lucide-react';
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
    trigger: 'Cron (Every 6 Hours) / Manual Webhook',
    description: 'Polls Zomato, Swiggy, Uber, and Ola mock APIs, normalizes daily earnings and trips, and stores them in GigWallet backend.',
    endpointToTrigger: 'http://localhost:3001/zomato/earnings/ZMT-R-1001',
    nodes: [
      { title: 'Cron Trigger', type: 'Trigger', detail: 'Runs every 6h or manual button' },
      { title: 'HTTP: Pull Zomato & Swiggy', type: 'Action', detail: 'GET http://localhost:3001/:platform/earnings' },
      { title: 'HTTP: Pull Uber & Ola', type: 'Action', detail: 'GET http://localhost:3001/:platform/earnings' },
      { title: 'Normalize & Weight Data', type: 'Transform', detail: 'Merge daily trips, hours worked & surge' },
      { title: 'POST to GigWallet Backend', type: 'Webhook', detail: 'POST http://localhost:3000/webhooks/n8n/earnings-sync' },
    ],
  },
  {
    id: 'repayment-reminder',
    name: 'Deferred Loan Grace Period Reminders',
    trigger: 'Cron (Daily at 9:00 AM)',
    description: 'Checks loans in 5-day grace period. At Day 3 sends friendly reminder; at Day 5 sends urgent alert. Never deducts salary automatically.',
    endpointToTrigger: 'http://localhost:3000/admin/loans',
    nodes: [
      { title: 'Daily Schedule', type: 'Trigger', detail: 'Runs every morning at 9:00 AM' },
      { title: 'Query Active Loans', type: 'Action', detail: 'Filter status == "grace_period"' },
      { title: 'Calculate Grace Remaining', type: 'Transform', detail: 'Days left = graceDeadline - now' },
      { title: 'Push Reminder Alert', type: 'Webhook', detail: 'POST /webhooks/n8n/loan-reminder' },
    ],
  },
  {
    id: 'grace-expiry',
    name: 'Grace Period Expiry & Overdue Transition',
    trigger: 'Cron (Daily at Midnight)',
    description: 'Finds loans that exceeded the 5-day grace period without repayment and gracefully transitions them to "overdue" status.',
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
    description: 'Ensures constant link between gig worker accounts and GigWallet. Flags connections as stale (>24h) or broken (>72h).',
    endpointToTrigger: 'http://localhost:3000/admin/users',
    nodes: [
      { title: '12-Hour Cron', type: 'Trigger', detail: 'Runs twice daily' },
      { title: 'Check Last Sync Timestamps', type: 'Action', detail: 'Examine platform_connections.lastSyncAt' },
      { title: 'Classify Health State', type: 'Transform', detail: 'linked (<24h) | stale (24-72h) | broken (>72h)' },
      { title: 'Enforce Loan Eligibility', type: 'Webhook', detail: 'Require at least 1 active linked app' },
    ],
  },
  {
    id: 'monthly-rollover',
    name: 'Monthly Overdue Rollover & Fair Blocking',
    trigger: 'Cron (1st of Every Month at 1:00 AM)',
    description: 'Rolls unpaid overdue balances into the next monthly billing cycle. Only blocks user if unpaid across 2 consecutive months.',
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
    name: 'AI Anomaly & Volatility Alert Engine',
    trigger: 'Event Driven / Scheduled',
    description: 'Detects unexpected anomalies such as fuel expenses spiking 25% above average or rapid income drops across multiple apps.',
    endpointToTrigger: 'http://localhost:3000/admin/analytics',
    nodes: [
      { title: 'Transaction Ingestion', type: 'Trigger', detail: 'Triggered on new expense or daily roll' },
      { title: 'ML Volatility Analysis', type: 'Action', detail: 'Compute moving std-deviation of fuel/repairs' },
      { title: 'Threshold Comparator', type: 'Transform', detail: 'If variance > +20% from baseline' },
      { title: 'Dispatch In-App Alert', type: 'Webhook', detail: 'Push notification with explainable tip' },
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
      await new Promise((r) => setTimeout(r, 600));
      setActiveStep(i);
    }

    try {
      if (wf.endpointToTrigger) {
        const res = await axios.get(wf.endpointToTrigger);
        setLastResult({ success: true, status: res.status, data: res.data });
      } else {
        setLastResult({ success: true, message: 'Workflow executed successfully against mock engine!' });
      }
    } catch (err: any) {
      setLastResult({
        success: false,
        message: err.message || 'Error executing node step',
        detail: 'Ensure backend (port 3000) and mock-platforms (port 3001) are running.',
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Zap className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">n8n Automation & Workflow Orchestrator</h1>
              <p className="text-sm text-slate-500">
                Visual pipeline monitor for multi-platform sync, 5-day grace reminders, and health monitoring
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <a
            href="http://localhost:5678"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition flex items-center gap-2"
          >
            Open n8n Web UI (Port 5678)
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left: Workflow List */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Available Pipelines (6)</h2>
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
                className={`w-full text-left p-4 rounded-xl border transition flex flex-col gap-1.5 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-sm">{wf.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {wf.id.split('-')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{wf.trigger}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Interactive Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Active Pipeline</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedWorkflow.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{selectedWorkflow.description}</p>
              </div>
              <button
                disabled={running}
                onClick={() => handleRunTest(selectedWorkflow)}
                className={`px-5 py-2.5 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition ${
                  running ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                {running ? 'Executing Node Steps...' : 'Run Live Pipeline Test'}
              </button>
            </div>

            {/* Visual Flow Nodes */}
            <div className="mt-8 space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visual Node Graph</div>
              <div className="flex flex-col gap-3">
                {selectedWorkflow.nodes.map((node, idx) => {
                  const isFinished = activeStep > idx;
                  const isCurrent = activeStep === idx;

                  let badgeColor = 'bg-slate-100 text-slate-600';
                  if (node.type === 'Trigger') badgeColor = 'bg-amber-100 text-amber-800';
                  if (node.type === 'Action') badgeColor = 'bg-blue-100 text-blue-800';
                  if (node.type === 'Transform') badgeColor = 'bg-purple-100 text-purple-800';
                  if (node.type === 'Webhook') badgeColor = 'bg-emerald-100 text-emerald-800';

                  return (
                    <div key={idx} className="relative">
                      <div
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                          isFinished
                            ? 'border-emerald-400 bg-emerald-50/40'
                            : isCurrent
                            ? 'border-indigo-500 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200'
                            : 'border-slate-200 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              isFinished
                                ? 'bg-emerald-500 text-white'
                                : isCurrent
                                ? 'bg-indigo-600 text-white animate-pulse'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isFinished ? '✓' : idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                              {node.title}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeColor}`}>
                                {node.type}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">{node.detail}</div>
                          </div>
                        </div>

                        {isFinished && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" /> Passed
                          </span>
                        )}
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                            <RefreshCw className="w-4 h-4 animate-spin" /> Processing
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Execution Result Box */}
            {lastResult && (
              <div
                className={`mt-6 p-4 rounded-xl border text-sm ${
                  lastResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="font-semibold flex items-center gap-2 mb-2">
                  {lastResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
                  {lastResult.success ? 'Execution Successful' : 'Execution Notice'}
                </div>
                {lastResult.detail && <p className="text-xs opacity-90 mb-2">{lastResult.detail}</p>}
                <pre className="bg-white/80 p-3 rounded-lg text-xs font-mono overflow-x-auto max-h-48 border border-slate-200/50">
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
