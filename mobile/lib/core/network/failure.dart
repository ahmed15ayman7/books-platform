import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  const Failure();
}

class ServerFailure extends Failure {
  final int statusCode;
  final String message;

  const ServerFailure(this.statusCode, this.message);

  @override
  List<Object?> get props => [statusCode, message];
}

class NetworkFailure extends Failure {
  const NetworkFailure();

  @override
  List<Object?> get props => const [];
}

class UnauthorizedFailure extends Failure {
  const UnauthorizedFailure();

  @override
  List<Object?> get props => const [];
}

class CacheFailure extends Failure {
  const CacheFailure();

  @override
  List<Object?> get props => const [];
}

class ValidationFailure extends Failure {
  final String message;

  const ValidationFailure(this.message);

  @override
  List<Object?> get props => [message];
}

class UnexpectedFailure extends Failure {
  final String message;

  const UnexpectedFailure(this.message);

  @override
  List<Object?> get props => [message];
}
