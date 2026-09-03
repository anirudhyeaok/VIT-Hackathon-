class Loan {
  final String id;
  final double principal;
  final double totalDue;
  final double amountRepaid;
  final String status;
  final String riskLevel;
  final DateTime? graceDeadline;

  Loan({
    required this.id,
    required this.principal,
    required this.totalDue,
    required this.amountRepaid,
    required this.status,
    required this.riskLevel,
    this.graceDeadline,
  });

  factory Loan.fromJson(Map<String, dynamic> json) {
    return Loan(
      id: json['id'] ?? '',
      principal: (json['principal'] ?? 0.0).toDouble(),
      totalDue: (json['totalDue'] ?? 0.0).toDouble(),
      amountRepaid: (json['amountRepaid'] ?? 0.0).toDouble(),
      status: json['status'] ?? '',
      riskLevel: json['riskLevel'] ?? '',
      graceDeadline: json['graceDeadline'] != null ? DateTime.parse(json['graceDeadline']) : null,
    );
  }
}
