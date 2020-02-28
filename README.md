# CodePushTest

## TODO

- [x] Create App Center account
  - r633639@regence.com (Lowell)
- [x] Create app in App Center: CodePushTest
- [x] Create new React Native app for testing (CodePushTest)
- [x] Create new GitHub repo: https://github.com/lowell-list/CodePushTest
- [x] Code-Pushify App
  - `npm install appcenter appcenter-analytics appcenter-crashes --save-exact`
  - `pod install` in `ios` dir
  - create new files with app secret:
    - `ios/AppCenter-Config.plist` and add it to Xcode project
    - `android/app/src/main/assets/appcenter-config.json`
  - modify `ios/CodePushTest/AppDelegate.m` per instructions
  - modify `android/app/src/main/res/values/strings.xml` per instructions
- [x] Create 3 deployment environments:
  - Staging
    - point to UAT BE
  - Production-Test
    - point to Prod BE
  - Production
    - point to Prod BE
- [x] Add button with simple call to Journi BE according to environment
- [x] Add Staging deployment key to sample app
- [ ] do a code push to the staging deployment environment
  - use CLI: `appcenter login`, which uses webpage redirect to login
- [ ] setup code signing for iOS and Android (seems to be optional)

