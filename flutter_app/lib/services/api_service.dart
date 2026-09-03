import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../models/platform_connection.dart';
import '../models/earnings_record.dart';
import '../models/transaction_model.dart';
import '../models/loan.dart';
import '../models/resilience_score.dart';
import '../models/recommendation.dart';
import '../models/alert_model.dart';
import '../models/forecast.dart';
import '../models/credit_evaluation.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3000';
  String? _token;

  Future<void> _loadToken() async {
    if (_token == null) {
      final prefs = await SharedPreferences.getInstance();
      _token = prefs.getString('jwt_token');
    }
  }

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_token != null) 'Authorization': 'Bearer $_token',
  };

  Future<void> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _token = data['access_token'];
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('jwt_token', _token!);
      } else {
        throw Exception('Failed to login');
      }
    } catch (e) {
      // Mock login for demo
      _token = 'mock_token';
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('jwt_token', _token!);
    }
  }

  Future<void> register(String name, String email, String password, String occupation, String incomeFrequency) async {
    await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'occupation': occupation,
        'incomeFrequency': incomeFrequency,
      }),
    );
  }

  void logout() async {
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
  }

  Future<List<PlatformConnection>> getLinkedPlatforms() async {
    await _loadToken();
    try {
      final response = await http.get(Uri.parse('$baseUrl/platforms'), headers: _headers);
      if (response.statusCode == 200) {
        Iterable list = jsonDecode(response.body);
        return list.map((e) => PlatformConnection.fromJson(e)).toList();
      }
    } catch (e) {}
    // Mock
    return [
      PlatformConnection(id: '1', platform: 'zomato', platformName: 'Zomato', status: 'active', lastSyncAt: DateTime.now().subtract(Duration(minutes: 5))),
      PlatformConnection(id: '2', platform: 'swiggy', platformName: 'Swiggy', status: 'active', lastSyncAt: DateTime.now().subtract(Duration(minutes: 15))),
      PlatformConnection(id: '3', platform: 'uber', platformName: 'Uber', status: 'needs_reauth', lastSyncAt: DateTime.now().subtract(Duration(days: 1))),
    ];
  }

  Future<ResilienceScore> getResilienceScore() async {
    await _loadToken();
    try {
      final response = await http.get(Uri.parse('$baseUrl/resilience/score'), headers: _headers);
      if (response.statusCode == 200) {
        return ResilienceScore.fromJson(jsonDecode(response.body));
      }
    } catch (e) {}
    return ResilienceScore(overallScore: 68, components: {'earnings': 70, 'savings': 50, 'credit': 80}, explanation: 'You are doing okay but can improve savings.');
  }

  Future<Forecast> getForecast() async {
    await _loadToken();
    try {
      final response = await http.get(Uri.parse('$baseUrl/financial/forecast'), headers: _headers);
      if (response.statusCode == 200) {
        return Forecast.fromJson(jsonDecode(response.body));
      }
    } catch (e) {}
    return Forecast(currentBalance: 5000, expectedIncome: 12000, expectedExpenses: 8000, projectedBalance: 9000, safeToSave: 1000);
  }

  Future<List<Recommendation>> getRecommendations() async {
    await _loadToken();
    try {
      final response = await http.get(Uri.parse('$baseUrl/recommendations'), headers: _headers);
      if (response.statusCode == 200) {
        Iterable list = jsonDecode(response.body);
        return list.map((e) => Recommendation.fromJson(e)).toList();
      }
    } catch (e) {}
    return [
      Recommendation(id: '1', type: 'savings', action: 'save', title: 'Save ₹500 today', reason: 'High earnings this week', consequence: 'Build emergency fund', amount: 500),
      Recommendation(id: '2', type: 'credit', action: 'repay', title: 'Repay loan', reason: 'Avoid late fees', consequence: 'Save ₹200 in penalties', amount: 1000),
    ];
  }

  Future<List<Alert>> getAlerts() async {
    return [
      Alert(id: '1', type: 'system', severity: 'warning', title: 'Uber sync failed', message: 'Please reconnect your Uber account.', isRead: false),
    ];
  }

  Future<List<EarningsRecord>> getEarningsHistory(int days, String? platform) async {
    return [
      EarningsRecord(platform: 'zomato', date: DateTime.now().subtract(Duration(days: 1)), amount: 800, trips: 10, hoursWorked: 6, incentives: 50),
      EarningsRecord(platform: 'swiggy', date: DateTime.now().subtract(Duration(days: 1)), amount: 600, trips: 8, hoursWorked: 5, incentives: 40),
    ];
  }

  Future<Map<String, dynamic>> getEarningsSummary() async {
    return {
      'total': 1400.0,
      'averageDaily': 700.0,
    };
  }

  Future<CreditEvaluation> evaluateCredit(double amount) async {
    return CreditEvaluation(riskLevel: amount > 5000 ? 'HIGH_RISK' : 'SAFE', explanation: 'Based on current earnings trajectory.', analysis: {}, alternativeAmount: 3000);
  }

  Future<List<Loan>> getActiveLoans() async {
    return [
      Loan(id: '1', principal: 2000, totalDue: 2100, amountRepaid: 500, status: 'active', riskLevel: 'low', graceDeadline: DateTime.now().add(Duration(days: 3))),
    ];
  }
}
