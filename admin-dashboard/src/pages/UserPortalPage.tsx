import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User, Activity, Wallet, Lightbulb, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react';

const UserPortalPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F6F6F3] dark:bg-[#1A1C1A] text-[#30332F] dark:text-[#E5E7E3] transition-colors">
      {/* Top Header */}
      <header className="bg-white dark:bg-[#242624] border-b border-[#DCDDD7] dark:border-[#3A3D3A] px-6 py-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#5F7563] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              GW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[#30332F] dark:text-[#E5E7E3]">Gig Worker Portal</h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E9EFEA] text-[#526A57] dark:bg-[#2E3A2E] dark:text-[#7AA37F] border border-[#DCDDD7] dark:border-[#3A3D3A]">
                  Active Worker
                </span>
              </div>
              <p className="text-xs text-[#6B706A] dark:text-[#7A7F79]">Signed in as {user.name} ({user.email})</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Link to Admin Dashboard */}
            <Link
              to="/admin"
              className="px-3.5 py-1.5 rounded-lg bg-[#5F7563] hover:bg-[#4D6151] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Admin Operations</span>
              <ArrowRight size={14} />
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[#F0F1EC] dark:hover:bg-[#2E302E] transition-colors text-[#6B706A] dark:text-[#A3A8A2]"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-[#F8EDEB] dark:hover:bg-[#3A2A28] text-[#6B706A] dark:text-[#A3A8A2] hover:text-[#A96861] transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Quick Navigation Banner to explore other parts of the app */}
        <div className="p-4 rounded-xl bg-[#E9EFEA] dark:bg-[#263126] border border-[#5F7563]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#5F7563] text-white flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#30332F] dark:text-[#E5E7E3]">Looking for full system controls & analytics?</p>
              <p className="text-[11px] text-[#526A57] dark:text-[#7AA37F]">You have full access to view Overview, Loans, Workflows, and User Management.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/loans"
              className="px-3 py-1.5 rounded-md bg-white dark:bg-[#242624] text-xs font-medium text-[#30332F] dark:text-[#E5E7E3] border border-[#DCDDD7] dark:border-[#3A3D3A] hover:bg-[#F9F9F7]"
            >
              Loan Funnel
            </Link>
            <Link
              to="/admin/workflows"
              className="px-3 py-1.5 rounded-md bg-white dark:bg-[#242624] text-xs font-medium text-[#30332F] dark:text-[#E5E7E3] border border-[#DCDDD7] dark:border-[#3A3D3A] hover:bg-[#F9F9F7]"
            >
              Workflows
            </Link>
            <Link
              to="/admin"
              className="px-3 py-1.5 rounded-md bg-[#5F7563] text-xs font-medium text-white hover:bg-[#4D6151]"
            >
              Overview →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-[#242624] rounded-xl border border-[#DCDDD7] dark:border-[#3A3D3A] p-6 shadow-sm flex flex-col">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-[#EFF2EA] dark:bg-[#2E3A2E] rounded-full flex items-center justify-center mr-4 text-[#5F7563] dark:text-[#7AA37F]">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#30332F] dark:text-[#E5E7E3]">{user.name}</h2>
                <p className="text-xs text-[#6B706A] dark:text-[#A3A8A2]">{user.email}</p>
                <p className="text-xs text-[#8A8F89] dark:text-[#7A7F79] mt-0.5">Occupation: Ride-share & Delivery Partner</p>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-[#DCDDD7] dark:border-[#3A3D3A]">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-medium text-[#6B706A] dark:text-[#A3A8A2]">Resilience Score</span>
                <span className="text-lg font-bold text-[#5F7563] dark:text-[#7AA37F]">78<span className="text-xs font-normal text-[#8A8F89] dark:text-[#7A7F79]">/100</span></span>
              </div>
              <div className="w-full bg-[#F0F1EC] dark:bg-[#2E302E] rounded-full h-2">
                <div className="bg-[#5F7563] dark:bg-[#7AA37F] h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>

          {/* Platform Connections */}
          <div className="bg-white dark:bg-[#242624] rounded-xl border border-[#DCDDD7] dark:border-[#3A3D3A] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#30332F] dark:text-[#E5E7E3] mb-4 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-[#5F7563] dark:text-[#7AA37F]" />
              Platform Connections
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#2E302E] border border-[#DCDDD7] dark:border-[#3A3D3A]">
                <span className="text-[#30332F] dark:text-[#E5E7E3] font-medium">Uber</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#62806A] rounded-full"></span>
                  <span className="text-[#62806A] font-semibold">Active</span>
                </div>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#2E302E] border border-[#DCDDD7] dark:border-[#3A3D3A]">
                <span className="text-[#30332F] dark:text-[#E5E7E3] font-medium">Swiggy</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#62806A] rounded-full"></span>
                  <span className="text-[#62806A] font-semibold">Active</span>
                </div>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#2E302E] border border-[#DCDDD7] dark:border-[#3A3D3A]">
                <span className="text-[#30332F] dark:text-[#E5E7E3] font-medium">Zomato</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#A78655] rounded-full"></span>
                  <span className="text-[#A78655] font-semibold">Syncing</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Active Loans Card */}
          <div className="bg-white dark:bg-[#242624] rounded-xl border border-[#DCDDD7] dark:border-[#3A3D3A] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#30332F] dark:text-[#E5E7E3] mb-4 flex items-center">
              <Wallet className="w-4 h-4 mr-2 text-[#5F7563] dark:text-[#7AA37F]" />
              Active Advances
            </h3>
            <div className="bg-[#F6EFE5] dark:bg-[#332B1E] border border-[#DCDDD7] dark:border-[#3A3D3A] rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] text-[#8A8F89] dark:text-[#A3A8A2] uppercase tracking-wider font-semibold">Current Balance</p>
                  <p className="text-2xl font-bold text-[#30332F] dark:text-[#E5E7E3] mt-0.5">₹5,000</p>
                </div>
                <span className="bg-[#A78655] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  5-Day Grace Period
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B706A] dark:text-[#A3A8A2]">Grace Deadline: 2026-09-10</span>
                  <span className="text-[#A78655] font-semibold">5 days remaining</span>
                </div>
                <div className="w-full bg-white dark:bg-[#242624] rounded-full h-1.5">
                  <div className="bg-[#A78655] h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-[11px] text-[#6B706A] dark:text-[#A3A8A2] pt-1">Zero auto-deductions. Repay at your convenience before deadline.</p>
              </div>
            </div>
          </div>

          {/* Financial Tips Card */}
          <div className="bg-white dark:bg-[#242624] rounded-xl border border-[#DCDDD7] dark:border-[#3A3D3A] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#30332F] dark:text-[#E5E7E3] mb-4 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-[#5F7563] dark:text-[#7AA37F]" />
              Safe-to-Save Recommendations
            </h3>
            <ul className="space-y-2.5 text-xs text-[#6B706A] dark:text-[#A3A8A2]">
              <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#2E302E] border border-[#DCDDD7] dark:border-[#3A3D3A]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5F7563] mt-1.5 shrink-0"></div>
                <span className="text-[#30332F] dark:text-[#E5E7E3]">Diversify platform income across Uber & Swiggy for surge bonuses.</span>
              </li>
              <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#2E302E] border border-[#DCDDD7] dark:border-[#3A3D3A]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5F7563] mt-1.5 shrink-0"></div>
                <span className="text-[#30332F] dark:text-[#E5E7E3]">Build emergency buffer of ₹10,000 (currently at ₹5,000).</span>
              </li>
              <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#2E302E] border border-[#DCDDD7] dark:border-[#3A3D3A]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5F7563] mt-1.5 shrink-0"></div>
                <span className="text-[#30332F] dark:text-[#E5E7E3]">Track daily fuel expenses to prevent variance penalties.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPortalPage;
