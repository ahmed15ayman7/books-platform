import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'package:booksplatform/core/network/failure_messages.dart' as core;

import '../../domain/repositories/newsletter_repository.dart';
import 'newsletter_state.dart';

@injectable
class NewsletterCubit extends Cubit<NewsletterState> {
  NewsletterCubit(this._repository) : super(const NewsletterInitial());

  final NewsletterRepository _repository;

  Future<void> subscribe(String email, String locale) async {
    emit(const NewsletterLoading());
    final result = await _repository.subscribe(email, locale: locale);
    result.fold(
      (failure) => emit(NewsletterError(core.failureToMessage(failure))),
      (result) => emit(NewsletterSuccess(
        message: result.message,
        alreadySubscribed: result.alreadySubscribed,
      )),
    );
  }
}
