import 'package:equatable/equatable.dart';

import '../../../domain/entities/publisher.dart';
import '../../../domain/entities/publisher_book.dart';

sealed class PublisherDetailState extends Equatable {
  const PublisherDetailState();
  @override
  List<Object?> get props => const [];
}

final class PublisherDetailInitial extends PublisherDetailState {
  const PublisherDetailInitial();
}

final class PublisherDetailLoading extends PublisherDetailState {
  const PublisherDetailLoading();
}

final class PublisherDetailSuccess extends PublisherDetailState {
  const PublisherDetailSuccess({required this.publisher, required this.books});
  final Publisher publisher;
  final List<PublisherBook> books;
  @override
  List<Object?> get props => [publisher, books];
}

final class PublisherDetailError extends PublisherDetailState {
  const PublisherDetailError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
