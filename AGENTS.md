# AGENTS.md - Project Understanding for AI Agents

## Project Overview

**Project Name**: AlarmApp  
**Description**: A React Native alarm application designed for gym workouts and fitness routines, featuring background notifications, location tracking, Firebase integration, and AI-powered chatbot for alarm management.  
**Version**: 1.1.0 (Phase 2: Chatbot Integration)  
**Platform**: Cross-platform (Android & iOS)  
**Tech Stack**: React Native, TypeScript, Firebase (Analytics, Messaging), Android (Kotlin), iOS (Objective-C/Swift), react-native-voice (voice input), local NLP parsing  

## Key Components

### Frontend
- **src/**: Source code directory with components and logic
- **index.js**: Metro bundler entry
- **Chatbot Component**: New AI chatbot for alarm management

### Alarm System (Extended)
- **Multiple Alarms Support**: Array of alarm objects with time, label, enabled status
- **Persistent Storage**: AsyncStorage for alarm list
- **Background Triggering**: Integrated with existing notification system

### Backend/Integrations
- **Firebase**: Used for push notifications, analytics, and potential database
- **Google Services**: google-services.json for Android configuration
- **Chatbot Logic**: Rule-based natural language parsing (expandable to LLM)

### Android Specific
- **MainApplication.kt**: Firebase initialization
- **MainActivity.kt**: React Activity
- **AndroidManifest.xml**: Permissions (vibrate, wake lock, location, foreground service, record audio for voice)
- **build.gradle**: Dependencies (Firebase BOM, analytics, messaging, react-native-voice)

### iOS Specific
- **Podfile**: CocoaPods dependencies (include react-native-voice)
- Android Studio / Xcode
- Firebase project with google-services.json

### Build Commands
- `npm install` / `yarn install`: Install dependencies
- `npm start` / `yarn start`: Start Metro
- `npm run android` / `yarn android`: Build Android
- `npm run ios` / `yarn ios`: Build iOS (macOS)

### Permissions
- INTERNET, VIBRATE, WAKE_LOCK, RECEIVE_BOOT_COMPLETED, FOREGROUND_SERVICE
- ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION, ACCESS_BACKGROUND_LOCATION

## Firebase Configuration
- Project: Created in Firebase Console
- Android App: Package `com.alarmappnew`
- Services: Messaging, Analytics enabled
- Config File: android/app/google-services.json

## Coding Standards
- TypeScript for new code
- ESLint + Prettier
- Functional components with hooks
- Kotlin for Android, Swift for iOS

## Documentation
- README.md: User guide
- SETUP.md: Detailed setup instructions
- CONTRIBUTING.md: Contribution guidelines
- AGENTS_CHANGELOG.md: Change log

## Agent Responsibilities

### Changelog Maintenance
**IMPORTANT**: After every user prompt and subsequent changes, update AGENTS_CHANGELOG.md with:
- Date and time
- Brief description of changes
- Reason/context for the change
- Files modified
- Any follow-up actions

Structure entries concisely for easy parsing by agents and humans. Use format:
```
[YYYY-MM-DD HH:MM] Change description | Reason: context | Files: list | Actions: next steps
```

This ensures a complete development history for reference and debugging.

## Common Issues
- Firebase init error: Check google-services.json placement
- Build failures: Clean gradle cache
- Permissions: Verify AndroidManifest.xml
- Metro issues: Reset cache

## Repository
- GitHub: git@github.com:the-illuzion/AlarmApp.git
- Branch: master (main development)
