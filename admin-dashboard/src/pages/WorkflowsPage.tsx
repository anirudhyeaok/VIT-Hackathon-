import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Clock, RefreshCw, Layers, AlertTriangle, ChevronDown, ChevronUp, Server } from 'lucide-react';
import axios from 'axios';

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  description: string;
  nodes: Array<{ title: string; type: string; detail: string }>;
  endpointToTrigger?: string;
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
    endpointToTrigger: 'http://localhost:3001/admin/loans',
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
    endpointToTrigger: 'http://localhost:3001/admin/loans',
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
    endpointToTrigger: 'http://localhost:3001/health',
    nodes: [
      { title: '12-Hour Cron', type: 'Trigger', detail: 'Runs twice daily' },
      { title: 'Check Last Sync Timestamps', type: 'Action', detail: 'Examine platform_connections.lastSyncAt' },
      { title: 'Classify Health State', type: 'Transform', detail: 'linked (<24h) | stale (24-72h) | broken (>72h)' },
      { title: 'Enforce Eligibility Safeguard', type: 'Webhook', detail: 'Require at least 1 active linked app' },
    ],
  },
  {
    id: 'monthly-rollover',
    name: 'Monthly Overdue Rollover & Penalty Escalation',
    trigger: 'Cron (1st of Month at 01:00)',
    description: 'Rolls unpaid overdue balances into next monthly billing cycle. Applies +5% compounding penalty per unpaid cycle instead of blocking.',
    endpointToTrigger: 'http://localhost:3001/admin/loans',
    nodes: [
      { title: 'Month-End Cron', type: 'Trigger', detail: 'Runs 1st of month at 01:00' },
      { title: 'Query Overdue Loans', type: 'Action', detail: 'Find status == "overdue"' },
      { title: 'Penalty Evaluation', type: 'Transform', detail: 'If 1 cycle -> Rollover; If 2+ cycles -> +5% penalty per cycle' },
      { title: 'Update Account Status', type: 'Webhook', detail: 'Set status = "rolled_over" or "penalty_escalated"' },
    ],
  },
  {
    id: 'financial-alerts',
    name: 'Expense Volatility & Anomaly Engine',
    trigger: 'Event Driven / Scheduled',
    description: 'Detects unexpected anomalies such as fuel expenses spiking 25% above average or cross-platform dropoffs.',
    endpointToTrigger: 'http://localhost:3001/admin/analytics',
    nodes: [
      { title: 'Transaction Ingestion', type: 'Trigger', detail: 'Triggered on new expense record' },
      { title: 'Volatility Calculation', type: 'Action', detail: 'Compute rolling variance of operational costs' },
      { title: 'Threshold Evaluation', type: 'Transform', detail: 'Flag variance > +20% from baseline' },
      { title: 'Dispatch In-App Safe Tip', type: 'Webhook', detail: 'Push notification with action advice' },
    ],
  },
];

interface WorkflowResult {
  status: 'passed' | 'failed' | 'untested';
  log: any;
  elapsedMs: Record<number, number>;
}

