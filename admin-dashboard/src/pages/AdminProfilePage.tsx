import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Clock, Settings, LogOut, Mail, Briefcase } from 'lucide-react';

const AdminProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between pb-6 border-b border-[#DCDDD7] dark:border-[#3A3D3A]">
        <div>
          <h1 className="text-xl font-bold text-[#30332F] dark:text-[#E5E7E3]">Admin Profile</h1>
          <p className="text-xs text-[#6B706A] dark:text-[#A3A8A2] mt-1">Account settings and session information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-[#242624] rounded-xl border border-[#DCDDD7] dark:border-[#3A3D3A] p-6 shadow-sm text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#E3EAE3] dark:bg-[#2E302E] text-[#526A57] dark:text-[#5F7563] flex items-center justify-center text-2xl font-bold mx-auto border-2 border-[#DCDDD7] dark:border-[#3A3D3A]">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#30332F] dark:text-[#E5E7E3]">{user.name}</h2>
              <p className="text-xs text-[#6B706A] dark:text-[#A3A8A2] mt-0.5">Operations Manager</p>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#62806A]"></span>
              <span className="text-xs font-medium text-[#62806A]">Online</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-2 px-4 py-2 rounded-lg text-xs font-medium text-[#A96861] bg-[#F8EDEB] dark:bg-[#3A2A28] hover:bg-[#F0DCD8] border border-[#DCDDD7] dark:border-[#3A3D3A] transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Account Information */}
          <div className="bg-white dark:bg-[#242624] rounded-xl border border-[#DCDDD7] dark:border-[#3A3D3A] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#30332F] dark:text-[#E5E7E3] flex items-center gap-2">
              <User size={16} className="text-[#5F7563]" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[11px] text-[#8A8F89] dark:text-[#7A7F79] uppercase tracking-wider font-semibold">Full Name</p>
                <p className="text-sm text-[#30332F] dark:text-[#E5E7E3] font-medium">{user.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#8A8F89] dark:text-[#7A7F79] uppercase tracking-wider font-semibold">Email</p>
                <p className="text-sm text-[#30332F] dark:text-[#E5E7E3] font-medium flex items-center gap-1.5">
                  <Mail size={13} className="text-[#6B706A]" />
                  {user.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#8A8F89] dark:text-[#7A7F79] uppercase tracking-wider font-semibold">Role</p>
                <p className="text-sm text-[#30332F] dark:text-[#E5E7E3] font-medium flex items-center gap-1.5">
                  <Briefcase size={13} className="text-[#6B706A]" />
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#8A8F89] dark:text-[#7A7F79] uppercase tracking-wider font-semibold">Department</p>
                <p className="text-sm text-[#30332F] dark:text-[#E5E7E3] font-medium">Financial Operations</p>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white dark:bg-[#242624] rounded-xl border border-[#DCDDD7] dark:border-[#3A3D3A] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#30332F] dark:text-[#E5E7E3] flex items-center gap-2">
              <Shield size={16} className="text-[#5F7563]" />
              Permissions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Dashboard Access', 'Loan Management', 'User Management', 'Analytics View', 'Workflow Control', 'Consent Registry'].map(perm => (
                <div key={perm} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#E9EFEA] dark:bg-[#2E302E] border border-[#DCDDD7] dark:border-[#3A3D3A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#62806A]"></span>
                  <span className="text-xs font-medium text-[#526A57] dark:text-[#A3A8A2]">{perm}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white dark:bg-[#242624] rounded-xl border border-[#DCDDD7] dark:border-[#3A3D3A] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#30332F] dark:text-[#E5E7E3] flex items-center gap-2">
              <Clock size={16} className="text-[#5F7563]" />
              Session Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[11px] text-[#8A8F89] dark:text-[#7A7F79] uppercase tracking-wider font-semibold">Session Started</p>
                <p className="text-sm text-[#30332F] dark:text-[#E5E7E3] font-medium font-mono">{new Date().toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#8A8F89] dark:text-[#7A7F79] uppercase tracking-wider font-semibold">Auth Method</p>
                <p className="text-sm text-[#30332F] dark:text-[#E5E7E3] font-medium">Demo Account (Local)</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#8A8F89] dark:text-[#7A7F79] uppercase tracking-wider font-semibold">Environment</p>
                <span className="inline-flex text-[11px] font-medium text-[#A78655] bg-[#F6EFE5] dark:bg-[#3A3324] px-2.5 py-1 rounded-md border border-[#DCDDD7] dark:border-[#3A3D3A]">
                  Development
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#8A8F89] dark:text-[#7A7F79] uppercase tracking-wider font-semibold">Platform Version</p>
                <p className="text-sm text-[#30332F] dark:text-[#E5E7E3] font-medium font-mono">v1.0.0-hackathon</p>
              </div>
            </div>
          </div>

          {/* System Preferences */}
          <div className="bg-white dark:bg-[#242624] rounded-xl border border-[#DCDDD7] dark:border-[#3A3D3A] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#30332F] dark:text-[#E5E7E3] flex items-center gap-2">
              <Settings size={16} className="text-[#5F7563]" />
              Preferences
            </h3>
            <div className="space-y-3 text-xs text-[#6B706A] dark:text-[#A3A8A2]">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F9F9F7] dark:bg-[#2E302E] border border-[#DCDDD7] dark:border-[#3A3D3A]">
                <span className="font-medium text-[#30332F] dark:text-[#E5E7E3]">Email Notifications</span>
                <span className="text-[#62806A] font-semibold">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F9F9F7] dark:bg-[#2E302E] border border-[#DCDDD7] dark:border-[#3A3D3A]">
                <span className="font-medium text-[#30332F] dark:text-[#E5E7E3]">Auto-sync Interval</span>
                <span className="font-semibold text-[#30332F] dark:text-[#E5E7E3]">Every 6 hours</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F9F9F7] dark:bg-[#2E302E] border border-[#DCDDD7] dark:border-[#3A3D3A]">
                <span className="font-medium text-[#30332F] dark:text-[#E5E7E3]">Timezone</span>
                <span className="font-semibold text-[#30332F] dark:text-[#E5E7E3]">IST (UTC+5:30)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
