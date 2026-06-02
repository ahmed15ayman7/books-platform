import '../../domain/entities/comment.dart';

class CommentModel {
  const CommentModel({
    required this.id,
    required this.authorName,
    required this.content,
    required this.date,
    this.parentId,
    this.productId,
    this.articleId,
  });

  final String id;
  final String authorName;
  final String content;
  final DateTime date;
  final String? parentId;
  final String? productId;
  final String? articleId;

  factory CommentModel.fromJson(Map<String, dynamic> json) => CommentModel(
        id: json['_id'] as String? ?? json['id'] as String? ?? '',
        authorName: json['authorName'] as String? ?? '',
        content: json['content'] as String? ?? '',
        date: DateTime.tryParse(json['createdAt'] as String? ?? '') ?? DateTime.now(),
        parentId: json['parentId'] as String?,
        productId: json['productId'] as String?,
        articleId: json['articleId'] as String?,
      );

  Comment toEntity() => Comment(
        id: id,
        authorName: authorName,
        content: content,
        date: date,
        parentId: parentId,
        productId: productId,
        articleId: articleId,
      );
}
