class Alert {
  final String id;
  final String type;
  final String severity;
  final String title;
  final String message;
  final bool isRead;

  Alert({
    required this.id,
    required this.type,
    required this.severity,
    required this.title,
    required this.message,
    required this.isRead,
  });

  factory Alert.fromJson(Map<String, dynamic> json) {
    return Alert(
      id: json['id'] ?? '',
      type: json['type'] ?? '',
      severity: json['severity'] ?? '',
      title: json['title'] ?? '',
      message: json['message'] ?? '',
      isRead: json['isRead'] ?? false,
    );
  }
}
