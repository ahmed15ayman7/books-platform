import 'package:flutter/foundation.dart';

import 'failure.dart';

String failureToMessage(Failure failure) => switch (failure) {
      NetworkFailure() => 'No internet connection.',
      UnauthorizedFailure() => 'Session expired. Please sign in again.',
      CacheFailure() => 'Local storage error.',
      ValidationFailure(:final message) => message,
      ServerFailure(:final statusCode, :final message) =>
        kReleaseMode ? 'Something went wrong. Please try again.' : '[$statusCode] $message',
      UnexpectedFailure(:final message) =>
        kReleaseMode ? 'Unexpected error.' : (message.isEmpty ? 'Unexpected error.' : message),
      Failure() => 'Unexpected error.',
    };
