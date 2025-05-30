# RimToken Android APK Build Guide

## Prerequisites
1. **Java Development Kit (JDK 17 or higher)**
   - Download from: https://adoptium.net/
   - Set JAVA_HOME environment variable

2. **Android Studio** (recommended) or **Android SDK Command Line Tools**
   - Download from: https://developer.android.com/studio

## Build Steps

### Method 1: Using Android Studio (Recommended)
1. Open terminal in your project directory
2. Run: `npx cap open android`
3. This opens Android Studio with your RimToken project
4. In Android Studio:
   - Select "Build" > "Build Bundle(s) / APK(s)" > "Build APK(s)"
   - Wait for build to complete
   - APK will be saved in: `android/app/build/outputs/apk/debug/`

### Method 2: Command Line Build
1. Ensure Java and Android SDK are installed
2. Set environment variables:
   ```bash
   export JAVA_HOME=/path/to/your/java
   export ANDROID_HOME=/path/to/your/android-sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```
3. Run: `npx cap build android`

### Method 3: Gradle Direct Build
1. Navigate to android directory: `cd android`
2. Run: `./gradlew assembleDebug`
3. APK location: `app/build/outputs/apk/debug/app-debug.apk`

## APK Locations
After successful build, your APK files will be located at:
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

## App Details
- **App Name**: RimToken
- **Package ID**: com.rimtoken.app
- **Version**: 1.0.0
- **Features**: Complete cryptocurrency trading platform with real-time prices

## Troubleshooting
- If Java errors occur, ensure JAVA_HOME points to JDK installation
- If Android SDK errors occur, install Android SDK and set ANDROID_HOME
- For signing errors, use debug build for testing

## Next Steps After APK Creation
1. Test APK on Android device or emulator
2. For Google Play Store release, create signed release APK
3. Upload to Google Play Console for distribution

The APK will contain your complete RimToken platform as a native Android application.