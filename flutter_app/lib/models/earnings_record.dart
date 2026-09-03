class EarningsRecord {
  final String platform;
  final DateTime date;
  final double amount;
  final int trips;
  final double hoursWorked;
  final double incentives;

  EarningsRecord({
    required this.platform,
    required this.date,
    required this.amount,
    required this.trips,
    required this.hoursWorked,
    required this.incentives,
  });

  factory EarningsRecord.fromJson(Map<String, dynamic> json) {
    return EarningsRecord(
      platform: json['platform'] ?? '',
      date: json['date'] != null ? DateTime.parse(json['date']) : DateTime.now(),
      amount: (json['amount'] ?? 0.0).toDouble(),
      trips: json['trips'] ?? 0,
      hoursWorked: (json['hoursWorked'] ?? 0.0).toDouble(),
      incentives: (json['incentives'] ?? 0.0).toDouble(),
    );
  }
}
