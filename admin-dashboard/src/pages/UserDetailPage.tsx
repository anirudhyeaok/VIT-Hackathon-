import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Mail, Phone, Eye, EyeOff } from 'lucide-react';
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
        .catch(() => {
          addToast("Failed to fetch user dossier.", "error");
          setLoading(false);
        });
    }
  }, [id, addToast]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <div className="p-8 text-center text-[#6B706A]">User profile not found.</div>;

  const maskPhone = (phone: string) => phone.substring(0, phone.length - 4).replace(/./g, 'X') + phone.substring(phone.length - 4);
  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name.substring(0, 2)}***@${domain}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/admin/users')} 
          className="flex items-center text-xs font-medium text-[#6B706A] hover:text-[#30332F] transition-colors"
        >
          <ArrowLeft size={14} className="mr-1.5" /> Back to Registry
        </button>
        <button 
          onClick={() => setRevealSensitive(!revealSensitive)}
          className="flex items-center text-xs text-[#6B706A] hover:text-[#30332F] bg-white border border-[#DCDDD7] px-3 py-1.5 rounded-lg shadow-xs transition-colors"
        >
          {revealSensitive ? <EyeOff size={14} className="mr-1.5 text-[#5F7563]"/> : <Eye size={14} className="mr-1.5 text-[#5F7563]"/>}
          {revealSensitive ? 'Mask Sensitive Data' : 'Reveal Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-[#DCDDD7] p-5 shadow-xs lg:col-span-1">
          <div className="flex flex-col items-center text-center pb-5 border-b border-[#DCDDD7]">
            <div className="w-16 h-16 bg-[#E3EAE3] text-[#526A57] rounded-xl flex items-center justify-center text-2xl font-bold mb-3 border border-[#DCDDD7]">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-base font-bold text-[#30332F]">{user.name}</h2>
            <p className="text-xs text-[#6B706A] mt-0.5">{user.occupation}</p>
          </div>
          <div className="pt-4 space-y-3">
            <div className="flex items-center text-xs text-[#30332F]">
              <Phone className="w-4 h-4 mr-2.5 text-[#8A8F89]" /> 
              {revealSensitive ? user.phone : maskPhone(user.phone || '+910000000000')}
            </div>
            <div className="flex items-center text-xs text-[#30332F]">
              <Mail className="w-4 h-4 mr-2.5 text-[#8A8F89]" /> 
              {revealSensitive ? user.email : maskEmail(user.email)}
            </div>
            <div className="flex items-center text-xs text-[#30332F]">
              <Briefcase className="w-4 h-4 mr-2.5 text-[#8A8F89]" /> 
              {user.platforms.length} Platforms Linked
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#DCDDD7] p-5 shadow-xs lg:col-span-2">
          <h3 className="text-sm font-bold text-[#30332F] mb-4">Resilience Evaluation Factor Breakdown</h3>
          <div className="mb-4 flex items-baseline">
            <span className="text-4xl font-extrabold text-[#30332F] mr-2">{user.resilienceScore}</span>
            <span className="text-xs text-[#6B706A]">/ 100 aggregated benchmark</span>
          </div>
          <ScoreBar label="Liquid Buffer & Emergency Health" score={user.components.financial} />
          <ScoreBar label="Cross-Platform Work Consistency" score={user.components.work} />
          <ScoreBar label="Contract Diversity & Redundancy" score={user.components.platform} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-[#DCDDD7] p-5 shadow-xs">
          <h3 className="text-sm font-bold text-[#30332F] mb-1">Aggregated Earnings History</h3>
          <p className="text-xs text-[#6B706A] mb-3">Daily gross payout across all linked contracts (Last 28 Days)</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={user.recentEarnings} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEBE6" />
                <XAxis dataKey="date" tick={{ fill: '#6B706A', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6B706A', fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any) => [`₹${value}`, 'Earnings']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCDDD7', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#5F7563" strokeWidth={2} dot={{ r: 3, fill: '#5F7563' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#DCDDD7] p-5 shadow-xs">
          <h3 className="text-sm font-bold text-[#30332F] mb-1">Active Advances & Grace Records</h3>
          <p className="text-xs text-[#6B706A] mb-3">5-day grace status and current advance history</p>
          {user.activeLoans.map((loan: any) => (
            <div key={loan.id} className="p-3.5 border border-[#DCDDD7] bg-[#F9F9F7] rounded-lg mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-xs text-[#30332F]">Loan ID #{loan.id}</span>
                <StatusBadge status={loan.status} type="loan" />
              </div>
              <p className="text-xl font-bold text-[#30332F]">₹ {loan.amount.toLocaleString('en-IN')}</p>
            </div>
          ))}
          
          <h4 className="font-semibold text-[10px] uppercase tracking-wider text-[#6B706A] mt-4 mb-2">Prescribed Decision Guidance</h4>
          <ul className="space-y-1.5 text-xs text-[#30332F]">
            {user.recommendations.map((rec: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#5F7563]">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
