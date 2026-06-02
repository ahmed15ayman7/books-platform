class SubmissionRequest {
  const SubmissionRequest({
    required this.authorName,
    required this.authorEmail,
    required this.authorPhone,
    required this.authorBio,
    required this.bookTitleAr,
    required this.bookType,
    required this.bookSummary,
    required this.bookLanguage,
    required this.bookCategory,
    this.coverImageUrl,
    this.manuscriptFileUrl,
    this.allowFreeDownload = false,
  });

  final String authorName;
  final String authorEmail;
  final String authorPhone;
  final String authorBio;
  final String bookTitleAr;
  final String bookType;
  final String bookSummary;
  final String bookLanguage;
  final String bookCategory;
  final String? coverImageUrl;
  final String? manuscriptFileUrl;
  final bool allowFreeDownload;

  Map<String, dynamic> toJson() => {
        'authorName': authorName,
        'authorEmail': authorEmail,
        'authorPhone': authorPhone,
        'authorBio': authorBio,
        'bookTitleAr': bookTitleAr,
        'bookType': bookType,
        'bookSummary': bookSummary,
        'bookLanguage': bookLanguage,
        'bookCategory': bookCategory,
        'website': '', // honeypot anti-spam field (FR-059)
        if (coverImageUrl != null) 'coverImageUrl': coverImageUrl,
        if (manuscriptFileUrl != null) 'manuscriptFileUrl': manuscriptFileUrl,
        'allowFreeDownload': allowFreeDownload,
      };
}
