import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../../core/network/failure_messages.dart' as core;
import '../../../domain/repositories/base_publishers_repository.dart';
import 'publisher_detail_state.dart';

@injectable
class PublisherDetailCubit extends Cubit<PublisherDetailState> {
  PublisherDetailCubit(this._publishersRepo) : super(const PublisherDetailInitial());

  final PublishersRepository _publishersRepo;

  Future<void> load(String slug) async {
    emit(const PublisherDetailLoading());

    final result = await _publishersRepo.getPublisherBySlug(slug);
    result.fold(
      (f) => emit(PublisherDetailError(core.failureToMessage(f))),
      (record) {
        final (publisher, books) = record;
        emit(PublisherDetailSuccess(publisher: publisher, books: books));
      },
    );
  }
}
