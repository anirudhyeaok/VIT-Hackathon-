import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, BarChart2, ShieldCheck, Zap, Circle } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={19} />, label: 'Overview' },
    { path: '/admin/users', icon: <Users size={19} />, label: 'Gig Workers' },
    { path: '/admin/loans', icon: <CreditCard size={19} />, label: 'Loan Recovery' },
    { path: '/admin/analytics', icon: <BarChart2 size={19} />, label: 'Analytics' },
    { path: '/admin/consents', icon: <ShieldCheck size={19} />, label: 'AA Consents' },
    { path: '/admin/workflows', icon: <Zap size={19} />, label: 'Workflows' },
  ];

  return (
    <aside className="w-64 bg-[#F3F4F0] text-[#59605A] border-r border-[#DCDDD7] flex flex-col hidden md:flex shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-[#DCDDD7] justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#5F7563] flex items-center justify-center text-white shadow-xs">
            <CreditCard size={16} />
          </div>
          <div>
            <span className="text-base font-bold text-[#30332F] tracking-tight">GigWallet</span>
            <p className="text-[11px] text-[#6B706A]">Financial Operations</p>
          </div>
        </div>
      </div>

      {/* Main Navigation with Generous Spacing */}
      <div className="px-4 py-8 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8F89] px-3 mb-4">
          Navigation
        </p>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-[#E3EAE3] text-[#526A57] font-semibold border border-[#DCDDD7]'
                    : 'text-[#59605A] hover:text-[#30332F] hover:bg-[#EAECE6]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="opacity-80">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.path === '/admin/workflows' && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-[#6B706A] border border-[#DCDDD7]">
                  6
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Spacious Clean System Status Footer */}
      <div className="p-5 border-t border-[#DCDDD7] space-y-4">
        <div className="flex items-center justify-between text-xs text-[#6B706A] px-1">
          <div className="flex items-center gap-2">
            <Circle size={8} className="fill-[#62806A] text-[#62806A]" />
            <span>Platform Links</span>
          </div>
          <span className="font-semibold text-[#30332F]">4 Syncing</span>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-[#DCDDD7]/60">
          <div className="w-8 h-8 rounded-full bg-[#E3EAE3] text-[#526A57] flex items-center justify-center text-xs font-bold border border-[#DCDDD7]">
            AR
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-[#30332F] truncate">Arvind Ramakrishnan</p>
            <p className="text-[11px] text-[#6B706A]">Ops Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
