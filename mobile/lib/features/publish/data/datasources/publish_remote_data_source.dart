import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/api_envelope.dart';
import '../../../../core/network/api_manager.dart';
import '../../../../core/network/failure.dart';
import '../../domain/entities/eligibility_result.dart';
import '../../domain/entities/submission.dart';
import '../../domain/entities/submission_request.dart';

@lazySingleton
class PublishRemoteDataSource {
  PublishRemoteDataSource(this._api);

  final ApiManager _api;

  Future<Either<Failure, EligibilityResult>> checkEligibility(String email) =>
      _api.get(
        path: '/submissions/check-eligibility',
        queryParameters: {'email': email},
        fromJson: (json) {
          final data = ApiEnvelope.fromJson(
            json,
            fromData: (d) => d,
          ).data!;
          return EligibilityResult(
            isEligibleForFree: data['isFirstFree'] as bool? ?? true,
            submissionsCount: (data['submissionsCount'] as num?)?.toInt() ?? 0,
          );
        },
      );

  Future<Either<Failure, Submission>> submitBook(SubmissionRequest request) =>
      _api.post(
        path: '/submissions',
        data: request.toJson(),
        fromJson: (json) {
          final data = ApiEnvelope.fromJson(
            json,
            fromData: (d) => d,
          ).data!;
          return Submission(
            id: data['_id'] as String? ?? data['id'] as String? ?? '',
            status: data['status'] as String? ?? 'PENDING',
            isFirstFree: data['isFirstFree'] as bool? ?? false,
            requiresPayment: data['requiresPayment'] as bool? ?? false,
            paymentStatus: data['paymentStatus'] as String?,
          );
        },
      );
}
