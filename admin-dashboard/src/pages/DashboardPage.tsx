import { useState, useEffect } from 'react';
import { Users, CreditCard, IndianRupee, Activity, ArrowRight, ShieldCheck, Timer, ExternalLink } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Restrained professional financial palette: muted green, olive, warm gray, charcoal, muted amber, muted red
  const loanStatusData = [
    { name: 'Grace Period (5 Days)', value: 420, color: '#A78655' },
    { name: 'Overdue', value: 110, color: '#A96861' },
    { name: 'Rolled Over', value: 75, color: '#7C8768' },
    { name: 'Repaid in Full', value: 890, color: '#62806A' },
  ];

  const platformData = [
    { name: 'Zomato', users: 480, fill: '#5F7563' },
    { name: 'Swiggy', users: 510, fill: '#7C8768' },
    { name: 'Uber', users: 390, fill: '#8A8F89' },
    { name: 'Ola', users: 320, fill: '#A3AD94' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Clean White Financial Header Banner */}
      <div className="rounded-xl bg-white p-7 border border-[#DCDDD7] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E9EFEA] border border-[#DCDDD7] text-[#526A57] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5F7563]" />
              Financial Resilience Platform • Operations Overview
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#30332F]">
              Gig Workforce Resilience & Portfolio Operations
            </h1>
            <p className="text-[#6B706A] text-xs sm:text-sm leading-relaxed">
              Cross-platform earnings aggregation across Zomato, Swiggy, Uber, and Ola. 
              Governed by a 5-day deferred loan recovery buffer to protect worker cash-flow continuity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/admin/workflows"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5F7563] hover:bg-[#4D6151] text-white text-xs font-semibold transition-colors border border-[#4D6151]"
            >
              <span>Automated Workflows</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/admin/loans"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-[#F0F1EC] text-[#30332F] text-xs font-medium border border-[#DCDDD7] transition-colors"
            >
              <span>Loan Pipeline</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Gig Workers" value="1,245" icon={<Users size={18} />} trend={{ value: 18, isPositive: true }} />
        <StatCard title="Active EWA Loans" value="420" icon={<CreditCard size={18} />} trend={{ value: 5, isPositive: true }} />
        <StatCard title="Total Disbursed" value="₹ 45.2 Lakh" icon={<IndianRupee size={18} />} trend={{ value: 12, isPositive: true }} />
        <StatCard title="Avg Resilience Score" value="72 / 100" icon={<Activity size={18} />} trend={{ value: 4, isPositive: true }} />
      </div>

      {/* HERO Differentiator Banner: Deferred Recovery Flow */}
      <div className="bg-white rounded-xl border border-[#DCDDD7] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#F0F1EC] text-[#5F7563] rounded-lg border border-[#DCDDD7]">
              <Timer className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-[#30332F]">5-Stage Deferred Loan Recovery Model</h2>
              <p className="text-xs text-[#6B706A]">
                Structured repayment window: Earnings are credited in full with an initial 5-day grace buffer before escalation.
              </p>
            </div>
          </div>
          <Link
            to="/admin/loans"
            className="text-xs font-semibold text-[#526A57] hover:text-[#38463B] flex items-center gap-1 shrink-0"
          >
            Review Active Cohort <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          <div className="p-3 bg-[#F9F9F7] rounded-lg border border-[#DCDDD7]">
            <span className="text-[10px] font-semibold text-[#8A8F89] uppercase tracking-wider">Stage 1</span>
            <div className="text-xs font-bold text-[#30332F] mt-1">Salary Deposited</div>
            <p className="text-[11px] text-[#6B706A] mt-0.5">Worker receives 100% of payout</p>
          </div>
          <div className="p-3 bg-[#E9EFEA] rounded-lg border border-[#5F7563]/40">
            <span className="text-[10px] font-semibold text-[#526A57] uppercase tracking-wider">Stage 2 (Active)</span>
            <div className="text-xs font-bold text-[#30332F] mt-1">5-Day Grace Period</div>
            <p className="text-[11px] text-[#526A57] mt-0.5">No automatic deduction</p>
          </div>
          <div className="p-3 bg-[#F9F9F7] rounded-lg border border-[#DCDDD7]">
            <span className="text-[10px] font-semibold text-[#8A8F89] uppercase tracking-wider">Stage 3</span>
            <div className="text-xs font-bold text-[#30332F] mt-1">Day 3 & 5 Prompts</div>
            <p className="text-[11px] text-[#6B706A] mt-0.5">Polite SMS / WhatsApp reminder</p>
          </div>
          <div className="p-3 bg-[#F9F9F7] rounded-lg border border-[#DCDDD7]">
            <span className="text-[10px] font-semibold text-[#8A8F89] uppercase tracking-wider">Stage 4</span>
            <div className="text-xs font-bold text-[#30332F] mt-1">Monthly Rollover</div>
            <p className="text-[11px] text-[#6B706A] mt-0.5">Rolled into next monthly cycle</p>
          </div>
          <div className="p-3 bg-[#F9F9F7] rounded-lg border border-[#DCDDD7]">
            <span className="text-[10px] font-semibold text-[#8A8F89] uppercase tracking-wider">Stage 5</span>
            <div className="text-xs font-bold text-[#30332F] mt-1">Account Restriction</div>
            <p className="text-[11px] text-[#6B706A] mt-0.5">Blocked only if unpaid 2 cycles</p>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Chart: Loan Pipeline Status */}
        <div className="bg-white p-5 rounded-xl border border-[#DCDDD7] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#30332F]">Loan Portfolio by Recovery Stage</h3>
              <p className="text-xs text-[#6B706A]">Current distribution across grace, overdue, and repaid states</p>
            </div>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#F0F1EC] text-[#6B706A] border border-[#DCDDD7]">
              1,495 Total
            </span>
          </div>

          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={loanStatusData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={3} dataKey="value">
                  {loanStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} Loans`, 'Count']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCDDD7', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-medium text-[#6B706A] pt-3 border-t border-[#DCDDD7]/60">
            {loanStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
                <span className="font-semibold text-[#30332F] ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chart: Multi-Platform Worker Distribution */}
        <div className="bg-white p-5 rounded-xl border border-[#DCDDD7] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#30332F]">Platform Connection Distribution</h3>
              <p className="text-xs text-[#6B706A]">Active verified gig employer syncs across workforce</p>
            </div>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#E9EFEA] text-[#526A57] border border-[#DCDDD7]">
              1,700 Syncs
            </span>
          </div>

          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEBE6" />
                <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#DCDDD7' }} tick={{ fill: '#6B706A', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B706A', fontSize: 11 }} />
                <Tooltip
                  cursor={{ fill: '#F0F1EC' }}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCDDD7', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                  {platformData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3 text-center text-xs font-medium pt-3 border-t border-[#DCDDD7]/60">
            {platformData.map((item) => (
              <div key={item.name} className="p-1.5 rounded bg-[#F9F9F7] border border-[#DCDDD7]/60">
                <div className="text-[10px] text-[#6B706A]">{item.name}</div>
                <div className="font-semibold text-[#30332F]">{item.users}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Alerts Table */}
      <div className="bg-white rounded-xl border border-[#DCDDD7] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#DCDDD7] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#30332F]">Recent Operational & Compliance Events</h3>
            <p className="text-xs text-[#6B706A]">System records from multi-platform sync and repayment monitoring</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#6B706A]">
            <thead className="text-[11px] text-[#6B706A] uppercase bg-[#F0F1EC] border-b border-[#DCDDD7]">
              <tr>
                <th className="px-5 py-3 font-semibold">Timestamp</th>
                <th className="px-5 py-3 font-semibold">Event Type</th>
                <th className="px-5 py-3 font-semibold">Details</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCDDD7]">
              <tr className="hover:bg-[#F9F9F7] transition-colors">
                <td className="px-5 py-3.5 font-mono text-[#8A8F89]">12 mins ago</td>
                <td className="px-5 py-3.5 font-semibold text-[#30332F]">Grace Period Notice</td>
                <td className="px-5 py-3.5">Day 3 reminder dispatched to Ramesh Kumar (₹3,000 active balance)</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status="grace_period" type="loan" />
                </td>
              </tr>
              <tr className="hover:bg-[#F9F9F7] transition-colors">
                <td className="px-5 py-3.5 font-mono text-[#8A8F89]">45 mins ago</td>
                <td className="px-5 py-3.5 font-semibold text-[#30332F]">Platform Link Ingest</td>
                <td className="px-5 py-3.5">Synced 64 earnings and incentive records across Zomato, Swiggy, Uber</td>
                <td className="px-5 py-3.5">
                  <span className="text-[11px] font-medium text-[#62806A] bg-[#E9EFEA] px-2 py-0.5 rounded border border-[#DCDDD7]">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#F9F9F7] transition-colors">
                <td className="px-5 py-3.5 font-mono text-[#8A8F89]">2 hours ago</td>
                <td className="px-5 py-3.5 font-semibold text-[#30332F]">Expense Volatility Signal</td>
                <td className="px-5 py-3.5">Priya Sharma fuel expenditure flagged at +25% above 4-week baseline</td>
                <td className="px-5 py-3.5">
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
