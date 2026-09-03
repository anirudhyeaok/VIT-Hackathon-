import { useState, useEffect } from 'react';
import { Users, CreditCard, IndianRupee, Activity, ArrowUpRight, ShieldCheck, Timer, ExternalLink } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const loanStatusData = [
    { name: 'Grace Period (5 Days)', value: 420, color: '#F59E0B' },
    { name: 'Overdue (Late)', value: 110, color: '#EF4444' },
    { name: 'Rolled Over (Next Cycle)', value: 75, color: '#8B5CF6' },
    { name: 'Repaid in Full', value: 890, color: '#10B981' },
  ];

  const platformData = [
    { name: 'Zomato', users: 480, fill: '#E23744' },
    { name: 'Swiggy', users: 510, fill: '#FC8019' },
    { name: 'Uber', users: 390, fill: '#1E293B' },
    { name: 'Ola', users: 320, fill: '#16A34A' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              VIT Hackathon 2026 • Financial Resilience Platform
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Multi-Platform Co-Pilot for Gig Workers
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Evaluating holistic income consistency across <strong>Zomato, Swiggy, Uber, and Ola</strong>.
              Featuring our borrower-friendly <strong>5-day deferred loan recovery</strong> instead of immediate salary deductions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/workflows"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>View n8n Pipelines</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              to="/admin/loans"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all"
            >
              <span>Recovery Funnel</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Active Gig Workers" value="1,245" icon={<Users />} trend={{ value: 18, isPositive: true }} />
        <StatCard title="Active EWA Loans" value="420 in Grace" icon={<CreditCard />} trend={{ value: 5, isPositive: true }} />
        <StatCard title="Total Disbursed" value="₹ 45.2 Lakh" icon={<IndianRupee />} trend={{ value: 12, isPositive: true }} />
        <StatCard title="Avg Resilience Score" value="72 / 100" icon={<Activity />} trend={{ value: 4, isPositive: true }} />
      </div>

      {/* HERO Differentiator Banner: Deferred Recovery Flow */}
      <div className="bg-gradient-to-br from-amber-500/5 via-white to-amber-500/10 rounded-2xl border border-amber-200/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
              <Timer className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Borrower-First Deferred Loan Recovery Model</h2>
              <p className="text-xs text-slate-500">
                Unlike KarmaLife which immediately seizes loan repayments from salary deposits, GigWallet gives workers a 5-day grace window.
              </p>
            </div>
          </div>
          <Link
            to="/admin/loans"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 shrink-0"
          >
            Inspect Active Pipeline <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 1</span>
            <div className="text-sm font-bold text-slate-900 mt-1">Salary Deposited</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Worker gets 100% of wage</p>
          </div>
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 shadow-xs ring-2 ring-amber-400/30">
            <span className="text-[10px] font-bold text-amber-700 uppercase">Stage 2 (Active)</span>
            <div className="text-sm font-bold text-amber-900 mt-1">5-Day Grace Period</div>
            <p className="text-[11px] text-amber-700 mt-0.5">Zero auto-debit deduction</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 3</span>
            <div className="text-sm font-bold text-slate-900 mt-1">Day 3 & 5 Alerts</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Gentle WhatsApp / SMS prompt</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 4</span>
            <div className="text-sm font-bold text-slate-900 mt-1">Monthly Rollover</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Rolled into next month</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 5</span>
            <div className="text-sm font-bold text-slate-900 mt-1">Fair Escalation</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Blocked only if unpaid 2x</p>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart: Loan Pipeline Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">EWA Loan Status Distribution</h3>
              <p className="text-xs text-slate-500">Live active loans by grace and recovery phase</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              1,495 Total Loans
            </span>
          </div>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={loanStatusData} cx="50%" cy="50%" innerRadius={70} outerRadius={105} paddingAngle={4} dataKey="value">
                  {loanStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} Loans`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-medium text-slate-600 pt-3 border-t border-slate-100">
            {loanStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
                <span className="font-bold text-slate-900 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chart: Multi-Platform Worker Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Multi-Platform Ingest Coverage</h3>
              <p className="text-xs text-slate-500">Active workers connected across multiple gig platforms</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
              1,700 Syncs
            </span>
          </div>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#E2E8F0' }} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#F1F5F9' }} />
                <Bar dataKey="users" radius={[8, 8, 0, 0]}>
                  {platformData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4 text-center text-xs font-medium pt-3 border-t border-slate-100">
            {platformData.map((item) => (
              <div key={item.name} className="p-1.5 rounded-lg bg-slate-50">
                <div className="text-[11px] text-slate-500">{item.name}</div>
                <div className="font-bold text-slate-900">{item.users}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Alerts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Platform & Risk Events</h3>
            <p className="text-xs text-slate-500">Live signals from cross-platform background jobs</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-400 uppercase bg-slate-50/70 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Timestamp</th>
                <th className="px-6 py-3.5 font-semibold">Event Type</th>
                <th className="px-6 py-3.5 font-semibold">Details</th>
                <th className="px-6 py-3.5 font-semibold">Action / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 text-xs font-mono text-slate-400">12 mins ago</td>
                <td className="px-6 py-4 font-semibold text-slate-900">Grace Period Reminder</td>
                <td className="px-6 py-4 text-xs">Pushed Day 3 reminder to Ramesh Kumar (₹3,000 active loan)</td>
                <td className="px-6 py-4">
                  <StatusBadge status="grace_period" type="loan" />
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 text-xs font-mono text-slate-400">45 mins ago</td>
                <td className="px-6 py-4 font-semibold text-slate-900">Platform Link Sync</td>
                <td className="px-6 py-4 text-xs">Successfully synced 64 records across Zomato, Swiggy, Uber</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Synced
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 text-xs font-mono text-slate-400">2 hours ago</td>
                <td className="px-6 py-4 font-semibold text-slate-900">Fuel Surge Alert</td>
                <td className="px-6 py-4 text-xs">Priya Sharma's fuel spending is +25% above 4-week moving average</td>
                <td className="px-6 py-4">
                  <StatusBadge status="caution" type="risk" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
