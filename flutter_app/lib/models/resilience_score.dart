class ResilienceScore {
  final int overallScore;
  final Map<String, int> components;
  final String explanation;

  ResilienceScore({
    required this.overallScore,
    required this.components,
    required this.explanation,
  });

  factory ResilienceScore.fromJson(Map<String, dynamic> json) {
    return ResilienceScore(
      overallScore: json['overallScore'] ?? 0,
      components: Map<String, int>.from(json['components'] ?? {}),
      explanation: json['explanation'] ?? '',
    );
  }
}
