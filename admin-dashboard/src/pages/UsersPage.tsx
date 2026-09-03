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
      .catch((err) => {
        addToast("Failed to fetch users.", "error");
        setLoading(false);
      });
  }, [addToast]);

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name.substring(0, 2)}***@${domain}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setRevealSensitive(!revealSensitive)}
            className="flex items-center text-sm text-gray-600 hover:text-primary-600 bg-white border border-gray-200 px-3 py-1.5 rounded-md shadow-sm"
          >
            {revealSensitive ? <EyeOff size={16} className="mr-2"/> : <Eye size={16} className="mr-2"/>}
            {revealSensitive ? 'Mask Data' : 'Reveal Data'}
          </button>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden p-0 min-h-[300px]">
        {loading ? (
          <div className="p-8 space-y-4">
            <div className="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Occupation</th>
                  <th className="px-6 py-4">Linked Platforms</th>
                  <th className="px-6 py-4">Resilience Score</th>
                  <th className="px-6 py-4">Active Loans</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} onClick={() => navigate(`/admin/users/${user.id}`)} className="border-b hover:bg-gray-50 cursor-pointer transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-gray-500 text-xs">
                        {revealSensitive ? user.email : maskEmail(user.email)}
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.occupation}</td>
                    <td className="px-6 py-4 font-medium">{user.platforms}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${user.resilienceScore >= 70 ? 'text-green-600' : user.resilienceScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {user.resilienceScore}
                      </span>
                    </td>
                    <td className="px-6 py-4">{user.activeLoans}</td>
                    <td className="px-6 py-4"><StatusBadge status={user.status} type="loan" /></td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No users found.</td>
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
