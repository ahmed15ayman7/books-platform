import 'package:equatable/equatable.dart';

sealed class NewsletterState extends Equatable {
  const NewsletterState();
  @override
  List<Object?> get props => const [];
}

final class NewsletterInitial extends NewsletterState {
  const NewsletterInitial();
}

final class NewsletterLoading extends NewsletterState {
  const NewsletterLoading();
}

final class NewsletterSuccess extends NewsletterState {
  const NewsletterSuccess({required this.message, required this.alreadySubscribed});
  final String message;
  final bool alreadySubscribed;
  @override
  List<Object?> get props => [message, alreadySubscribed];
}

final class NewsletterError extends NewsletterState {
  const NewsletterError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
