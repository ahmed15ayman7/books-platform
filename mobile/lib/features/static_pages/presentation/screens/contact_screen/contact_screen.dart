import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/widgets/app_bar_widget.dart';

import 'contact_body.dart';

enum _Phase { idle, loading, success }

class ContactScreen extends StatefulWidget {
  const ContactScreen({super.key});

  @override
  State<ContactScreen> createState() => _ContactScreenState();
}

class _ContactScreenState extends State<ContactScreen> {
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _messageCtrl = TextEditingController();

  var _phase = _Phase.idle;
  var _errors = <String, String>{};

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _messageCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    final errors = <String, String>{};
    if (_nameCtrl.text.trim().isEmpty) {
      errors['name'] = 'contact.name_required'.tr();
    }
    final emailRx = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
    if (!emailRx.hasMatch(_emailCtrl.text.trim())) {
      errors['email'] = 'validation.email'.tr();
    }
    if (_messageCtrl.text.trim().isEmpty) {
      errors['message'] = 'contact.message_required'.tr();
    }
    if (errors.isNotEmpty) {
      setState(() => _errors = errors);
      return;
    }
    setState(() {
      _errors = {};
      _phase = _Phase.loading;
    });
    Future.delayed(const Duration(milliseconds: 800), () {
      if (mounted) setState(() => _phase = _Phase.success);
    });
  }

  void _reset() {
    _nameCtrl.clear();
    _emailCtrl.clear();
    _phoneCtrl.clear();
    _messageCtrl.clear();
    setState(() {
      _phase = _Phase.idle;
      _errors = {};
    });
  }

  @override
  Widget build(BuildContext context) {
    final lang = context.locale.languageCode;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          AppBarWidget(
            variant: AppBarVariant.title,
            title: 'contact_us_title'.tr(),
            showBack: true,
            currentLocale: lang,
            onLocaleChanged: (l) => context.setLocale(Locale(l)),
          ),
          Expanded(
            child: SafeArea(
              top: false,
              child: SingleChildScrollView(
                child: ContactBody(
                  lang: lang,
                  nameCtrl: _nameCtrl,
                  emailCtrl: _emailCtrl,
                  phoneCtrl: _phoneCtrl,
                  messageCtrl: _messageCtrl,
                  errors: _errors,
                  isLoading: _phase == _Phase.loading,
                  isSuccess: _phase == _Phase.success,
                  onSubmit: _submit,
                  onReset: _reset,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
