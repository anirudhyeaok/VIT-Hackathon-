import 'package:flutter/material.dart';
import 'account_link_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedIndex = 0;

  // Mock interactive state for demo
  final List<Map<String, dynamic>> _platforms = [
    {'name': 'Zomato', 'status': 'Connected & Syncing', 'health': 'healthy', 'color': Colors.green, 'icon': Icons.check_circle, 'earnings': '₹14,200', 'trips': 142, 'hours': 64.5, 'sync': '2 mins ago'},
    {'name': 'Swiggy', 'status': 'Connected & Syncing', 'health': 'healthy', 'color': Colors.green, 'icon': Icons.check_circle, 'earnings': '₹9,850', 'trips': 98, 'hours': 42.0, 'sync': '15 mins ago'},
    {'name': 'Uber', 'status': 'Connected & Syncing', 'health': 'healthy', 'color': Colors.green, 'icon': Icons.check_circle, 'earnings': '₹7,400', 'trips': 45, 'hours': 31.2, 'sync': '1 hour ago'},
    {'name': 'Ola', 'status': 'Stale - Reauth needed', 'health': 'stale', 'color': Colors.orange, 'icon': Icons.warning_amber_rounded, 'earnings': '₹3,200', 'trips': 18, 'hours': 14.0, 'sync': '32 hours ago'},
  ];

  double _loanAmountRequested = 10000;
  String _creditCheckResult = 'CAUTION';
  String _creditMessage = 'Taking ₹10,000 now would leave you with limited buffer. Consider ₹5,000 or saving first.';

  void _runCreditCheck(double amount) {
    setState(() {
      _loanAmountRequested = amount;
      if (amount <= 5000) {
        _creditCheckResult = 'SAFE';
        _creditMessage = 'Affordable borrowing! Your combined multi-platform cash flow easily supports this amount.';
      } else if (amount <= 12000) {
        _creditCheckResult = 'CAUTION';
        _creditMessage = 'Taking ₹${amount.toInt()} may reduce your emergency resilience. We recommend ₹5,000 or shorter repayment.';
      } else {
        _creditCheckResult = 'HIGH RISK';
        _creditMessage = 'Borrowing ₹${amount.toInt()} exceeds safe debt-to-income limits across your active gig platforms.';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Row(
        children: [
          // Sidebar Navigation
          NavigationRail(
            backgroundColor: Colors.white,
            elevation: 2,
            selectedIndex: _selectedIndex,
            onDestinationSelected: (int index) {
              setState(() => _selectedIndex = index);
            },
            labelType: NavigationRailLabelType.all,
            leading: Padding(
              padding: const EdgeInsets.symmetric(vertical: 24.0),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.teal.shade50,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.account_balance_wallet, color: Colors.teal, size: 32),
                  ),
                  const SizedBox(height: 8),
                  const Text('GigWallet', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.teal)),
                ],
              ),
            ),
            destinations: const [
              NavigationRailDestination(icon: Icon(Icons.dashboard, size: 26), label: Text('Dashboard', style: TextStyle(fontSize: 14))),
              NavigationRailDestination(icon: Icon(Icons.hub_outlined, size: 26), label: Text('Platforms', style: TextStyle(fontSize: 14))),
              NavigationRailDestination(icon: Icon(Icons.trending_up, size: 26), label: Text('Earnings', style: TextStyle(fontSize: 14))),
              NavigationRailDestination(icon: Icon(Icons.savings_outlined, size: 26), label: Text('Deferred Loans', style: TextStyle(fontSize: 14))),
              NavigationRailDestination(icon: Icon(Icons.verified_user_outlined, size: 26), label: Text('Credit & AA', style: TextStyle(fontSize: 14))),
            ],
          ),
          const VerticalDivider(thickness: 1, width: 1, color: Color(0xFFE2E8F0)),
          Expanded(
            child: IndexedStack(
              index: _selectedIndex,
              children: [
                _buildOverviewTab(),
                _buildPlatformsTab(),
                _buildEarningsTab(),
                _buildLoansTab(),
                _buildCreditTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 0: OVERVIEW DASHBOARD
  // ═══════════════════════════════════════════════════════════
  Widget _buildOverviewTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(32.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text('Hello Ramesh, here\'s your financial snapshot.', 
                    style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                  SizedBox(height: 6),
                  Text('Multi-platform resilience co-pilot active • 3 platforms connected',
                    style: TextStyle(fontSize: 15, color: Color(0xFF64748B))),
                ],
              ),
              OutlinedButton.icon(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const AccountLinkScreen()));
                },
                icon: const Icon(Icons.link, color: Colors.teal),
                label: const Text('RBI Account Aggregator', style: TextStyle(color: Colors.teal, fontWeight: FontWeight.w600)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.teal),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                ),
              ),
            ],
          ),
          const SizedBox(height: 28),

          // HERO 3: Deferred Loan Recovery Banner
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFFFFBEB),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFFDE68A)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.amber.shade100,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.timer_outlined, color: Colors.orange, size: 36),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('Deferred Loan Recovery: 3 Days Remaining in Grace Period', 
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFFB45309))),
                      SizedBox(height: 6),
                      Text('We do NOT automatically deduct loans from your salary! Your salary is deposited in full. You have 3 days remaining to manually repay ₹3,000 without penalty.', 
                        style: TextStyle(fontSize: 14, color: Color(0xFF78350F))),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: () => setState(() => _selectedIndex = 3),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFD97706),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: const Text('Repay / Details', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Top Row: Resilience Score & Platform Health
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // HERO 2: Cross-Platform Resilience Score
              Expanded(
                flex: 1,
                child: Card(
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: const BorderSide(color: Color(0xFFE2E8F0)),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: const [
                            Text('Resilience Score', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                            Chip(
                              label: Text('Cross-Platform', style: TextStyle(fontSize: 12, color: Colors.teal, fontWeight: FontWeight.w600)),
                              backgroundColor: Color(0xFFF0FDFA),
                            )
                          ],
                        ),
                        const SizedBox(height: 20),
                        Center(
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              SizedBox(
                                width: 140,
                                height: 140,
                                child: CircularProgressIndicator(
                                  value: 0.72,
                                  strokeWidth: 14,
                                  color: Colors.teal,
                                  backgroundColor: const Color(0xFFE2E8F0),
                                ),
                              ),
                              Column(
                                mainAxisSize: MainAxisSize.min,
                                children: const [
                                  Text('72', style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.teal)),
                                  Text('/ 100', style: TextStyle(fontSize: 14, color: Color(0xFF64748B))),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 20),
                        const Text('🟢 High Multi-Platform Consistency', 
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.teal)),
                        const SizedBox(height: 6),
                        const Text('Working across Zomato (24 days) + Swiggy (14 days) + Uber (6 days) provides high income diversity. No single app slowdown can halt your cash flow.',
                          style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 24),
              // HERO 1 & 4: Multi-Platform Health Monitor
              Expanded(
                flex: 1,
                child: Card(
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: const BorderSide(color: Color(0xFFE2E8F0)),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Platform Link Health', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                            TextButton(
                              onPressed: () => setState(() => _selectedIndex = 1),
                              child: const Text('Manage', style: TextStyle(color: Colors.teal)),
                            )
                          ],
                        ),
                        const SizedBox(height: 12),
                        ..._platforms.map((p) => _buildPlatformStatusTile(p)).toList(),
                        const SizedBox(height: 12),
                        const Text('Note: Constant link is required to maintain loan eligibility.',
                          style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Financial Forecasting & Adaptive Savings
          Row(
            children: [
              Expanded(
                child: _buildInfoCard(
                  title: 'Adaptive Safe-to-Save',
                  value: '₹500 this week',
                  subtitle: 'Calculated: Expected Income (₹6,000) - Essentials (₹4,500) - Buffer = ₹500 safe.',
                  color: Colors.teal,
                  icon: Icons.savings_outlined,
                  actionText: 'Save ₹500 Now',
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Safe savings of ₹500 logged to emergency buffer!')),
                    );
                  },
                ),
              ),
              const SizedBox(width: 24),
              Expanded(
                child: _buildInfoCard(
                  title: '30-Day Cash Flow Forecast',
                  value: '₹28,450 Projected',
                  subtitle: 'Range: ₹26,000 - ₹31,000 based on weighted moving average of 4-week deliveries.',
                  color: Colors.indigo,
                  icon: Icons.insights,
                  actionText: 'Simulate Credit',
                  onTap: () => setState(() => _selectedIndex = 4),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 1: PLATFORMS MANAGER (HERO 1 & 4)
  // ═══════════════════════════════════════════════════════════
  Widget _buildPlatformsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(32.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text('Multi-Platform Aggregation Hub', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
                  SizedBox(height: 6),
                  Text('Unlike traditional apps that only permit 1 gig contract, GigWallet syncs all your gig accounts continuously.', style: TextStyle(color: Color(0xFF64748B))),
                ],
              ),
              ElevatedButton.icon(
                onPressed: _showLinkPlatformDialog,
                icon: const Icon(Icons.add_link),
                label: const Text('Link Another Platform'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.teal,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                ),
              ),
            ],
          ),
          const SizedBox(height: 28),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 20,
              mainAxisSpacing: 20,
              childAspectRatio: 1.5,
            ),
            itemCount: _platforms.length,
            itemBuilder: (context, index) {
              final p = _platforms[index];
              return Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: p['health'] == 'stale' ? Colors.orange.shade300 : const Color(0xFFE2E8F0)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: Colors.teal.shade50,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(Icons.directions_bike, color: Colors.teal),
                              ),
                              const SizedBox(width: 14),
                              Text(p['name'], style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          Chip(
                            avatar: Icon(p['icon'], color: p['color'], size: 16),
                            label: Text(p['status'], style: TextStyle(color: p['color'], fontSize: 12, fontWeight: FontWeight.bold)),
                            backgroundColor: p['color'] == Colors.green ? const Color(0xFFF0FDF4) : const Color(0xFFFFFBEB),
                          ),
                        ],
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildStatItem('30-Day Earnings', p['earnings']),
                          _buildStatItem('Total Trips', '${p['trips']}'),
                          _buildStatItem('Active Hours', '${p['hours']} hrs'),
                        ],
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Last synced: ${p['sync']}', style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                          TextButton(
                            onPressed: () {
                              setState(() {
                                p['status'] = 'Connected & Syncing';
                                p['health'] = 'healthy';
                                p['color'] = Colors.green;
                                p['icon'] = Icons.check_circle;
                                p['sync'] = 'Just now';
                              });
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Re-synced ${p['name']} successfully!')),
                              );
                            },
                            child: const Text('Force Sync Now'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 2: CROSS-PLATFORM EARNINGS (HERO 2)
  // ═══════════════════════════════════════════════════════════
  Widget _buildEarningsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(32.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Cross-Platform Income Analysis', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          const Text('Holistic tracking across all linked delivery & mobility platforms.', style: TextStyle(color: Color(0xFF64748B))),
          const SizedBox(height: 28),
          Row(
            children: [
              Expanded(child: _buildMetricCard('Combined Monthly Income', '₹34,650', '+18% vs last month', Colors.green)),
              const SizedBox(width: 16),
              Expanded(child: _buildMetricCard('Active Earning Days', '26 / 28 Days', '92% consistency rating', Colors.teal)),
              const SizedBox(width: 16),
              Expanded(child: _buildMetricCard('Multi-App Diversity', '4 Apps Linked', 'Zomato 41%, Swiggy 28%, Uber 21%', Colors.indigo)),
            ],
          ),
          const SizedBox(height: 28),
          Card(
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Platform Breakdown & Consistency History', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  _buildEarningBar('Zomato (Primary Delivery)', 0.41, '₹14,200 (142 orders)', Colors.red.shade400),
                  const SizedBox(height: 14),
                  _buildEarningBar('Swiggy (Secondary Delivery)', 0.28, '₹9,850 (98 orders)', Colors.orange.shade400),
                  const SizedBox(height: 14),
                  _buildEarningBar('Uber (Peak Ride-Hailing)', 0.21, '₹7,400 (45 rides)', Colors.black87),
                  const SizedBox(height: 14),
                  _buildEarningBar('Ola (Surge Ride-Hailing)', 0.10, '₹3,200 (18 rides)', Colors.lightGreen.shade700),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 3: DEFERRED LOANS & RECOVERY (HERO 3)
  // ═══════════════════════════════════════════════════════════
  Widget _buildLoansTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(32.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Deferred Loan Recovery & EWA', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          const Text('Borrower-friendly earned wage access: We do NOT auto-deduct loans from your salary upon deposit.', style: TextStyle(color: Color(0xFF64748B))),
          const SizedBox(height: 28),
          Card(
            color: const Color(0xFFFFFBEB),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: const BorderSide(color: Color(0xFFFDE68A)),
            ),
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.hourglass_top, color: Colors.orange, size: 28),
                          SizedBox(width: 12),
                          Text('Active Loan: ₹3,000 in Grace Period', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF92400E))),
                        ],
                      ),
                      const Chip(
                        label: Text('3 DAYS LEFT', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.orange)),
                        backgroundColor: Colors.white,
                      )
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text('Recovery State Pipeline:'),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _buildPipelineStep('1. Disbursed', true, 'Funds paid'),
                      _buildPipelineArrow(),
                      _buildPipelineStep('2. 5-Day Grace', true, 'Current (3d left)'),
                      _buildPipelineArrow(),
                      _buildPipelineStep('3. Overdue (Late)', false, 'Reminders sent'),
                      _buildPipelineArrow(),
                      _buildPipelineStep('4. Rollover', false, 'Added to next cycle'),
                      _buildPipelineArrow(),
                      _buildPipelineStep('5. Blocked', false, 'If unpaid 2 cycles'),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      OutlinedButton(
                        onPressed: () {},
                        child: const Text('Request Extension'),
                      ),
                      const SizedBox(width: 16),
                      ElevatedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Payment processed successfully! Loan closed.')),
                          );
                        },
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.teal, foregroundColor: Colors.white),
                        child: const Text('Repay ₹3,000 Now'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 4: CREDIT AFFORDABILITY CHECK & AA FLOW
  // ═══════════════════════════════════════════════════════════
  Widget _buildCreditTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(32.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Responsible Credit Affordability Engine', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          const Text('Decision support layer: We evaluate whether you can safely afford a loan before borrowing.', style: TextStyle(color: Color(0xFF64748B))),
          const SizedBox(height: 28),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: 1,
                child: Card(
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: const BorderSide(color: Color(0xFFE2E8F0)),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Test Loan Amount Affordability', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 20),
                        TextField(
                          decoration: InputDecoration(
                            labelText: 'Requested Loan Amount (₹)',
                            prefixText: '₹ ',
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          keyboardType: TextInputType.number,
                          onSubmitted: (val) {
                            final parsed = double.tryParse(val);
                            if (parsed != null) _runCreditCheck(parsed);
                          },
                        ),
                        const SizedBox(height: 20),
                        Wrap(
                          spacing: 10,
                          children: [3000, 5000, 10000, 20000].map((amt) {
                            return ActionChip(
                              label: Text('₹$amt'),
                              onPressed: () => _runCreditCheck(amt.toDouble()),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 24),
              Expanded(
                flex: 1,
                child: Card(
                  elevation: 0,
                  color: _creditCheckResult == 'SAFE'
                      ? const Color(0xFFF0FDF4)
                      : (_creditCheckResult == 'CAUTION' ? const Color(0xFFFFFBEB) : const Color(0xFFFEF2F2)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(
                      color: _creditCheckResult == 'SAFE'
                          ? Colors.green.shade300
                          : (_creditCheckResult == 'CAUTION' ? Colors.amber.shade300 : Colors.red.shade300),
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              _creditCheckResult == 'SAFE' ? Icons.check_circle : Icons.warning_amber_rounded,
                              color: _creditCheckResult == 'SAFE' ? Colors.green : (_creditCheckResult == 'CAUTION' ? Colors.orange : Colors.red),
                              size: 28,
                            ),
                            const SizedBox(width: 10),
                            Text('Affordability: $_creditCheckResult', 
                              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, 
                                color: _creditCheckResult == 'SAFE' ? Colors.green : (_creditCheckResult == 'CAUTION' ? Colors.orange : Colors.red))),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(_creditMessage, style: const TextStyle(fontSize: 15, height: 1.4)),
                        const SizedBox(height: 20),
                        const Divider(),
                        const SizedBox(height: 10),
                        const Text('⚠️ Disclaimer: This is an explainable decision-support tool to protect worker resilience, not a formal lending guarantee.',
                          style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════
  // REUSABLE HELPER WIDGETS
  // ═══════════════════════════════════════════════════════════
  Widget _buildPlatformStatusTile(Map<String, dynamic> p) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(p['icon'], color: p['color'], size: 22),
          const SizedBox(width: 12),
          Expanded(child: Text(p['name'], style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600))),
          Text(p['status'], style: TextStyle(fontSize: 14, color: p['color'], fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _buildInfoCard({
    required String title,
    required String value,
    required String subtitle,
    required Color color,
    required IconData icon,
    required String actionText,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color, size: 24),
                const SizedBox(width: 10),
                Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 14),
            Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 6),
            Text(subtitle, style: const TextStyle(fontSize: 13, color: Color(0xFF64748B))),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: onTap,
              style: ElevatedButton.styleFrom(
                backgroundColor: color,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: Text(actionText),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String val) {
    return Column(
      children: [
        Text(val, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
      ],
    );
  }

  Widget _buildMetricCard(String title, String val, String trend, Color color) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontSize: 14, color: Color(0xFF64748B))),
            const SizedBox(height: 10),
            Text(val, style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Text(trend, style: TextStyle(fontSize: 13, color: color, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }

  Widget _buildEarningBar(String name, double pct, String amount, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(name, style: const TextStyle(fontWeight: FontWeight.w600)),
            Text(amount, style: const TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        const SizedBox(height: 8),
        LinearProgressIndicator(
          value: pct,
          color: color,
          backgroundColor: const Color(0xFFE2E8F0),
          minHeight: 8,
          borderRadius: BorderRadius.circular(4),
        ),
      ],
    );
  }

  Widget _buildPipelineStep(String title, bool active, String note) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: active ? Colors.amber.shade200 : Colors.white,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: active ? Colors.amber.shade600 : Colors.grey.shade300),
        ),
        child: Column(
          children: [
            Text(title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: active ? const Color(0xFF92400E) : Colors.black87)),
            const SizedBox(height: 4),
            Text(note, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
          ],
        ),
      ),
    );
  }

  Widget _buildPipelineArrow() {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 4.0),
      child: Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
    );
  }

  void _showLinkPlatformDialog() {
    showDialog(
      context: context,
      builder: (context) {
        String selected = 'Ola';
        return AlertDialog(
          title: const Text('Link New Gig Platform'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Connect another gig app contract to increase your cross-platform consistency score:'),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selected,
                items: ['Ola', 'Zepto', 'Blinkit', 'Rapido', 'Amazon Flex'].map((e) {
                  return DropdownMenuItem(value: e, child: Text(e));
                }).toList(),
                onChanged: (val) => selected = val ?? 'Ola',
                decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Select Platform'),
              ),
              const SizedBox(height: 16),
              const TextField(
                decoration: InputDecoration(border: OutlineInputBorder(), labelText: 'Partner / Rider ID (e.g. OLA-P-4001)'),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _platforms.add({
                    'name': selected,
                    'status': 'Connected & Syncing',
                    'health': 'healthy',
                    'color': Colors.green,
                    'icon': Icons.check_circle,
                    'earnings': '₹0 (New)',
                    'trips': 0,
                    'hours': 0.0,
                    'sync': 'Just now',
                  });
                });
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('$selected linked! Cross-platform score recalculated.')),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: Colors.teal, foregroundColor: Colors.white),
              child: const Text('Link & Sync'),
            )
          ],
        );
      },
    );
  }
}
