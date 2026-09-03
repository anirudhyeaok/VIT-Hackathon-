class Forecast {
  final double currentBalance;
  final double expectedIncome;
  final double expectedExpenses;
  final double projectedBalance;
  final double safeToSave;

  Forecast({
    required this.currentBalance,
    required this.expectedIncome,
    required this.expectedExpenses,
    required this.projectedBalance,
    required this.safeToSave,
  });

  factory Forecast.fromJson(Map<String, dynamic> json) {
    return Forecast(
      currentBalance: (json['currentBalance'] ?? 0.0).toDouble(),
      expectedIncome: (json['expectedIncome'] ?? 0.0).toDouble(),
      expectedExpenses: (json['expectedExpenses'] ?? 0.0).toDouble(),
      projectedBalance: (json['projectedBalance'] ?? 0.0).toDouble(),
      safeToSave: (json['safeToSave'] ?? 0.0).toDouble(),
    );
  }
}
