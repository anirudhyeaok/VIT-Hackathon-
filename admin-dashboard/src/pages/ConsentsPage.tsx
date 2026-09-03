import { useState, useEffect } from 'react';
import { getConsents } from '../services/api';
import StatusBadge from '../components/StatusBadge';
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
      .catch(err => {
        addToast("Failed to load consents.", "error");
        setLoading(false);
      });
  }, [addToast]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Account Aggregator Consents</h1>
      <p className="text-gray-500 mb-6">Manage and view status of AA consents across all users.</p>

      <div className="card p-0 overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4">Consent ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">FIP Name</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4">Expiry Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {consents.map((consent) => (
                  <tr key={consent.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs">{consent.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{consent.userName}</td>
                    <td className="px-6 py-4">{consent.fipName}</td>
                    <td className="px-6 py-4">{consent.purpose}</td>
                    <td className="px-6 py-4">{consent.expiryDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        consent.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        consent.status === 'REVOKED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {consent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-primary-600 hover:underline">View Details</button>
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
