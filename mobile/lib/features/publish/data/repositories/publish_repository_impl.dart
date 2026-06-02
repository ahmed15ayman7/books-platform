import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/failure.dart';
import '../../domain/entities/eligibility_result.dart';
import '../../domain/entities/submission.dart';
import '../../domain/entities/submission_request.dart';
import '../../domain/repositories/publish_repository.dart';
import '../datasources/publish_remote_data_source.dart';

@LazySingleton(as: PublishRepository)
class PublishRepositoryImpl implements PublishRepository {
  PublishRepositoryImpl(this._remote);

  final PublishRemoteDataSource _remote;

  @override
  Future<Either<Failure, EligibilityResult>> checkEligibility(String email) =>
      _remote.checkEligibility(email);

  @override
  Future<Either<Failure, Submission>> submitBook(SubmissionRequest request) =>
      _remote.submitBook(request);
}
