import { useState, useEffect } from 'react';
import { getLoans } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
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
      .catch(err => {
        addToast("Failed to load loans.", "error");
        setLoading(false);
      });
  }, [addToast]);

  const filteredLoans = filter === 'all' ? loans : loans.filter(l => l.status === filter);
  
  const tabs = [
    { id: 'all', label: 'All Loans' },
    { id: 'disbursed', label: 'Disbursed' },
    { id: 'grace_period', label: 'Grace Period' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'rolled_over', label: 'Rolled Over' },
    { id: 'blocked', label: 'Blocked' },
  ];

  const pipeline = [
    { status: 'disbursed', label: 'Disbursed', count: loans.filter(l => l.status === 'disbursed').length, color: 'bg-green-100 text-green-800 border-green-200' },
    { status: 'grace_period', label: 'Grace Period', count: loans.filter(l => l.status === 'grace_period').length, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { status: 'overdue', label: 'Overdue', count: loans.filter(l => l.status === 'overdue').length, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { status: 'rolled_over', label: 'Rolled Over', count: loans.filter(l => l.status === 'rolled_over').length, color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { status: 'blocked', label: 'Blocked', count: loans.filter(l => l.status === 'blocked').length, color: 'bg-red-100 text-red-800 border-red-200' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Loan Recovery Pipeline</h1>

      {/* HERO: Pipeline View */}
      <div className="card mb-6 overflow-hidden">
        <h3 className="text-lg font-semibold mb-4">Recovery Escalation Flow</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 overflow-x-auto pb-4">
          {pipeline.map((stage, idx) => (
            <div key={stage.status} className="flex-none flex items-center min-w-[140px]">
              <div 
                className={`w-full p-4 rounded-lg border ${stage.color} flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-105 hover:shadow-md ${filter === stage.status ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`} 
                onClick={() => setFilter(stage.status)}
              >
                <span className="text-xs font-bold tracking-wider uppercase opacity-80">{stage.label}</span>
                <span className="text-3xl font-black mt-2">{stage.count}</span>
              </div>
              {idx < pipeline.length - 1 && (
                <div className="hidden md:flex text-gray-400 mx-2 flex-shrink-0">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              filter === tab.id 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="p-8 space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Disbursed Date</th>
                  <th className="px-6 py-4">Grace Deadline</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">#{loan.id}</td>
                    <td className="px-6 py-4 text-primary-600 hover:underline cursor-pointer">{loan.userName}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">₹{loan.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">{loan.disbursedDate}</td>
                    <td className="px-6 py-4 text-orange-600 font-medium">{loan.graceDeadline}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        loan.status === 'disbursed' ? 'bg-green-100 text-green-800' :
                        loan.status === 'grace_period' ? 'bg-blue-100 text-blue-800' :
                        loan.status === 'overdue' ? 'bg-yellow-100 text-yellow-800' :
                        loan.status === 'rolled_over' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {loan.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={loan.riskLevel} type="risk" /></td>
                    <td className="px-6 py-4">
                      <select className="text-xs border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                        <option value="">Update...</option>
                        <option value="grace_period">Grace Period</option>
                        <option value="overdue">Overdue</option>
                        <option value="repaid">Repaid</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredLoans.length === 0 && (
                  <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">No loans found for this filter.</td></tr>
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
