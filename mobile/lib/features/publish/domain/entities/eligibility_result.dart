import 'package:equatable/equatable.dart';

class EligibilityResult extends Equatable {
  const EligibilityResult({
    required this.isEligibleForFree,
    required this.submissionsCount,
  });

  final bool isEligibleForFree;
  final int submissionsCount;

  @override
  List<Object?> get props => [isEligibleForFree, submissionsCount];
}