export const WorkflowsPage: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow>(workflows[0]);
  const [running, setRunning] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [workflowResults, setWorkflowResults] = useState<Record<string, WorkflowResult>>({});
  const [logExpanded, setLogExpanded] = useState<boolean>(false);
  const [batchRunning, setBatchRunning] = useState<boolean>(false);
  const [batchStats, setBatchStats] = useState<{ passed: number; failed: number; total: number } | null>(null);
  
  // To display real-time ms for the active node
  const [activeStepTimer, setActiveStepTimer] = useState<number>(0);

  useEffect(() => {
    let interval: any;
    if (running && activeStep >= 0) {
      interval = setInterval(() => {
        setActiveStepTimer((prev) => prev + 50);
      }, 50);
    } else {
      setActiveStepTimer(0);
    }
    return () => clearInterval(interval);
  }, [running, activeStep]);

  const executePipeline = async (wf: Workflow) => {
    setRunning(true);
    setActiveStep(0);
    setLogExpanded(false);

    let currentElapsed: Record<number, number> = {};

    for (let i = 0; i < wf.nodes.length; i++) {
      setActiveStep(i);
      setActiveStepTimer(0);
      // Simulate processing time per node
      const delay = Math.floor(Math.random() * 300) + 200;
      await new Promise((r) => setTimeout(r, delay));
      currentElapsed[i] = delay;
    }

    setActiveStep(-1);
    
    try {
      let resData = null;
      let resStatus = 200;
      if (wf.endpointToTrigger) {
        const startReq = Date.now();
        const res = await axios.get(wf.endpointToTrigger);
        const reqDelay = Date.now() - startReq;
        resData = res.data;
        resStatus = res.status;
        currentElapsed[wf.nodes.length - 1] = (currentElapsed[wf.nodes.length - 1] || 0) + reqDelay;
      }
      
      setWorkflowResults((prev) => ({
        ...prev,
        [wf.id]: {
          status: 'passed',
          elapsedMs: currentElapsed,
          log: { success: true, status: resStatus, data: resData, message: 'Pipeline executed successfully.' }
        }
      }));
      return true;
    } catch (err: any) {
      setWorkflowResults((prev) => ({
        ...prev,
        [wf.id]: {
          status: 'failed',
          elapsedMs: currentElapsed,
          log: {
            success: false,
            message: err.message || 'Execution error',
            detail: 'Ensure backend and mock-platforms (port 3001) are active.',
          }
        }
      }));
      return false;
    } finally {
      setRunning(false);
    }
  };

  const handleRunAll = async () => {
    setBatchRunning(true);
    setBatchStats(null);
    let passed = 0;
    let failed = 0;

    for (const wf of workflows) {
      setSelectedWorkflow(wf);
      const success = await executePipeline(wf);
      if (success) passed++;
      else failed++;
    }

    setBatchStats({ passed, failed, total: workflows.length });
    setBatchRunning(false);
  };

  const currentResult = workflowResults[selectedWorkflow.id];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 dark:bg-[#1A1C1A] min-h-screen">
      {/* Clean Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#DCDDD7] dark:border-[#3A3D3A] gap-3 pt-6 px-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#F0F1EC] dark:bg-[#2E302E] text-[#5F7563] dark:text-[#E5E7E3] rounded-lg border border-[#DCDDD7] dark:border-[#3A3D3A]">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-[#30332F] dark:text-[#E5E7E3]">Automated Workflow Orchestrator</h1>
              <p className="text-xs text-[#6B706A] dark:text-[#A3A8A2]">
                Multi-platform ingest, 5-day grace lifecycle, and platform link reliability monitors.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {batchStats && (
            <div className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#DCDDD7] dark:border-[#3A3D3A] bg-white dark:bg-[#242624] text-[#30332F] dark:text-[#E5E7E3] flex items-center gap-3">
              <span>Batch Results:</span>
              <span className="text-[#62806A] flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> {batchStats.passed}</span>
              <span className="text-[#A96861] flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5"/> {batchStats.failed}</span>
            </div>
          )}
          <button
            disabled={running || batchRunning}
            onClick={handleRunAll}
            className={`px-4 py-2 rounded-lg text-white font-medium text-xs flex items-center gap-2 transition-colors shrink-0 ${
              batchRunning ? 'bg-[#5F7563]/60 cursor-not-allowed' : 'bg-[#5F7563] hover:bg-[#4D6151]'
            }`}
          >
            {batchRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5 fill-white" />}
            {batchRunning ? 'Running Batch...' : 'Run All Pipelines'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
        {/* Left: Workflow List */}
        <div className="space-y-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#6B706A] dark:text-[#A3A8A2] px-1">Active Pipelines ({workflows.length})</h2>
          {workflows.map((wf) => {
            const isSelected = wf.id === selectedWorkflow.id;
            const res = workflowResults[wf.id];
            const statusIcon = res?.status === 'passed' 
              ? <CheckCircle2 className="w-4 h-4 text-[#62806A]" /> 
              : res?.status === 'failed' 
              ? <AlertTriangle className="w-4 h-4 text-[#A96861]" /> 
              : <div className="w-4 h-4 rounded-full border-2 border-[#DCDDD7] dark:border-[#3A3D3A]" />;

            return (
              <button
                key={wf.id}
                onClick={() => {
                  setSelectedWorkflow(wf);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-colors flex flex-col gap-1 ${
                  isSelected
                    ? 'border-[#5F7563] bg-[#E3EAE3] text-[#30332F] dark:bg-[#2E302E] dark:text-[#E5E7E3] dark:border-[#5F7563]'
                    : 'border-[#DCDDD7] bg-white text-[#6B706A] hover:bg-[#F9F9F7] dark:border-[#3A3D3A] dark:bg-[#242624] dark:text-[#A3A8A2] dark:hover:bg-[#2E302E]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-xs flex-1 truncate pr-2 text-[#30332F] dark:text-[#E5E7E3]">{wf.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-[#1A1C1A] text-[#6B706A] dark:text-[#A3A8A2] border border-[#DCDDD7] dark:border-[#3A3D3A]">
                      {wf.id.split('-')[0]}
                    </span>
                    {statusIcon}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#6B706A] dark:text-[#A3A8A2]">
                  <Clock className="w-3 h-3 text-[#8A8F89] dark:text-[#A3A8A2]" />
                  <span>{wf.trigger}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Interactive Canvas */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-[#242624] p-6 rounded-xl border border-[#DCDDD7] dark:border-[#3A3D3A] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#5F7563] uppercase tracking-wider">Configured Pipeline</span>
                <h3 className="text-base font-bold text-[#30332F] dark:text-[#E5E7E3] mt-0.5">{selectedWorkflow.name}</h3>
                <p className="text-xs text-[#6B706A] dark:text-[#A3A8A2] mt-1">{selectedWorkflow.description}</p>
              </div>
              <button
                disabled={running || batchRunning}
                onClick={() => executePipeline(selectedWorkflow)}
                className={`px-4 py-2 rounded-lg text-white font-medium text-xs flex items-center gap-2 transition-colors shrink-0 ${
                  running || batchRunning ? 'bg-[#5F7563]/60 cursor-not-allowed' : 'bg-[#5F7563] hover:bg-[#4D6151]'
                }`}
              >
                {(running || batchRunning) && selectedWorkflow.id === selectedWorkflow.id ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white" />
                )}
                {running ? 'Executing Nodes...' : 'Run Pipeline Test'}
              </button>
            </div>

            {/* Visual Flow Nodes */}
            <div className="mt-6 space-y-3">
              <div className="text-[10px] font-bold text-[#6B706A] dark:text-[#A3A8A2] uppercase tracking-wider">Node Sequence Graph</div>
              <div className="flex flex-col gap-2.5">
                {selectedWorkflow.nodes.map((node, idx) => {
                  const isFinished = (currentResult?.elapsedMs && currentResult.elapsedMs[idx] !== undefined) && (!running || activeStep > idx);
                  const isCurrent = running && activeStep === idx;
                  
                  let msDisplay = null;
                  if (isFinished) {
                    msDisplay = currentResult?.elapsedMs?.[idx];
                  } else if (isCurrent) {
                    msDisplay = activeStepTimer;
                  }

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                        isFinished
                          ? 'border-[#DCDDD7] bg-[#E9EFEA] dark:border-[#3A3D3A] dark:bg-[#2E302E]'
                          : isCurrent
                          ? 'border-[#5F7563] bg-[#F0F1EC] dark:bg-[#1A1C1A] ring-1 ring-[#5F7563] dark:ring-[#5F7563]'
                          : 'border-[#DCDDD7] bg-[#F9F9F7] dark:border-[#3A3D3A] dark:bg-[#1A1C1A]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold ${
                            isFinished
                              ? 'bg-[#5F7563] text-white'
                              : isCurrent
                              ? 'bg-[#5F7563] text-white animate-pulse'
                              : 'bg-white dark:bg-[#242624] text-[#6B706A] dark:text-[#A3A8A2] border border-[#DCDDD7] dark:border-[#3A3D3A]'
                          }`}
                        >
                          {isFinished ? '✓' : idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-[#30332F] dark:text-[#E5E7E3] flex items-center gap-2">
                            {node.title}
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-[#242624] text-[#6B706A] dark:text-[#A3A8A2] border border-[#DCDDD7] dark:border-[#3A3D3A]">
                              {node.type}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#6B706A] dark:text-[#A3A8A2] font-mono mt-0.5">{node.detail}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {msDisplay !== null && (
                          <span className="text-[10px] font-mono text-[#6B706A] dark:text-[#A3A8A2] bg-white dark:bg-[#242624] px-1.5 py-0.5 rounded border border-[#DCDDD7] dark:border-[#3A3D3A]">
                            {msDisplay}ms
                          </span>
                        )}
                        {isFinished && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-[#62806A]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                          </span>
                        )}
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-[#526A57] dark:text-[#E5E7E3]">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Active
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Execution Result Box */}
            {currentResult && !running && (
              <div
                className={`mt-5 rounded-lg border text-xs overflow-hidden ${
                  currentResult.status === 'passed' 
                    ? 'bg-[#E9EFEA] border-[#DCDDD7] text-[#30332F] dark:bg-[#2E302E] dark:border-[#3A3D3A] dark:text-[#E5E7E3]' 
                    : 'bg-[#F8EDEB] border-[#DCDDD7] text-[#A96861] dark:bg-[#2A2020] dark:border-[#3A3D3A] dark:text-[#F8EDEB]'
                }`}
              >
                <div 
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-black/5"
                  onClick={() => setLogExpanded(!logExpanded)}
                >
                  <div>
                    <div className="font-semibold flex items-center gap-2 mb-1.5">
                      {currentResult.status === 'passed' ? <CheckCircle2 className="w-4 h-4 text-[#62806A]" /> : <AlertTriangle className="w-4 h-4 text-[#A96861]" />}
                      {currentResult.status === 'passed' ? 'Pipeline Execution Succeeded' : 'Pipeline Execution Failed'}
                    </div>
                    {currentResult.log?.detail && <p className="text-[11px] text-[#6B706A] dark:text-[#A3A8A2]">{currentResult.log.detail}</p>}
                  </div>
                  {logExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
                
                {logExpanded && (
                  <div className="p-3.5 pt-0 border-t border-[#DCDDD7]/50 dark:border-[#3A3D3A]/50">
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-2 mt-2 opacity-70">HTTP Request/Response Log</div>
                    <pre className="bg-white dark:bg-[#1A1C1A] p-3 rounded text-[11px] font-mono overflow-x-auto max-h-60 border border-[#DCDDD7] dark:border-[#3A3D3A] text-[#30332F] dark:text-[#E5E7E3]">
                      {JSON.stringify(currentResult.log?.data || currentResult.log, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
