import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Activity, Wallet, Lightbulb } from 'lucide-react';

const UserPortalPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
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
    <div className="min-h-screen bg-[#F6F6F3]">
      <header className="bg-white border-b border-[#DCDDD7] px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#30332F]">Welcome back, {user.name}</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-[#6B706A] hover:text-[#30332F] font-medium"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-[#DCDDD7] p-6 shadow-sm flex flex-col">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-[#EFF2EA] rounded-full flex items-center justify-center mr-4">
                <User className="text-[#5F7563] w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#30332F]">{user.name}</h2>
                <p className="text-sm text-[#6B706A]">{user.email}</p>
                <p className="text-sm text-[#8A8F89] mt-1">Occupation: Ride-share Driver</p>
              </div>
            </div>
            
            <div className="mt-auto">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-[#6B706A]">Resilience Score</span>
                <span className="text-lg font-bold text-[#5F7563]">78<span className="text-sm font-normal text-[#8A8F89]">/100</span></span>
              </div>
              <div className="w-full bg-[#F0F1EC] rounded-full h-2">
                <div className="bg-[#5F7563] h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>

          {/* Platform Connections */}
          <div className="bg-white rounded-xl border border-[#DCDDD7] p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#30332F] mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-[#5F7563]" />
              Platform Connections
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <span className="text-[#30332F] font-medium">Uber</span>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[#5F7563] rounded-full mr-2"></span>
                  <span className="text-sm text-[#6B706A]">Active</span>
                </div>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[#30332F] font-medium">Swiggy</span>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[#5F7563] rounded-full mr-2"></span>
                  <span className="text-sm text-[#6B706A]">Active</span>
                </div>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[#30332F] font-medium">Zomato</span>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[#A78655] rounded-full mr-2"></span>
                  <span className="text-sm text-[#6B706A]">Syncing</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Active Loans Card */}
          <div className="bg-white rounded-xl border border-[#DCDDD7] p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#30332F] mb-4 flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-[#5F7563]" />
              Active Loans
            </h3>
            <div className="bg-[#F8EDEB] border border-[#A96861]/30 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-[#6B706A]">Current Balance</p>
                  <p className="text-xl font-bold text-[#30332F]">₹5,000</p>
                </div>
                <div className="bg-[#A96861] text-white text-xs font-bold px-2 py-1 rounded">
                  Grace Period
                </div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#6B706A]">Grace Deadline: 2026-09-10</span>
                  <span className="text-[#A96861] font-medium">5 days remaining</span>
                </div>
                <div className="w-full bg-white rounded-full h-1.5">
                  <div className="bg-[#A96861] h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Tips Card */}
          <div className="bg-white rounded-xl border border-[#DCDDD7] p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#30332F] mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-[#5F7563]" />
              Financial Tips
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5F7563] mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-[#30332F] text-sm">Diversify platform income</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5F7563] mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-[#30332F] text-sm">Build emergency fund of ₹10,000</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5F7563] mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-[#30332F] text-sm">Track fuel expenses weekly</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPortalPage;
