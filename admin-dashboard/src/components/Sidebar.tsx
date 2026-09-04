import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, BarChart2, ShieldCheck, Zap, Circle, LogOut, Sun, Moon, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={19} />, label: 'Overview' },
    { path: '/admin/users', icon: <Users size={19} />, label: 'Gig Workers' },
    { path: '/admin/loans', icon: <CreditCard size={19} />, label: 'Loan Recovery' },
    { path: '/admin/analytics', icon: <BarChart2 size={19} />, label: 'Analytics' },
    { path: '/admin/consents', icon: <ShieldCheck size={19} />, label: 'AA Consents' },
    { path: '/admin/workflows', icon: <Zap size={19} />, label: 'Workflows' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD';

  return (
    <aside className="w-64 bg-[#F3F4F0] dark:bg-[#1E201E] text-[#59605A] dark:text-[#A3A8A2] border-r border-[#DCDDD7] dark:border-[#3A3D3A] flex flex-col hidden md:flex shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-[#DCDDD7] dark:border-[#3A3D3A] justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#5F7563] flex items-center justify-center text-white shadow-sm">
            <CreditCard size={16} />
          </div>
          <div>
            <span className="text-base font-bold text-[#30332F] dark:text-[#E5E7E3] tracking-tight">GigWallet</span>
            <p className="text-[11px] text-[#6B706A] dark:text-[#7A7F79]">Financial Operations</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg hover:bg-[#EAECE6] dark:hover:bg-[#2E302E] transition-colors text-[#6B706A] dark:text-[#A3A8A2]"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="px-4 py-8 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8F89] dark:text-[#7A7F79] px-3 mb-4">
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
                    ? 'bg-[#E3EAE3] dark:bg-[#2E3A2E] text-[#526A57] dark:text-[#7AA37F] font-semibold border border-[#DCDDD7] dark:border-[#3A3D3A]'
                    : 'text-[#59605A] dark:text-[#A3A8A2] hover:text-[#30332F] dark:hover:text-[#E5E7E3] hover:bg-[#EAECE6] dark:hover:bg-[#2E302E]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="opacity-80">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.path === '/admin/workflows' && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-[#2E302E] text-[#6B706A] dark:text-[#A3A8A2] border border-[#DCDDD7] dark:border-[#3A3D3A]">
                  6
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer: Platform Status + User Info */}
      <div className="p-5 border-t border-[#DCDDD7] dark:border-[#3A3D3A] space-y-4">
        <div className="flex items-center justify-between text-xs text-[#6B706A] dark:text-[#A3A8A2] px-1">
          <div className="flex items-center gap-2">
            <Circle size={8} className="fill-[#62806A] text-[#62806A]" />
            <span>Platform Links</span>
          </div>
          <span className="font-semibold text-[#30332F] dark:text-[#E5E7E3]">4 Syncing</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#DCDDD7]/60 dark:border-[#3A3D3A]/60">
          <NavLink
            to="/admin/profile"
            className="flex items-center gap-3 group cursor-pointer flex-1 min-w-0"
          >
            <div className="w-8 h-8 rounded-full bg-[#E3EAE3] dark:bg-[#2E3A2E] text-[#526A57] dark:text-[#7AA37F] flex items-center justify-center text-xs font-bold border border-[#DCDDD7] dark:border-[#3A3D3A]">
              {initials}
            </div>
            <div className="truncate flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#30332F] dark:text-[#E5E7E3] truncate group-hover:text-[#526A57] dark:group-hover:text-[#7AA37F] transition-colors">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[11px] text-[#6B706A] dark:text-[#7A7F79]">
                {user?.role === 'admin' ? 'Ops Manager' : 'User'}
              </p>
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-[#F8EDEB] dark:hover:bg-[#3A2A28] text-[#6B706A] dark:text-[#A3A8A2] hover:text-[#A96861] transition-colors shrink-0"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
