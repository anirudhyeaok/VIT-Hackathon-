class User {
  final String id;
  final String name;
  final String email;
  final String occupation;
  final String incomeFrequency;
  final double emergencyBuffer;
  final String status;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.occupation,
    required this.incomeFrequency,
    required this.emergencyBuffer,
    required this.status,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      occupation: json['occupation'] ?? '',
      incomeFrequency: json['incomeFrequency'] ?? '',
      emergencyBuffer: (json['emergencyBuffer'] ?? 0.0).toDouble(),
      status: json['status'] ?? '',
    );
  }
}
