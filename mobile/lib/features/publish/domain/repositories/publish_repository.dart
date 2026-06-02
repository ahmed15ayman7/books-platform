import 'package:dartz/dartz.dart';

import '../../../../core/network/failure.dart';
import '../entities/eligibility_result.dart';
import '../entities/submission.dart';
import '../entities/submission_request.dart';

abstract class PublishRepository {
  Future<Either<Failure, EligibilityResult>> checkEligibility(String email);
  Future<Either<Failure, Submission>> submitBook(SubmissionRequest request);
}
