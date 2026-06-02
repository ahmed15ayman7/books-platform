import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:booksplatform/features/publish/domain/entities/eligibility_result.dart';
import 'package:booksplatform/features/publish/domain/entities/submission.dart';
import 'package:booksplatform/features/publish/domain/entities/submission_request.dart';
import 'package:booksplatform/features/publish/domain/repositories/publish_repository.dart';
import 'package:booksplatform/features/publish/presentation/cubit/publish_cubit.dart';
import 'package:booksplatform/features/publish/presentation/cubit/publish_state.dart';
import 'package:booksplatform/features/publish/services/file_upload_service.dart';

class MockPublishRepository extends Mock implements PublishRepository {}

class MockFileUploadService extends Mock implements FileUploadService {}

void main() {
  late MockPublishRepository mockRepo;
  late MockFileUploadService mockUpload;
  late SharedPreferences prefs;
  late PublishCubit cubit;

  setUpAll(() {
    registerFallbackValue(
      const SubmissionRequest(
        authorName: '',
        authorEmail: '',
        authorPhone: '',
        authorBio: '',
        bookTitleAr: '',
        bookType: '',
        bookSummary: '',
        bookLanguage: '',
        bookCategory: '',
      ),
    );
  });

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    prefs = await SharedPreferences.getInstance();
    mockRepo = MockPublishRepository();
    mockUpload = MockFileUploadService();
    cubit = PublishCubit(mockRepo, mockUpload, prefs);
  });

  tearDown(() => cubit.close());

  group('PublishCubit', () {
    test('nextStep() increments step in PublishStep state', () async {
      // Initial state is PublishInitial; calling nextStep moves to step 1
      cubit.nextStep();
      expect(cubit.state, isA<PublishStep>());
      expect((cubit.state as PublishStep).step, 1);
    });

    test('prevStep() decrements step without losing formData', () {
      cubit
        ..updateField('authorName', 'Test Author')
        ..nextStep(); // step 1
      cubit.prevStep(); // back to step 0
      final state = cubit.state as PublishStep;
      expect(state.step, 0);
      expect(state.formData['authorName'], 'Test Author');
    });

    test('checkEligibility emits CheckingEligibility then EligibilityLoaded',
        () async {
      when(() => mockRepo.checkEligibility(any())).thenAnswer(
        (_) async => const Right(
          EligibilityResult(isEligibleForFree: true, submissionsCount: 0),
        ),
      );

      expect(
        cubit.stream,
        emitsInOrder([
          isA<CheckingEligibility>(),
          predicate<PublishState>(
            (s) => s is EligibilityLoaded && s.isEligibleForFree,
          ),
        ]),
      );

      await cubit.checkEligibility('test@test.com');
    });

    test('submit() calls FileUploadService.uploadFile before submitBook',
        () async {
      final callOrder = <String>[];
      cubit
        ..updateField('manuscriptLocalPath', '/tmp/book.pdf')
        ..updateField('coverLocalPath', '/tmp/cover.jpg');

      when(() => mockUpload.uploadFile(any())).thenAnswer((_) async {
        callOrder.add('uploadFile');
        return 'https://cdn.example.com/book.pdf';
      });
      when(() => mockUpload.uploadImage(any())).thenAnswer((_) async {
        callOrder.add('uploadImage');
        return 'https://cdn.example.com/cover.jpg';
      });
      when(() => mockRepo.submitBook(any())).thenAnswer((_) async {
        callOrder.add('submitBook');
        return const Right(
          Submission(
            id: 'sub-1',
            status: 'pending',
            isFirstFree: true,
            requiresPayment: false,
          ),
        );
      });

      await cubit.submit();

      expect(callOrder.indexOf('uploadFile'),
          lessThan(callOrder.indexOf('submitBook')));
    });
  });
}
