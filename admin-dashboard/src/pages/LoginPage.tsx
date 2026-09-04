import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'admin' | 'user'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (success) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  const handleUseDemo = () => {
    if (role === 'admin') {
      setEmail('admin@gigwallet.io');
      setPassword('admin123');
    } else {
      setEmail('rahul@example.com');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F3] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-[#DCDDD7] max-w-md w-full p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#5F7563] rounded-xl flex items-center justify-center mb-4">
            <CreditCard className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#30332F]">GigWallet</h1>
          <p className="text-[#6B706A] mt-1 text-center">Financial Operations Portal</p>
        </div>

        <div className="flex bg-[#F0F1EC] p-1 rounded-lg mb-6">
          <button
            onClick={() => { setRole('admin'); setEmail(''); setPassword(''); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              role === 'admin'
                ? 'bg-[#5F7563] text-white shadow'
                : 'text-[#6B706A] hover:bg-white/50'
            }`}
          >
            Admin Portal
          </button>
          <button
            onClick={() => { setRole('user'); setEmail(''); setPassword(''); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              role === 'user'
                ? 'bg-[#5F7563] text-white shadow'
                : 'text-[#6B706A] hover:bg-white/50'
            }`}
          >
            User Portal
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#30332F] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[#DCDDD7] rounded-lg focus:outline-none focus:border-[#5F7563] focus:ring-1 focus:ring-[#5F7563]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#30332F] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#DCDDD7] rounded-lg focus:outline-none focus:border-[#5F7563] focus:ring-1 focus:ring-[#5F7563]"
              required
            />
          </div>
          
          {error && <div className="text-[#A96861] text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full bg-[#5F7563] hover:bg-[#4D6151] text-white font-medium py-2 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleUseDemo}
            className="text-sm text-[#5F7563] hover:text-[#4D6151] font-medium"
          >
            Use Demo Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
