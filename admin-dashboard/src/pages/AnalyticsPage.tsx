import { useState, useEffect } from 'react';
import { getAnalytics } from '../services/api';
import { useToast } from '../components/Toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

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
      .catch(err => {
        addToast("Failed to load analytics data.", "error");
        setLoading(false);
      });
  }, [addToast]);

  if (loading) return (
    <div className="p-8 space-y-6">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded animate-pulse w-full"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {[1,2,3,4].map(i => <div key={i} className="h-[300px] bg-gray-200 rounded animate-pulse w-full"></div>)}
      </div>
    </div>
  );

  const platformHealthData = [
    { name: 'Linked', value: 850 },
    { name: 'Stale', value: 120 },
    { name: 'Broken', value: 30 }
  ];
  const HEALTH_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const consistencyData = [
    { name: 'Multi-platform', score: 85 },
    { name: 'Single-platform', score: 60 },
    { name: 'New Users', score: 45 }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Platform Analytics</h1>

      {/* Usability KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="card border-t-4 border-t-primary-500">
          <p className="text-gray-500 text-sm font-medium mb-1">Task Completion Rate</p>
          <h3 className="text-2xl font-bold text-gray-900">{data.usability.taskCompletionRate}%</h3>
          <p className="text-xs text-green-600 mt-1">↑ 5% this week</p>
        </div>
        <div className="card border-t-4 border-t-teal-500">
          <p className="text-gray-500 text-sm font-medium mb-1">Recommendation Uptake</p>
          <h3 className="text-2xl font-bold text-gray-900">{data.usability.recommendationUptake}%</h3>
          <p className="text-xs text-gray-500 mt-1">Actions accepted</p>
        </div>
        <div className="card border-t-4 border-t-indigo-500">
          <p className="text-gray-500 text-sm font-medium mb-1">Avg Resilience Score</p>
          <h3 className="text-2xl font-bold text-gray-900">{data.stats.avgScore} / 100</h3>
          <p className="text-xs text-gray-500 mt-1">Across all users</p>
        </div>
        <div className="card border-t-4 border-t-red-500">
          <p className="text-gray-500 text-sm font-medium mb-1">Active vs Blocked</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {data.usability.activeUsers} <span className="text-gray-400 text-lg">/</span> {data.usability.blockedUsers}
          </h3>
          <p className="text-xs text-gray-500 mt-1">Users ratio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HERO: Platform Health */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Platform Health Dashboard</h3>
          <p className="text-sm text-gray-500 mb-4">Status of API connections across all linked platforms</p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={platformHealthData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {platformHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={HEALTH_COLORS[index % HEALTH_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-sm">
            {platformHealthData.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: HEALTH_COLORS[index] }}></div>
                <span>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* HERO: Consistency */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Cross-Platform Consistency Analytics</h3>
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consistencyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value}/100`, 'Consistency Score']} />
                <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Tracking: Screens & Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Event Tracking Summary</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Most Viewed Screens</h4>
              {data.usability.mostViewedScreens.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-600">{item.screen}</span>
                  <span className="font-semibold">{item.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Common Actions</h4>
              {data.usability.commonActions.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-600">{item.action}</span>
                  <span className="font-semibold">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error Rates */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">System Error Rate</h3>
          <p className="text-sm text-gray-500 mb-4">Percentage of failed actions/requests per day</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.usability.errorRates}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Error Rate']} />
                <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;
