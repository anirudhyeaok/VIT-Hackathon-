import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, BarChart2, ShieldCheck, Zap, Activity } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={19} />, label: 'Overview' },
    { path: '/admin/users', icon: <Users size={19} />, label: 'Gig Workers' },
    { path: '/admin/loans', icon: <CreditCard size={19} />, label: 'Loan Recovery' },
    { path: '/admin/analytics', icon: <BarChart2 size={19} />, label: 'Consistency Analytics' },
    { path: '/admin/consents', icon: <ShieldCheck size={19} />, label: 'RBI AA Consents' },
    { path: '/admin/workflows', icon: <Zap size={19} />, label: 'n8n Workflows' },
  ];

  const platforms = [
    { name: 'Zomato', status: 'Live', color: 'bg-emerald-500' },
    { name: 'Swiggy', status: 'Live', color: 'bg-emerald-500' },
    { name: 'Uber', status: 'Live', color: 'bg-emerald-500' },
    { name: 'Ola', status: 'Stale', color: 'bg-amber-500' },
  ];

  return (
    <aside className="w-72 bg-slate-950 text-slate-300 border-r border-slate-800/80 flex flex-col hidden md:flex shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/80 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-400 p-[2px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="text-teal-400 fill-teal-400" size={20} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white tracking-tight">GigWallet</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Financial Resilience Engine</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-4 py-6">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-3">Management</p>
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.path === '/admin/workflows' && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  n8n
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Multi-Platform Link Health Widget */}
      <div className="mt-auto px-4 py-4">
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-xs font-bold text-slate-200">Platform Sync Health</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">
              3/4 Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {platforms.map((p) => (
              <div key={p.name} className="flex items-center justify-between bg-slate-950/60 px-2 py-1.5 rounded-lg border border-slate-800/60">
                <span className="text-[11px] font-medium text-slate-300">{p.name}</span>
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${p.color} animate-pulse`} />
                  <span className="text-[10px] text-slate-400">{p.status}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-sm font-bold text-white border border-slate-700">
            AR
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Arvind Ramakrishnan</p>
            <p className="text-[10px] text-slate-300">VIT Hackathon Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
