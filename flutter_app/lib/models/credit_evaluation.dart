class CreditEvaluation {
  final String riskLevel;
  final String explanation;
  final double? alternativeAmount;
  final Map<String, dynamic> analysis;

  CreditEvaluation({
    required this.riskLevel,
    required this.explanation,
    this.alternativeAmount,
    required this.analysis,
  });

  factory CreditEvaluation.fromJson(Map<String, dynamic> json) {
    return CreditEvaluation(
      riskLevel: json['riskLevel'] ?? '',
      explanation: json['explanation'] ?? '',
      alternativeAmount: json['alternativeAmount'] != null ? (json['alternativeAmount'] as num).toDouble() : null,
      analysis: json['analysis'] ?? {},
    );
  }
}
