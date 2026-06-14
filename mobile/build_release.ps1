# Production release build — Google Play Store
# Output AAB : build/app/outputs/bundle/release/app-release.aab
# Symbol files: build/app/outputs/symbols/  (back these up with every release)

flutter build appbundle --release `
  --dart-define=ENVIRONMENT=prod `
  --obfuscate `
  --split-debug-info=build/app/outputs/symbols
