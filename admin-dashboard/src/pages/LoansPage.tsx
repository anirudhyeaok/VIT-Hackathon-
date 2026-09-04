import { useState, useEffect } from 'react';
import { getLoans } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';

const LoansPage = () => {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { addToast } = useToast();

  useEffect(() => {
    getLoans()
      .then(res => {
        setLoans(res.data);
        setLoading(false);
      })
      .catch(() => {
        addToast("Failed to load loan portfolio data.", "error");
        setLoading(false);
      });
  }, [addToast]);

  const filteredLoans = filter === 'all' ? loans : loans.filter(l => l.status === filter);
  
  const tabs = [
    { id: 'all', label: 'All Records' },
    { id: 'disbursed', label: 'Disbursed' },
    { id: 'grace_period', label: 'Grace Period (5d)' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'rolled_over', label: 'Rolled Over' },
    { id: 'penalty_escalated', label: 'Penalty Escalated' },
  ];

  const pipeline = [
    { status: 'disbursed', label: 'Disbursed', count: loans.filter(l => l.status === 'disbursed').length, style: 'bg-[#F0F1EC] text-[#526A57] border-[#DCDDD7]' },
    { status: 'grace_period', label: '5-Day Grace', count: loans.filter(l => l.status === 'grace_period').length, style: 'bg-[#E9EFEA] text-[#526A57] border-[#5F7563]/50' },
    { status: 'overdue', label: 'Overdue', count: loans.filter(l => l.status === 'overdue').length, style: 'bg-[#F8EDEB] text-[#A96861] border-[#DCDDD7]' },
    { status: 'rolled_over', label: 'Rolled Over', count: loans.filter(l => l.status === 'rolled_over').length, style: 'bg-[#F6EFE5] text-[#A78655] border-[#DCDDD7]' },
    { status: 'penalty_escalated', label: 'Penalty (+5%)', count: loans.filter(l => l.status === 'penalty_escalated').length, style: 'bg-[#F8EDEB] text-[#A96861] border-[#DCDDD7]' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-xl font-bold text-[#30332F] dark:text-[#E5E7E3]">Loan Portfolio & Grace Management</h1>
        <p className="text-xs text-[#6B706A] dark:text-[#A3A8A2] mt-1">
          Escalation tracking: Disbursed wages maintain a 5-day grace window before rollover and account restrictions.
        </p>
      </div>

      {/* Escalation Funnel */}
      <div className="bg-white dark:bg-[#242624] rounded-xl border border-[#DCDDD7] dark:border-[#3A3D3A] p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B706A] mb-3">Portfolio Escalation Funnel</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3 overflow-x-auto pb-2">
          {pipeline.map((stage, idx) => (
            <div key={stage.status} className="flex-none flex items-center min-w-[150px]">
              <div 
                className={`w-full p-3.5 rounded-lg border ${stage.style} flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${filter === stage.status ? 'ring-2 ring-[#5F7563] ring-offset-1 font-semibold' : ''}`} 
                onClick={() => setFilter(stage.status)}
              >
                <span className="text-[10px] font-semibold tracking-wider uppercase opacity-90">{stage.label}</span>
                <span className="text-2xl font-bold mt-1 text-[#30332F]">{stage.count}</span>
              </div>
              {idx < pipeline.length - 1 && (
                <div className="hidden md:flex text-[#8A8F89] mx-1.5 flex-shrink-0 text-xs">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 border-b border-[#DCDDD7] overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`py-2 px-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              filter === tab.id 
                ? 'border-[#5F7563] text-[#526A57] font-semibold' 
                : 'border-transparent text-[#6B706A] hover:text-[#30332F] hover:border-[#DCDDD7]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#242624] rounded-xl border border-[#DCDDD7] dark:border-[#3A3D3A] shadow-xs overflow-hidden">
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
                  <th className="px-5 py-3 font-semibold">Loan ID</th>
                  <th className="px-5 py-3 font-semibold">Beneficiary</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Disbursed</th>
                  <th className="px-5 py-3 font-semibold">Grace Deadline</th>
                  <th className="px-5 py-3 font-semibold">Stage</th>
                  <th className="px-5 py-3 font-semibold">Risk Rating</th>
                  <th className="px-5 py-3 font-semibold">Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCDDD7]">
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-[#F9F9F7] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[#8A8F89]">#{loan.id}</td>
                    <td className="px-5 py-3.5 font-semibold text-[#30332F]">{loan.userName}</td>
                    <td className="px-5 py-3.5 font-bold text-[#30332F]">₹{loan.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5">{loan.disbursedDate}</td>
                    <td className="px-5 py-3.5 text-[#A78655] font-medium">{loan.graceDeadline}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={loan.status} type="loan" />
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={loan.riskLevel} type="risk" /></td>
                    <td className="px-5 py-3.5">
                      <select className="text-xs bg-white border border-[#DCDDD7] rounded px-2 py-1 text-[#30332F] focus:outline-none focus:border-[#5F7563]">
                        <option value="">Status...</option>
                        <option value="grace_period">Grace Period</option>
                        <option value="overdue">Overdue</option>
                        <option value="repaid">Repaid</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredLoans.length === 0 && (
                  <tr><td colSpan={8} className="px-6 py-8 text-center text-[#6B706A]">No records found under this filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoansPage;
