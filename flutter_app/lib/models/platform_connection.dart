class PlatformConnection {
  final String id;
  final String platform;
  final String platformName;
  final String status;
  final DateTime lastSyncAt;

  PlatformConnection({
    required this.id,
    required this.platform,
    required this.platformName,
    required this.status,
    required this.lastSyncAt,
  });

  factory PlatformConnection.fromJson(Map<String, dynamic> json) {
    return PlatformConnection(
      id: json['id'] ?? '',
      platform: json['platform'] ?? '',
      platformName: json['platformName'] ?? '',
      status: json['status'] ?? '',
      lastSyncAt: json['lastSyncAt'] != null 
        ? DateTime.parse(json['lastSyncAt']) 
        : DateTime.now(),
    );
  }
}
