import { useState, useEffect } from 'react';
import { getConsents } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';

const ConsentsPage = () => {
  const [consents, setConsents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    getConsents()
      .then(res => {
        setConsents(res.data);
        setLoading(false);
      })
      .catch(() => {
        addToast("Failed to load consent artifacts.", "error");
        setLoading(false);
      });
  }, [addToast]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-xl font-bold text-[#30332F]">RBI Account Aggregator (AA) Consents</h1>
        <p className="text-xs text-[#6B706A] mt-0.5">Audited consent registry for Financial Information Providers (FIPs) and user data access.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#DCDDD7] shadow-xs overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-[#6B706A]">
              <thead className="text-[11px] text-[#6B706A] uppercase bg-[#F0F1EC] border-b border-[#DCDDD7]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Consent Artifact ID</th>
                  <th className="px-5 py-3 font-semibold">Beneficiary</th>
                  <th className="px-5 py-3 font-semibold">FIP Institution</th>
                  <th className="px-5 py-3 font-semibold">Consent Purpose</th>
                  <th className="px-5 py-3 font-semibold">Expiry Date</th>
                  <th className="px-5 py-3 font-semibold">Consent Status</th>
                  <th className="px-5 py-3 font-semibold">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCDDD7]">
                {consents.map((consent) => (
                  <tr key={consent.id} className="hover:bg-[#F9F9F7] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[#8A8F89] text-[11px]">{consent.id}</td>
                    <td className="px-5 py-3.5 font-semibold text-[#30332F]">{consent.userName}</td>
                    <td className="px-5 py-3.5 text-[#30332F]">{consent.fipName}</td>
                    <td className="px-5 py-3.5">{consent.purpose}</td>
                    <td className="px-5 py-3.5 font-mono text-[#8A8F89]">{consent.expiryDate}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded border ${
                        consent.status === 'ACTIVE' ? 'bg-[#E9EFEA] text-[#62806A] border-[#DCDDD7]' :
                        consent.status === 'REVOKED' ? 'bg-[#F8EDEB] text-[#A96861] border-[#DCDDD7]' : 
                        'bg-[#F0F1EC] text-[#6B706A] border-[#DCDDD7]'
                      }`}>
                        {consent.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="text-[#526A57] hover:text-[#38463B] font-semibold">Review Artifact</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsentsPage;
