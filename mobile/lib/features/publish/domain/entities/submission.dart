import 'package:equatable/equatable.dart';

class Submission extends Equatable {
  const Submission({
    required this.id,
    required this.status,
    required this.isFirstFree,
    required this.requiresPayment,
    this.paymentStatus,
  });

  final String id;
  final String status;
  final bool isFirstFree;
  final bool requiresPayment;
  final String? paymentStatus;

  @override
  List<Object?> get props => [id, status, isFirstFree, requiresPayment];
}
