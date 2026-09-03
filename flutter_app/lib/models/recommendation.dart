class Recommendation {
  final String id;
  final String type;
  final String action;
  final double? amount;
  final String? riskLevel;
  final String title;
  final String reason;
  final String consequence;

  Recommendation({
    required this.id,
    required this.type,
    required this.action,
    this.amount,
    this.riskLevel,
    required this.title,
    required this.reason,
    required this.consequence,
  });

  factory Recommendation.fromJson(Map<String, dynamic> json) {
    return Recommendation(
      id: json['id'] ?? '',
      type: json['type'] ?? '',
      action: json['action'] ?? '',
      amount: json['amount'] != null ? (json['amount'] as num).toDouble() : null,
      riskLevel: json['riskLevel'],
      title: json['title'] ?? '',
      reason: json['reason'] ?? '',
      consequence: json['consequence'] ?? '',
    );
  }
}
