import 'package:file_picker/file_picker.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:booksplatform/core/network/failure.dart';
import 'package:booksplatform/core/network/failure_messages.dart' as core;

import '../../domain/entities/submission_request.dart';
import '../../domain/repositories/publish_repository.dart';
import '../../services/file_upload_service.dart';
import 'publish_state.dart';

@injectable
class PublishCubit extends Cubit<PublishState> {
  PublishCubit(this._repository, this._fileUpload, this._prefs)
      : super(const PublishInitial());

  final PublishRepository _repository;
  final FileUploadService _fileUpload;
  final SharedPreferences _prefs;

  Map<String, dynamic> _formData = {};
  int _currentStep = 0;

  void updateField(String key, dynamic value) {
    _formData = {..._formData, key: value};
    emit(PublishStep(step: _currentStep, formData: Map.from(_formData)));
  }

  Future<void> checkEligibility(String email) async {
    emit(const CheckingEligibility());
    final result = await _repository.checkEligibility(email);
    result.fold(
      (failure) => emit(PublishError(core.failureToMessage(failure))),
      (eligibility) =>
          emit(EligibilityLoaded(isEligibleForFree: eligibility.isEligibleForFree)),
    );
  }

  void nextStep() {
    _currentStep++;
    _saveFormDraft();
    emit(PublishStep(step: _currentStep, formData: Map.from(_formData)));
  }

  void prevStep() {
    if (_currentStep > 0) _currentStep--;
    emit(PublishStep(step: _currentStep, formData: Map.from(_formData)));
  }

  Future<void> pickFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );
    if (result == null || result.files.isEmpty) return;
    final file = result.files.first;
    if ((file.size) > 50 * 1024 * 1024) {
      emit(PublishError(core.failureToMessage(
        const ValidationFailure('File size exceeds 50MB limit'),
      )));
      emit(PublishStep(step: _currentStep, formData: Map.from(_formData)));
      return;
    }
    updateField('manuscriptLocalPath', file.path ?? '');
  }

  Future<void> pickCoverImage() async {
    final image = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (image == null) return;
    updateField('coverLocalPath', image.path);
  }

  Future<void> submit() async {
    emit(const UploadingFile(progress: 0.0));
    String? manuscriptUrl;
    String? coverUrl;

    final manuscriptPath = _formData['manuscriptLocalPath'] as String?;
    if (manuscriptPath != null && manuscriptPath.isNotEmpty) {
      manuscriptUrl = await _fileUpload.uploadFile(manuscriptPath);
    }

    emit(const UploadingFile(progress: 0.5));
    final coverPath = _formData['coverLocalPath'] as String?;
    if (coverPath != null && coverPath.isNotEmpty) {
      coverUrl = await _fileUpload.uploadImage(coverPath);
    }

    emit(const PublishSubmitting());

    final request = SubmissionRequest(
      authorName: _formData['authorName'] as String? ?? '',
      authorEmail: _formData['authorEmail'] as String? ?? '',
      authorPhone: _formData['authorPhone'] as String? ?? '',
      authorBio: _formData['authorBio'] as String? ?? '',
      bookTitleAr: _formData['bookTitleAr'] as String? ?? '',
      bookType: _formData['bookType'] as String? ?? '',
      bookSummary: _formData['bookSummary'] as String? ?? '',
      bookLanguage: _formData['bookLanguage'] as String? ?? '',
      bookCategory: _formData['bookCategory'] as String? ?? '',
      coverImageUrl: coverUrl,
      manuscriptFileUrl: manuscriptUrl,
    );

    final result = await _repository.submitBook(request);
    result.fold(
      (failure) => emit(PublishError(core.failureToMessage(failure))),
      (submission) {
        _clearDraft();
        emit(PublishSuccess(submission));
      },
    );
  }

  void _saveFormDraft() {
    _prefs.setString(
      'publish_draft',
      _formData.entries.map((e) => '${e.key}=${e.value}').join(';'),
    );
  }

  void _clearDraft() => _prefs.remove('publish_draft');

  void resetForm() {
    _formData = {};
    _currentStep = 0;
    _clearDraft();
    emit(const PublishInitial());
  }
}
