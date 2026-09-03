import { useState, useEffect } from 'react';
import { getAnalytics } from '../services/api';
import { useToast } from '../components/Toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AnalyticsPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    getAnalytics()
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        addToast("Failed to load operations analytics.", "error");
        setLoading(false);
      });
  }, [addToast]);

  if (loading) return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      <div className="h-6 bg-[#F0F1EC] rounded animate-pulse w-48 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-20 bg-[#F0F1EC] rounded-lg animate-pulse w-full"></div>)}
      </div>
    </div>
  );

  const platformHealthData = [
    { name: 'Active & Syncing', value: 850, color: '#62806A' },
    { name: 'Stale (>24h)', value: 120, color: '#A78655' },
    { name: 'Disconnected', value: 30, color: '#A96861' }
  ];

  const consistencyData = [
    { name: 'Multi-App Worker', score: 85, fill: '#5F7563' },
    { name: 'Single-App Worker', score: 60, fill: '#7C8768' },
    { name: 'New Cohort', score: 45, fill: '#8A8F89' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-xl font-bold text-[#30332F]">Cross-Platform Operations & Usability Analytics</h1>
        <p className="text-xs text-[#6B706A] mt-0.5">Reliability, aggregation metrics, and platform health telemetry.</p>
      </div>

      {/* Usability & Portfolio KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#DCDDD7] shadow-xs">
          <p className="text-[#6B706A] text-xs font-medium mb-1">Task Completion Rate</p>
          <h3 className="text-2xl font-bold text-[#30332F]">{data.usability.taskCompletionRate}%</h3>
          <p className="text-[11px] text-[#62806A] font-medium mt-1">↑ 5% positive trend</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#DCDDD7] shadow-xs">
          <p className="text-[#6B706A] text-xs font-medium mb-1">Recommendation Uptake</p>
          <h3 className="text-2xl font-bold text-[#30332F]">{data.usability.recommendationUptake}%</h3>
          <p className="text-[11px] text-[#6B706A] mt-1">Safe-to-save adoption</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#DCDDD7] shadow-xs">
          <p className="text-[#6B706A] text-xs font-medium mb-1">Portfolio Resilience Score</p>
          <h3 className="text-2xl font-bold text-[#30332F]">{data.stats.avgScore} / 100</h3>
          <p className="text-[11px] text-[#6B706A] mt-1">Aggregated mean</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#DCDDD7] shadow-xs">
          <p className="text-[#6B706A] text-xs font-medium mb-1">Active vs Restricted</p>
          <h3 className="text-2xl font-bold text-[#30332F]">
            {data.usability.activeUsers} <span className="text-[#8A8F89] text-base font-normal">/</span> {data.usability.blockedUsers}
          </h3>
          <p className="text-[11px] text-[#6B706A] mt-1">Beneficiaries in good standing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* HERO: Platform Health */}
        <div className="bg-white p-5 rounded-xl border border-[#DCDDD7] shadow-xs">
          <h3 className="text-sm font-bold text-[#30332F]">Platform Connection Health Telemetry</h3>
          <p className="text-xs text-[#6B706A] mb-3">Sync reliability status across linked employer APIs</p>
          <div className="h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={platformHealthData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {platformHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCDDD7', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-xs font-medium text-[#6B706A]">
            {platformHealthData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-sm mr-1.5" style={{ backgroundColor: item.color }}></div>
                <span>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* HERO: Consistency */}
        <div className="bg-white p-5 rounded-xl border border-[#DCDDD7] shadow-xs">
          <h3 className="text-sm font-bold text-[#30332F]">Cross-Platform Consistency Index</h3>
          <p className="text-xs text-[#6B706A] mb-3">Multi-app workers demonstrate +25 pts higher consistency than single-contract reliance</p>
          <div className="h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consistencyData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EAEBE6" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6B706A', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fill: '#30332F', fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`${value} / 100`, 'Consistency Index']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCDDD7', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={22}>
                  {consistencyData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Tracking: Screens & Actions */}
        <div className="bg-white p-5 rounded-xl border border-[#DCDDD7] shadow-xs">
          <h3 className="text-sm font-bold text-[#30332F] mb-3">Audited Interaction Telemetry</h3>
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-semibold text-[#6B706A] uppercase text-[10px] tracking-wider mb-2">Most Accessed Operations</h4>
              {data.usability.mostViewedScreens.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-[#DCDDD7]/50">
                  <span className="text-[#30332F]">{item.screen}</span>
                  <span className="font-semibold font-mono text-[#6B706A]">{item.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-semibold text-[#6B706A] uppercase text-[10px] tracking-wider mb-2">Logged Actions</h4>
              {data.usability.commonActions.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-[#DCDDD7]/50">
                  <span className="text-[#30332F]">{item.action}</span>
                  <span className="font-semibold font-mono text-[#6B706A]">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error Rates */}
        <div className="bg-white p-5 rounded-xl border border-[#DCDDD7] shadow-xs">
          <h3 className="text-sm font-bold text-[#30332F]">Integration Exception Frequency</h3>
          <p className="text-xs text-[#6B706A] mb-3">Sync exception and rate-limit incidence across employer connectors</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.usability.errorRates} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEBE6" />
                <XAxis dataKey="date" tick={{ fill: '#6B706A', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6B706A', fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Error Incidence']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCDDD7', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="rate" stroke="#A96861" strokeWidth={1.5} dot={{ r: 3, fill: '#A96861' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
