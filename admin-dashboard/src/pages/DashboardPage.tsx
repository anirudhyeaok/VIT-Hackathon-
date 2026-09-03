import { useState, useEffect } from 'react';
import { Users, CreditCard, IndianRupee, Activity, ArrowRight, Timer, ExternalLink, CheckCircle } from 'lucide-react';
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
    <div className="space-y-10 pb-16">
      {/* Spacious Open Header (Zero Congestion) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#DCDDD7]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#E9EFEA] text-[#526A57] text-xs font-semibold">
            <span>Operational Telemetry</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#5F7563]"></span>
            <span>All 4 Systems Active</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#30332F]">
            Resilience & Portfolio Overview
          </h1>
          <p className="text-sm text-[#6B706A]">
            Real-time income aggregation across Zomato, Swiggy, Uber, and Ola with 5-day deferred loan buffers.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2 md:pt-0">
          <Link
            to="/admin/workflows"
            className="px-4 py-2.5 rounded-lg bg-[#5F7563] hover:bg-[#4D6151] text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs"
          >
            <span>Automation Pipelines</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/admin/loans"
            className="px-4 py-2.5 rounded-lg bg-white hover:bg-[#F0F1EC] text-[#30332F] text-xs font-medium border border-[#DCDDD7] transition-colors"
          >
            <span>Loan Funnel</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid with Generous Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Gig Workers" value="1,245" icon={<Users size={20} />} trend={{ value: 18, isPositive: true }} />
        <StatCard title="Active Advances" value="420" icon={<CreditCard size={20} />} trend={{ value: 5, isPositive: true }} />
        <StatCard title="Total Disbursed" value="₹ 45.2L" icon={<IndianRupee size={20} />} trend={{ value: 12, isPositive: true }} />
        <StatCard title="Avg Resilience" value="72 / 100" icon={<Activity size={20} />} trend={{ value: 4, isPositive: true }} />
      </div>

      {/* Spacious 5-Stage Deferred Recovery Flow */}
      <div className="bg-white rounded-xl border border-[#DCDDD7] p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F0F1EC] text-[#5F7563] flex items-center justify-center border border-[#DCDDD7]">
              <Timer size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#30332F]">5-Stage Deferred Loan Recovery Model</h2>
              <p className="text-xs text-[#6B706A]">Protective repayment window: Salary is deposited in full before any recovery occurs</p>
            </div>
          </div>
          <Link
            to="/admin/loans"
            className="text-xs font-semibold text-[#526A57] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Inspect Active Cohort</span>
            <ExternalLink size={13} />
          </Link>
        </div>

        {/* Sleek Milestone Progression with Breathing Room */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#DCDDD7] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8A8F89] uppercase tracking-wider">Step 1</span>
              <CheckCircle size={14} className="text-[#62806A]" />
            </div>
            <div className="text-sm font-bold text-[#30332F]">Payout Credited</div>
            <p className="text-xs text-[#6B706A] leading-relaxed">Worker receives 100% of wage deposit.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#E9EFEA] border-2 border-[#5F7563] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#526A57] uppercase tracking-wider">Step 2 • Active</span>
              <span className="w-2 h-2 rounded-full bg-[#5F7563]"></span>
            </div>
            <div className="text-sm font-bold text-[#30332F]">5-Day Grace</div>
            <p className="text-xs text-[#526A57] leading-relaxed">Zero auto-deductions during buffer.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#DCDDD7] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8A8F89] uppercase tracking-wider">Step 3</span>
            </div>
            <div className="text-sm font-bold text-[#30332F]">Day 3 & 5 Alerts</div>
            <p className="text-xs text-[#6B706A] leading-relaxed">Friendly SMS and WhatsApp guidance.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#DCDDD7] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8A8F89] uppercase tracking-wider">Step 4</span>
            </div>
            <div className="text-sm font-bold text-[#30332F]">Cycle Rollover</div>
            <p className="text-xs text-[#6B706A] leading-relaxed">Unpaid balance rolled into next cycle.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F9F9F7] border border-[#DCDDD7] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8A8F89] uppercase tracking-wider">Step 5</span>
            </div>
            <div className="text-sm font-bold text-[#30332F]">Fair Restriction</div>
            <p className="text-xs text-[#6B706A] leading-relaxed">Advances paused only after 2 cycles.</p>
          </div>
        </div>
      </div>

      {/* Main Charts Section with Generous Padding and Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Chart */}
        <div className="bg-white p-7 rounded-xl border border-[#DCDDD7] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#30332F]">Loan Portfolio by Lifecycle</h3>
              <p className="text-xs text-[#6B706A]">Current volume across grace, overdue, and settled stages</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#F0F1EC] text-[#6B706A] border border-[#DCDDD7]">
              1,495 Total
            </span>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={loanStatusData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value">
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

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#DCDDD7] text-xs font-medium text-[#6B706A]">
            {loanStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-[#F9F9F7]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-bold text-[#30332F]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chart */}
        <div className="bg-white p-7 rounded-xl border border-[#DCDDD7] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#30332F]">Platform Integrations</h3>
              <p className="text-xs text-[#6B706A]">Active verified gig employer syncs across workforce</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#E9EFEA] text-[#526A57] border border-[#DCDDD7]">
              1,700 Syncs
            </span>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEBE6" />
                <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#DCDDD7' }} tick={{ fill: '#6B706A', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B706A', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#F0F1EC' }}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCDDD7', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="users" radius={[6, 6, 0, 0]}>
                  {platformData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-3 pt-4 border-t border-[#DCDDD7] text-center text-xs font-medium">
            {platformData.map((item) => (
              <div key={item.name} className="p-2 rounded-lg bg-[#F9F9F7] border border-[#DCDDD7]">
                <div className="text-[11px] text-[#6B706A]">{item.name}</div>
                <div className="font-bold text-sm text-[#30332F] mt-0.5">{item.users}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spacious System Events Table */}
      <div className="bg-white rounded-xl border border-[#DCDDD7] shadow-xs overflow-hidden">
        <div className="p-7 border-b border-[#DCDDD7]">
          <h3 className="text-base font-bold text-[#30332F]">Recent Operational Audit Events</h3>
          <p className="text-xs text-[#6B706A] mt-0.5">Automated logs from cross-platform background sync and borrower notifications</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#6B706A]">
            <thead className="text-[11px] text-[#6B706A] uppercase bg-[#F0F1EC] border-b border-[#DCDDD7]">
              <tr>
                <th className="px-7 py-4 font-semibold">Timestamp</th>
                <th className="px-7 py-4 font-semibold">Event Type</th>
                <th className="px-7 py-4 font-semibold">Operational Context</th>
                <th className="px-7 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCDDD7]">
              <tr className="hover:bg-[#F9F9F7] transition-colors">
                <td className="px-7 py-5 font-mono text-[#8A8F89]">12 mins ago</td>
                <td className="px-7 py-5 font-semibold text-[#30332F]">Grace Period Notice</td>
                <td className="px-7 py-5 text-xs text-[#30332F]">Pushed Day 3 reminder to Ramesh Kumar (₹3,000 balance)</td>
                <td className="px-7 py-5">
                  <StatusBadge status="grace_period" type="loan" />
                </td>
              </tr>
              <tr className="hover:bg-[#F9F9F7] transition-colors">
                <td className="px-7 py-5 font-mono text-[#8A8F89]">45 mins ago</td>
                <td className="px-7 py-5 font-semibold text-[#30332F]">Multi-Platform Ingest</td>
                <td className="px-7 py-5 text-xs text-[#30332F]">Synced 64 earnings & incentive records across Zomato, Swiggy, Uber</td>
                <td className="px-7 py-5">
                  <span className="text-[11px] font-medium text-[#62806A] bg-[#E9EFEA] px-2.5 py-1 rounded-md border border-[#DCDDD7]">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#F9F9F7] transition-colors">
                <td className="px-7 py-5 font-mono text-[#8A8F89]">2 hours ago</td>
                <td className="px-7 py-5 font-semibold text-[#30332F]">Expense Volatility Notice</td>
                <td className="px-7 py-5 text-xs text-[#30332F]">Priya Sharma fuel expenditure flagged at +25% above 4-week baseline</td>
                <td className="px-7 py-5">
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
