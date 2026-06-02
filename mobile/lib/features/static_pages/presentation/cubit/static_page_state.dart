import 'package:equatable/equatable.dart';

sealed class StaticPageState extends Equatable {
  const StaticPageState();
  @override
  List<Object?> get props => const [];
}

final class StaticPageInitial extends StaticPageState {
  const StaticPageInitial();
}

final class StaticPageLoading extends StaticPageState {
  const StaticPageLoading();
}

final class StaticPageLoaded extends StaticPageState {
  const StaticPageLoaded({required this.slug, required this.title, required this.content});
  final String slug;
  final String title;
  final String content;
  @override
  List<Object?> get props => [slug, title, content];
}

final class StaticPageError extends StaticPageState {
  const StaticPageError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
