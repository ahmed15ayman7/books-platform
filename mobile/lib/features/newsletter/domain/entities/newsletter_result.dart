import 'package:equatable/equatable.dart';

class NewsletterResult extends Equatable {
  const NewsletterResult({required this.message, required this.alreadySubscribed});

  final String message;
  final bool alreadySubscribed;

  @override
  List<Object?> get props => [message, alreadySubscribed];
}
