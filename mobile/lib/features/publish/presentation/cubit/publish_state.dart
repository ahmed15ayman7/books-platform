import 'package:equatable/equatable.dart';

import '../../domain/entities/submission.dart';

sealed class PublishState extends Equatable {
  const PublishState();
  @override
  List<Object?> get props => const [];
}

final class PublishInitial extends PublishState {
  const PublishInitial();
}

final class PublishStep extends PublishState {
  const PublishStep({required this.step, required this.formData});
  final int step;
  final Map<String, dynamic> formData;
  @override
  List<Object?> get props => [step, formData];
}

final class CheckingEligibility extends PublishState {
  const CheckingEligibility();
}

final class EligibilityLoaded extends PublishState {
  const EligibilityLoaded({required this.isEligibleForFree});
  final bool isEligibleForFree;
  @override
  List<Object?> get props => [isEligibleForFree];
}

final class UploadingFile extends PublishState {
  const UploadingFile({required this.progress});
  final double progress;
  @override
  List<Object?> get props => [progress];
}

final class PublishSubmitting extends PublishState {
  const PublishSubmitting();
}

final class PublishSuccess extends PublishState {
  const PublishSuccess(this.submission);
  final Submission submission;
  @override
  List<Object?> get props => [submission];
}

final class PublishError extends PublishState {
  const PublishError(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}
