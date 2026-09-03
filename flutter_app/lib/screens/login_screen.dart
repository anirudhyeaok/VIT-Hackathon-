import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final emailController = TextEditingController(text: 'ramesh@demo.com');
    final passwordController = TextEditingController(text: 'password123');

    return Scaffold(
      body: Center(
        child: Container(
          width: 400,
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('GigWallet', style: Theme.of(context).textTheme.headlineLarge?.copyWith(color: Colors.teal, fontWeight: FontWeight.bold)),
              const SizedBox(height: 32),
              TextField(
                controller: emailController,
                decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: passwordController,
                decoration: const InputDecoration(labelText: 'Password', border: OutlineInputBorder()),
                obscureText: true,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  context.read<AuthProvider>().login(emailController.text, passwordController.text);
                },
                style: ElevatedButton.styleFrom(minimumSize: const Size.infinity, 50)),
                child: const Text('Login'),
              ),
              const SizedBox(height: 16),
              Text('Demo: ramesh@demo.com / password123', style: TextStyle(color: Colors.grey)),
            ],
          ),
        ),
      ),
    );
  }
}
