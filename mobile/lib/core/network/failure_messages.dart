import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/foundation.dart';

import 'failure.dart';

String failureToMessage(Failure failure) => switch (failure) {
      NetworkFailure() => 'errors.no_internet'.tr(),
      UnauthorizedFailure() => 'errors.session_expired'.tr(),
      CacheFailure() => 'errors.storage_error'.tr(),
      ValidationFailure(:final message) => message,
      ServerFailure(:final statusCode, :final message) =>
        kReleaseMode ? 'errors.something_went_wrong'.tr() : '[$statusCode] $message',
      UnexpectedFailure(:final message) =>
        kReleaseMode
            ? 'errors.unexpected'.tr()
            : (message.isEmpty ? 'errors.unexpected'.tr() : message),
      Failure() => 'errors.unexpected'.tr(),
    };
