class Transaction {
  final String id;
  final double amount;
  final String type;
  final String category;
  final String source;
  final DateTime date;

  Transaction({
    required this.id,
    required this.amount,
    required this.type,
    required this.category,
    required this.source,
    required this.date,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] ?? '',
      amount: (json['amount'] ?? 0.0).toDouble(),
      type: json['type'] ?? '',
      category: json['category'] ?? '',
      source: json['source'] ?? '',
      date: json['date'] != null ? DateTime.parse(json['date']) : DateTime.now(),
    );
  }
}
