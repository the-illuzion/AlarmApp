# Setup Guide for AlarmApp

This guide provides detailed instructions for setting up the AlarmApp project, including Firebase configuration, building, and deployment.

## Prerequisites

- **Node.js**: Version 14 or later ([Download](https://nodejs.org/))
- **React Native CLI**: Install globally with `npm install -g @react-native-community/cli`
- **Android Studio**: For Android development ([Download](https://developer.android.com/studio))
- **Xcode**: For iOS development (macOS only)
- **Firebase Account**: Create at [Firebase Console](https://console.firebase.google.com/)

## Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "AlarmApp")
4. Enable Google Analytics if desired
5. Choose Google Analytics account or create new
6. Click "Create project"

### 2. Add Android App

1. In your Firebase project, click the Android icon to add an Android app
2. Package name: `com.alarmappnew`
3. App nickname: AlarmApp (Android)
4. SHA-1 fingerprint: Optional for now, can add later
5. Click "Register app"

### 3. Download google-services.json

1. Download the `google-services.json` file
2. Place it in `android/app/google-services.json`

### 4. Enable Firebase Services

In Firebase Console:

- **Authentication**: Enable if needed for user login
- **Firestore Database**: Enable if using database features
- **Storage**: Enable if using file storage
- **Functions**: Enable if using cloud functions
- **Messaging**: Enable for push notifications

## Project Setup

### 1. Clone Repository

```sh
git clone git@github.com:the-illuzion/AlarmApp.git
cd AlarmApp
```

### 2. Install Dependencies

```sh
npm install
# or
yarn install
```

### 3. iOS Setup (macOS only)

```sh
cd ios
bundle install
bundle exec pod install
cd ..
```

## Building and Running

### Android

```sh
# Start Metro
npm start

# In another terminal
npm run android
```

### iOS

```sh
# Start Metro
npm start

# In another terminal
npm run ios
```

## Environment Variables

If using environment variables, create a `.env` file in the root:

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# etc.
```

Add `.env` to `.gitignore` if not already present.

## Permissions

The app requires the following permissions (configured in AndroidManifest.xml):

- `INTERNET`: For network requests
- `VIBRATE`: For alarm vibrations
- `WAKE_LOCK`: To keep device awake
- `RECEIVE_BOOT_COMPLETED`: To restart alarms after reboot
- `FOREGROUND_SERVICE`: For background services
- `ACCESS_COARSE_LOCATION` & `ACCESS_FINE_LOCATION`: For location-based features
- `ACCESS_BACKGROUND_LOCATION`: For background location access

## Troubleshooting

### Common Issues

1. **Firebase initialization error**: Ensure `google-services.json` is in the correct location and Firebase is properly configured.

2. **Build failures**: Clean and rebuild:
   ```sh
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

3. **Metro issues**: Clear cache:
   ```sh
   npm start -- --reset-cache
   ```

4. **iOS pod issues**: Reinstall pods:
   ```sh
   cd ios
   rm -rf Pods
   bundle exec pod install
   ```

### Firebase Debug

- Use Firebase Console to monitor app usage
- Check device logs for Firebase errors
- Ensure SHA-1 is added for release builds

## Deployment

### Android APK

```sh
cd android
./gradlew assembleRelease
```

The APK will be in `android/app/build/outputs/apk/release/`

### iOS App Store

Follow React Native deployment guide for iOS.

## Support

For issues or questions:
- Check the [README.md](../README.md)
- Open an issue on GitHub
- Refer to [React Native Docs](https://reactnative.dev/docs/getting-started)
