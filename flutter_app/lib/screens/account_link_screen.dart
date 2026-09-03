import 'package:flutter/material.dart';

class AccountLinkScreen extends StatefulWidget {
  const AccountLinkScreen({Key? key}) : super(key: key);

  @override
  _AccountLinkScreenState createState() => _AccountLinkScreenState();
}

class _AccountLinkScreenState extends State<AccountLinkScreen> {
  int _currentStep = 0;
  String? _selectedBank;
  final _otpController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Link Bank Account', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
      ),
      body: Stepper(
        currentStep: _currentStep,
        onStepContinue: () {
          if (_currentStep == 1 && _selectedBank == null) {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please select a bank.')));
            return;
          }
          if (_currentStep == 2 && _otpController.text.length != 6) {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter a valid 6-digit OTP.')));
            return;
          }
          if (_currentStep < 3) {
            setState(() => _currentStep += 1);
          }
        },
        onStepCancel: () {
          if (_currentStep > 0) {
            setState(() => _currentStep -= 1);
          } else {
            Navigator.of(context).pop();
          }
        },
        steps: [
          Step(
            title: const Text('Consent to Share', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            content: const Text(
              'Share Financial Data with GigWallet?\n\n'
              'We will access your bank transactions and balances (read-only). We will not change anything.',
              style: TextStyle(fontSize: 16),
            ),
            isActive: _currentStep >= 0,
          ),
          Step(
            title: const Text('Select Bank', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            content: DropdownButtonFormField<String>(
              value: _selectedBank,
              items: ['SBI', 'HDFC', 'ICICI', 'Axis'].map((bank) {
                return DropdownMenuItem(value: bank, child: Text(bank, style: const TextStyle(fontSize: 16)));
              }).toList(),
              onChanged: (val) => setState(() => _selectedBank = val),
              decoration: const InputDecoration(border: OutlineInputBorder()),
              hint: const Text('Choose your bank'),
            ),
            isActive: _currentStep >= 1,
          ),
          Step(
            title: const Text('Verify OTP', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            content: TextField(
              controller: _otpController,
              decoration: const InputDecoration(
                labelText: 'Enter 6-digit OTP',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              maxLength: 6,
              style: const TextStyle(fontSize: 16),
            ),
            isActive: _currentStep >= 2,
          ),
          Step(
            title: const Text('Success', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            content: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Row(
                  children: [
                    Icon(Icons.check_circle, color: Colors.green, size: 32),
                    SizedBox(width: 8),
                    Expanded(child: Text('Account linked! ✔ GigWallet can now analyze your transactions.', style: TextStyle(fontSize: 16, color: Colors.green, fontWeight: FontWeight.bold))),
                  ],
                ),
                SizedBox(height: 16),
                Text('Powered by Account Aggregator (RBI)', style: TextStyle(color: Colors.grey, fontSize: 14)),
              ],
            ),
            isActive: _currentStep >= 3,
          ),
        ],
      ),
    );
  }
}
