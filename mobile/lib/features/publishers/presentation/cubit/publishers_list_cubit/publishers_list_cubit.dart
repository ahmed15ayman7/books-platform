import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../../core/network/failure_messages.dart' as core;
import '../../../domain/repositories/base_publishers_repository.dart';
import 'publishers_list_state.dart';

@injectable
class PublishersListCubit extends Cubit<PublishersListState> {
  PublishersListCubit(this._repo) : super(const PublishersListInitial());

  final PublishersRepository _repo;
  String? _activeCountry;
  String _activeSearch = '';

  Future<void> refresh() => load();

  Future<void> load() async {
    _activeCountry = null;
    _activeSearch = '';
    emit(const PublishersListLoading());

    final countriesResult = await _repo.getCountries();
    if (countriesResult.isLeft()) {
      final f = countriesResult.fold((f) => f, (_) => null)!;
      emit(PublishersListError(core.failureToMessage(f)));
      return;
    }

    final pubResult = await _repo.getPublishers();
    if (pubResult.isLeft()) {
      final f = pubResult.fold((f) => f, (_) => null)!;
      emit(PublishersListError(core.failureToMessage(f)));
      return;
    }

    emit(PublishersListSuccess(
      publishers: pubResult.getOrElse(() => []),
      countries: countriesResult.getOrElse(() => []),
    ));
  }

  Future<void> filterByCountry(String? country) async {
    _activeCountry = country;
    _activeSearch = '';
    final current = state;
    if (current is! PublishersListSuccess) return;
    final result = await _repo.getPublishers(countryName: country);
    result.fold(
      (f) => emit(PublishersListError(core.failureToMessage(f))),
      (pubs) => emit(PublishersListSuccess(
        publishers: pubs,
        countries: current.countries,
        activeCountry: _activeCountry,
      )),
    );
  }

  Future<void> search(String query) async {
    _activeSearch = query.trim();
    _activeCountry = null;
    final current = state;
    if (current is! PublishersListSuccess) return;
    final result = await _repo.getPublishers(
      search: _activeSearch.isEmpty ? null : _activeSearch,
    );
    result.fold(
      (f) => emit(PublishersListError(core.failureToMessage(f))),
      (pubs) => emit(PublishersListSuccess(
        publishers: pubs,
        countries: current.countries,
        activeSearch: _activeSearch,
      )),
    );
  }
}
