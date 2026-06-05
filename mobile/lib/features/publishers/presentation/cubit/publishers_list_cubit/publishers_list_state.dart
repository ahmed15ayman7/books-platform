import 'package:equatable/equatable.dart';

import '../../../domain/entities/publisher.dart';

sealed class PublishersListState extends Equatable {
  const PublishersListState();
  @override
  List<Object?> get props => const [];
}

final class PublishersListInitial extends PublishersListState {
  const PublishersListInitial();
}

final class PublishersListLoading extends PublishersListState {
  const PublishersListLoading();
}

final class PublishersListSuccess extends PublishersListState {
  const PublishersListSuccess({
    required this.publishers,
    required this.countries,
    this.activeCountry,
    this.activeSearch = '',
  });
  final List<Publisher> publishers;
  final List<String> countries;
  final String? activeCountry;
  final String activeSearch;
  @override
  List<Object?> get props => [publishers, countries, activeCountry, activeSearch];
}

final class PublishersListError extends PublishersListState {
  const PublishersListError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
