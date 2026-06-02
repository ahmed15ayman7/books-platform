import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/failure_messages.dart' as core;

import '../../domain/repositories/ratings_repository.dart';
import 'ratings_state.dart';

@injectable
class RatingsCubit extends Cubit<RatingsState> {
  RatingsCubit(this._repository) : super(const RatingsInitial());

  final RatingsRepository _repository;

  Future<void> load(String productId) async {
    emit(const RatingsLoading());
    final result = await _repository.getRatings(productId);
    result.fold(
      (failure) => emit(RatingsError(core.failureToMessage(failure))),
      (rating) => emit(RatingsLoaded(rating)),
    );
  }

  Future<void> submitRating(String productId, String email, int stars) async {
    emit(const RatingsSubmitting());
    final result = await _repository.submitRating(productId, email, stars);
    result.fold(
      (failure) => emit(RatingsError(core.failureToMessage(failure))),
      (_) => emit(const RatingsSubmitted()),
    );
  }
}
