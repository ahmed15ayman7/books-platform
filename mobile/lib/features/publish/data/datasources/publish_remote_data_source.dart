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
            isEligibleForFree: data['isEligibleForFree'] as bool? ?? true,
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
          final sub = data['submission'] as Map<String, dynamic>? ?? {};
          return Submission(
            id: sub['_id'] as String? ?? sub['id'] as String? ?? '',
            status: sub['status'] as String? ?? 'PENDING',
            isFirstFree: sub['isFirstFree'] as bool? ?? false,
            requiresPayment: data['requiresPayment'] as bool? ?? false,
            paymentStatus: sub['paymentStatus'] as String?,
          );
        },
      );
}
