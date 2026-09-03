import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, BarChart2, ShieldCheck, Zap, Activity } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={18} />, label: 'Overview' },
    { path: '/admin/users', icon: <Users size={18} />, label: 'Gig Workers' },
    { path: '/admin/loans', icon: <CreditCard size={18} />, label: 'Loan Recovery' },
    { path: '/admin/analytics', icon: <BarChart2 size={18} />, label: 'Consistency Analytics' },
    { path: '/admin/consents', icon: <ShieldCheck size={18} />, label: 'RBI AA Consents' },
    { path: '/admin/workflows', icon: <Zap size={18} />, label: 'n8n Workflows' },
  ];

  const platforms = [
    { name: 'Zomato', status: 'Active', statusColor: 'text-[#62806A]' },
    { name: 'Swiggy', status: 'Active', statusColor: 'text-[#62806A]' },
    { name: 'Uber', status: 'Active', statusColor: 'text-[#62806A]' },
    { name: 'Ola', status: 'Stale', statusColor: 'text-[#A78655]' },
  ];

  return (
    <aside className="w-64 bg-[#F3F4F0] text-[#59605A] border-r border-[#DCDDD7] flex flex-col hidden md:flex shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-[#DCDDD7] justify-between bg-[#F3F4F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#5F7563] flex items-center justify-center text-white">
            <CreditCard size={15} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-[#30332F] tracking-tight">GigWallet</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#E3EAE3] text-[#526A57] border border-[#DCDDD7]">
                OPS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-3 py-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B706A] px-3 mb-2">Operations</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#E3EAE3] text-[#526A57] font-semibold border border-[#DCDDD7]/60'
                    : 'text-[#59605A] hover:text-[#30332F] hover:bg-[#EAECE6]'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <span className="opacity-90">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.path === '/admin/workflows' && (
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#F0F1EC] text-[#6B706A] border border-[#DCDDD7]">
                  6 flows
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Multi-Platform Link Health Widget */}
      <div className="mt-auto px-3 py-3">
        <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#DCDDD7]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#5F7563]" />
              <span className="text-[11px] font-semibold text-[#30332F]">Platform Link Status</span>
            </div>
            <span className="text-[10px] font-medium text-[#62806A] bg-[#E9EFEA] px-1.5 py-0.5 rounded">
              3 of 4 Syncing
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {platforms.map((p) => (
              <div key={p.name} className="flex items-center justify-between bg-[#F6F6F3] px-2 py-1 rounded border border-[#DCDDD7]/70">
                <span className="text-[10px] text-[#30332F] font-medium">{p.name}</span>
                <span className={`text-[9px] font-semibold ${p.statusColor}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-3.5 border-t border-[#DCDDD7] flex items-center justify-between bg-[#F3F4F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#E3EAE3] text-[#526A57] flex items-center justify-center text-xs font-semibold border border-[#DCDDD7]">
            AR
          </div>
          <div>
            <p className="text-xs font-semibold text-[#30332F]">Arvind Ramakrishnan</p>
            <p className="text-[10px] text-[#6B706A]">Financial Operations</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
