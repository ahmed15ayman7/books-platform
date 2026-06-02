import 'package:equatable/equatable.dart';

class Comment extends Equatable {
  const Comment({
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

  @override
  List<Object?> get props => [id, authorName, content, date];
}
