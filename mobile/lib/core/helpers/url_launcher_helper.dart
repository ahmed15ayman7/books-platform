import 'package:easy_localization/easy_localization.dart';
import 'package:injectable/injectable.dart';
import 'package:url_launcher/url_launcher.dart';

import 'snack_bar_helper.dart';

@lazySingleton
class UrlLauncherHelper {
  UrlLauncherHelper(this._snackBarHelper);

  final SnackBarHelper _snackBarHelper;

  Future<void> launchExternalUrl(String url) async {
    final uri = Uri.tryParse(url);
    if (uri == null) {
      _snackBarHelper.showError('social_link_error'.tr());
      return;
    }
    final launched =
        await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!launched) {
      _snackBarHelper.showError('social_link_error'.tr());
    }
  }
}
