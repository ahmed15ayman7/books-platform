import 'package:injectable/injectable.dart';

abstract class FileUploadService {
  Future<String> uploadFile(String localPath);
  Future<String> uploadImage(String localPath);
}

@LazySingleton(as: FileUploadService)
class StubFileUploadServiceImpl implements FileUploadService {
  @override
  Future<String> uploadFile(String localPath) async {
    // TODO: integrate UploadThing or S3 — blocked on backend (Risk #2)
    return 'https://placeholder.booksplatform.net/stub/file';
  }

  @override
  Future<String> uploadImage(String localPath) async {
    // TODO: integrate UploadThing or S3 — blocked on backend (Risk #2)
    return 'https://placeholder.booksplatform.net/stub/image';
  }
}
