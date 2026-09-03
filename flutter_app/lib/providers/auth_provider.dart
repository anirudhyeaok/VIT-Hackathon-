import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  bool _isLoggedIn = false;

  bool get isLoggedIn => _isLoggedIn;

  Future<void> login(String email, String password) async {
    await _apiService.login(email, password);
    _isLoggedIn = true;
    notifyListeners();
  }

  Future<void> register(String name, String email, String password, String occupation, String incomeFrequency) async {
    await _apiService.register(name, email, password, occupation, incomeFrequency);
  }

  void logout() {
    _apiService.logout();
    _isLoggedIn = false;
    notifyListeners();
  }
}
