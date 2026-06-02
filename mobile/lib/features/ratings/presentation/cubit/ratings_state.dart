import 'package:equatable/equatable.dart';

import '../../domain/entities/rating.dart';

sealed class RatingsState extends Equatable {
  const RatingsState();
  @override
  List<Object?> get props => const [];
}

final class RatingsInitial extends RatingsState {
  const RatingsInitial();
}

final class RatingsLoading extends RatingsState {
  const RatingsLoading();
}

final class RatingsLoaded extends RatingsState {
  const RatingsLoaded(this.rating);
  final Rating rating;
  @override
  List<Object?> get props => [rating];
}

final class RatingsSubmitting extends RatingsState {
  const RatingsSubmitting();
}

final class RatingsSubmitted extends RatingsState {
  const RatingsSubmitted();
}

final class RatingsError extends RatingsState {
  const RatingsError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
