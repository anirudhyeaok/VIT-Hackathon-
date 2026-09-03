import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Helper to simulate network delay & random errors
const mockRequest = async <T>(data: T, shouldFail = false): Promise<{data: T}> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail && Math.random() < 0.1) {
        reject(new Error("Simulated network error"));
      } else {
        resolve({ data });
      }
    }, 600);
  });
};

export const getUsers = async () => {
  return mockRequest([
    { id: 1, name: 'Rahul Sharma', phone: '+919876543210', email: 'rahul@example.com', occupation: 'Ride-share Driver', platforms: 3, resilienceScore: 78, activeLoans: 1, status: 'Active' },
    { id: 2, name: 'Priya Singh', phone: '+919988776655', email: 'priya@example.com', occupation: 'Delivery Partner', platforms: 2, resilienceScore: 65, activeLoans: 0, status: 'Active' },
  ]);
};

export const getUserById = async (id: string) => {
  return mockRequest({
    id, name: 'Rahul Sharma', phone: '+919876543210', email: 'rahul@example.com', occupation: 'Ride-share Driver', 
    platforms: [{name: 'Uber', health: 'good'}, {name: 'Ola', health: 'fair'}], 
    resilienceScore: 78,
    components: { financial: 80, work: 75, platform: 85 },
    recentEarnings: [{date: '10-01', amount: 1500}, {date: '10-02', amount: 2100}],
    activeLoans: [{id: 101, amount: 5000, status: 'grace_period'}],
    recommendations: ['Diversify platform income', 'Build emergency fund'],
    transactions: [{id: 1, date: '2023-10-01', amount: 5000, type: 'Disbursement', status: 'Completed'}]
  });
};

export const getLoans = async () => {
  return mockRequest([
    { id: 100, userId: 2, userName: 'Priya Singh', amount: 2000, status: 'disbursed', riskLevel: 'safe', disbursedDate: '2023-10-05', graceDeadline: '2023-10-12', repaidAmount: 0 },
    { id: 101, userId: 1, userName: 'Rahul Sharma', amount: 5000, status: 'grace_period', riskLevel: 'safe', disbursedDate: '2023-10-01', graceDeadline: '2023-10-08', repaidAmount: 0 },
    { id: 102, userId: 3, userName: 'Amit Kumar', amount: 12000, status: 'overdue', riskLevel: 'high_risk', disbursedDate: '2023-09-15', graceDeadline: '2023-09-22', repaidAmount: 2000 },
    { id: 103, userId: 4, userName: 'Vikram Patel', amount: 8000, status: 'rolled_over', riskLevel: 'caution', disbursedDate: '2023-08-10', graceDeadline: '2023-08-17', repaidAmount: 1000 },
    { id: 104, userId: 5, userName: 'Suresh Raina', amount: 15000, status: 'blocked', riskLevel: 'high_risk', disbursedDate: '2023-07-01', graceDeadline: '2023-07-08', repaidAmount: 0 },
  ]);
};

export const getConsents = async () => {
  return mockRequest([
    { id: 'c_001', userId: 1, userName: 'Rahul Sharma', fipName: 'HDFC Bank', purpose: 'Loan Underwriting', status: 'ACTIVE', expiryDate: '2024-10-01' },
    { id: 'c_002', userId: 2, userName: 'Priya Singh', fipName: 'ICICI Bank', purpose: 'Income Verification', status: 'REVOKED', expiryDate: '2024-05-15' },
    { id: 'c_003', userId: 3, userName: 'Amit Kumar', fipName: 'Axis Bank', purpose: 'Platform Aggregation', status: 'EXPIRED', expiryDate: '2023-09-01' },
  ]);
};

export const getAnalytics = async () => {
  return mockRequest({
    disbursementsOverTime: [{month: 'Jan', amount: 50000}, {month: 'Feb', amount: 75000}, {month: 'Mar', amount: 60000}],
    resilienceDistribution: [{range: '0-20', count: 5}, {range: '21-40', count: 15}, {range: '41-60', count: 45}, {range: '61-80', count: 80}, {range: '81-100', count: 25}],
    loanRiskLevel: [{name: 'safe', value: 70}, {name: 'caution', value: 20}, {name: 'high_risk', value: 10}],
    platformPopularity: [{name: 'Uber', users: 120}, {name: 'Swiggy', users: 150}, {name: 'Zomato', users: 140}, {name: 'Ola', users: 90}],
    stats: { avgIncome: 24500, avgScore: 64, commonOccupation: 'Delivery Partner' },
    usability: {
      taskCompletionRate: 85,
      recommendationUptake: 42,
      activeUsers: 850,
      blockedUsers: 150,
      mostViewedScreens: [{screen: 'Dashboard', views: 5000}, {screen: 'Earnings', views: 3200}, {screen: 'Loans', views: 2100}],
      commonActions: [{action: 'Credit Evaluated', count: 1200}, {action: 'Savings Accepted', count: 800}, {action: 'Profile Updated', count: 450}],
      errorRates: [{date: '10-01', rate: 2.1}, {date: '10-02', rate: 1.8}, {date: '10-03', rate: 3.5}, {date: '10-04', rate: 1.2}]
    }
  });
};

export const overrideLoanStatus = async (id: number, status: string) => {
  return mockRequest({ success: true, id, status });
};

export default api;
