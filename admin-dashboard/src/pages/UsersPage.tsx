import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, EyeOff } from 'lucide-react';
import { getUsers } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [revealSensitive, setRevealSensitive] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    getUsers()
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        addToast("Failed to fetch user directory.", "error");
        setLoading(false);
      });
  }, [addToast]);

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name.substring(0, 2)}***@${domain}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#30332F]">Gig Worker Registry</h1>
          <p className="text-xs text-[#6B706A] mt-0.5">Active worker profiles, multi-platform integrations, and resilience ratings.</p>
        </div>
        <div className="flex gap-2.5 items-center w-full sm:w-auto">
          <button 
            onClick={() => setRevealSensitive(!revealSensitive)}
            className="flex items-center text-xs text-[#6B706A] hover:text-[#30332F] bg-white border border-[#DCDDD7] px-3 py-1.5 rounded-lg shadow-xs transition-colors shrink-0"
          >
            {revealSensitive ? <EyeOff size={14} className="mr-1.5 text-[#5F7563]"/> : <Eye size={14} className="mr-1.5 text-[#5F7563]"/>}
            {revealSensitive ? 'Mask PII' : 'Reveal PII'}
          </button>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search size={14} className="text-[#8A8F89]" />
            </div>
            <input
              type="text"
              className="pl-8 pr-3 py-1.5 border border-[#DCDDD7] bg-white rounded-lg text-xs text-[#30332F] placeholder-[#8A8F89] focus:outline-none focus:border-[#5F7563] block w-full"
              placeholder="Search by worker name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#DCDDD7] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            <div className="h-8 bg-[#F0F1EC] rounded animate-pulse w-full"></div>
            <div className="h-8 bg-[#F0F1EC] rounded animate-pulse w-full"></div>
            <div className="h-8 bg-[#F0F1EC] rounded animate-pulse w-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-[#6B706A]">
              <thead className="text-[11px] text-[#6B706A] uppercase bg-[#F0F1EC] border-b border-[#DCDDD7]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Beneficiary Name</th>
                  <th className="px-5 py-3 font-semibold">Primary Occupation</th>
                  <th className="px-5 py-3 font-semibold">Integrated Platforms</th>
                  <th className="px-5 py-3 font-semibold">Resilience Score</th>
                  <th className="px-5 py-3 font-semibold">Active EWA Loans</th>
                  <th className="px-5 py-3 font-semibold">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCDDD7]">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    onClick={() => navigate(`/admin/users/${user.id}`)} 
                    className="hover:bg-[#F9F9F7] cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[#30332F]">{user.name}</div>
                      <div className="text-[#8A8F89] text-[11px] font-mono mt-0.5">
                        {revealSensitive ? user.email : maskEmail(user.email)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#30332F]">{user.occupation}</td>
                    <td className="px-5 py-3.5 font-medium text-[#30332F]">{user.platforms}</td>
                    <td className="px-5 py-3.5 font-bold">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        user.resilienceScore >= 70 
                          ? 'bg-[#E9EFEA] text-[#62806A] border border-[#DCDDD7]' 
                          : user.resilienceScore >= 40 
                          ? 'bg-[#F6EFE5] text-[#A78655] border border-[#DCDDD7]' 
                          : 'bg-[#F8EDEB] text-[#A96861] border border-[#DCDDD7]'
                      }`}>
                        {user.resilienceScore} / 100
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-[#30332F]">{user.activeLoans}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={user.status} type="loan" />
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#6B706A]">No worker records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
