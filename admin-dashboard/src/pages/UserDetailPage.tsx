import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Briefcase, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { getUserById } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ScoreBar from '../components/ScoreBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserDetailPage = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [revealSensitive, setRevealSensitive] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (id) {
      getUserById(id)
        .then(res => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(err => {
          addToast("Failed to fetch user details.", "error");
          setLoading(false);
        });
    }
  }, [id, addToast]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <div className="p-8 text-center text-gray-500">User not found</div>;

  const maskPhone = (phone: string) => phone.substring(0, phone.length - 4).replace(/./g, 'X') + phone.substring(phone.length - 4);
  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name.substring(0, 2)}***@${domain}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate('/admin/users')} className="flex items-center text-gray-600 hover:text-primary-600 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Users
        </button>
        <button 
          onClick={() => setRevealSensitive(!revealSensitive)}
          className="flex items-center text-sm text-gray-600 hover:text-primary-600 bg-white border border-gray-200 px-3 py-1.5 rounded-md shadow-sm"
        >
          {revealSensitive ? <EyeOff size={16} className="mr-2"/> : <Eye size={16} className="mr-2"/>}
          {revealSensitive ? 'Mask Sensitive Data' : 'Reveal Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1">
          <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
            <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500">{user.occupation}</p>
          </div>
          <div className="pt-6 space-y-4">
            <div className="flex items-center text-sm">
              <Phone className="w-5 h-5 mr-3 text-gray-400" /> 
              {revealSensitive ? user.phone : maskPhone(user.phone || '+910000000000')}
            </div>
            <div className="flex items-center text-sm">
              <Mail className="w-5 h-5 mr-3 text-gray-400" /> 
              {revealSensitive ? user.email : maskEmail(user.email)}
            </div>
            <div className="flex items-center text-sm"><Briefcase className="w-5 h-5 mr-3 text-gray-400" /> {user.platforms.length} Platforms Linked</div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6">Resilience Score Breakdown</h3>
          <div className="mb-6 flex items-end">
            <span className="text-5xl font-bold text-gray-900 mr-2">{user.resilienceScore}</span>
            <span className="text-gray-500 mb-1">/ 100</span>
          </div>
          <ScoreBar label="Financial Health" score={user.components.financial} />
          <ScoreBar label="Work Consistency" score={user.components.work} />
          <ScoreBar label="Platform Diversity" score={user.components.platform} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Earnings (Last 28 Days)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={user.recentEarnings}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Active Loans & History</h3>
          {user.activeLoans.map((loan: any) => (
            <div key={loan.id} className="p-4 border border-gray-200 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">Loan #{loan.id}</span>
                <StatusBadge status={loan.status} type="loan" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹ {loan.amount.toLocaleString('en-IN')}</p>
            </div>
          ))}
          
          <h4 className="font-medium text-sm text-gray-500 mt-6 mb-3 uppercase">AI Recommendations</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {user.recommendations.map((rec: string, i: number) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
