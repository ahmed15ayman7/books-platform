import 'package:intl/intl.dart';

class DateFormatterHelper {
  DateFormatterHelper._();

  static String formatDate(DateTime? date) {
    if (date == null) return '';
    return DateFormat('dd MMM yyyy', 'en_US').format(date);
  }

  static String formatDateTime(DateTime? date) {
    if (date == null) return '';
    return DateFormat('dd MMM yyyy • hh:mm a', 'en_US').format(date);
  }

  static String formatDayMonth(DateTime? date) {
    if (date == null) return '';
    return DateFormat('dd MMM', 'en_US').format(date);
  }

  static String formatMonthYear(DateTime? date) {
    if (date == null) return '';
    return DateFormat('MMM yyyy', 'en_US').format(date);
  }

  static String formatTimeAgo(DateTime? date) {
    if (date == null) return '';
    final diff = DateTime.now().difference(date);

    if (diff.inSeconds < 60) return 'just now';
    if (diff.inMinutes < 60) {
      final m = diff.inMinutes;
      return '$m minute${m == 1 ? '' : 's'} ago';
    }
    if (diff.inHours < 24) {
      final h = diff.inHours;
      return '$h hour${h == 1 ? '' : 's'} ago';
    }
    if (diff.inDays == 1) return 'yesterday';
    if (diff.inDays < 7) return '${diff.inDays} days ago';
    if (diff.inDays < 30) {
      final w = (diff.inDays / 7).floor();
      return '$w week${w == 1 ? '' : 's'} ago';
    }
    if (diff.inDays < 365) {
      final mo = (diff.inDays / 30).floor();
      return '$mo month${mo == 1 ? '' : 's'} ago';
    }
    final y = (diff.inDays / 365).floor();
    return '$y year${y == 1 ? '' : 's'} ago';
  }
}
