import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import 'providers/auth_provider.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: const GigWalletApp(),
    ),
  );
}

class GigWalletApp extends StatelessWidget {
  const GigWalletApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GigWallet',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal, secondary: Colors.indigo),
        textTheme: GoogleFonts.interTextTheme(Theme.of(context).textTheme),
      ),
      home: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          return auth.isLoggedIn ? const DashboardScreen() : const LoginScreen();
        },
      ),
    );
  }
}
