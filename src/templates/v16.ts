export const v16 = [
  {
    id: "ios",
    name: "iOS",
    groups: [
      {
        name: "QuickBrick setup",
        commands: [
          "cd ${HOME}/projects/applicaster/ios/QuickBrick",
          "git reset --hard HEAD && git clean -xfd",
          "yarn && yarn zapplicaster prepare -a <APP_ID>",
          '/bin/bash -c "$(curl -fsSL https://applicaster-dev-setup.vercel.app/setup/ios/v16/setup.sh)"',
          "yarn start",
        ],
      },
      {
        name: "Native setup",
        commands: [
          "cd ${HOME}/projects/applicaster/ios/ZappAppleBuilder/ZappiOS/",
          "git reset --hard HEAD && git clean -xfd",
          "git checkout master",
          "git pull",
          "rvm use 3.4.1 && zapptool -vi <APP_ID> -rn localhost:8081 -pu",
        ],
      },
    ],
  },
  {
    id: "android",
    name: "Android",
    groups: [
      {
        name: "QuickBrick setup",
        commands: [
          "cd ${HOME}/projects/applicaster/android/QuickBrick",
          "git reset --hard HEAD && git clean -xfd",
          "yarn && yarn zapplicaster prepare -a <APP_ID>",
          '/bin/bash -c "$(curl -fsSL https://applicaster-dev-setup.vercel.app/setup/androidtv/setup.sh)"',
          "yarn start",
        ],
      },
      {
        name: "Native setup",
        commands: [
          "cd ${HOME}/projects/applicaster/android/zapp-platform-android",
          "git reset --hard HEAD && git clean -xfd",
          "git checkout master",
          "git pull",
          "rvm use 2.7.8-perf && bundle update --bundler && bundle exec rake prepare_workspace VERSION=<APP_ID>",
        ],
      },
      {
        name: "Deploy to emulator",
        commands: [
          "cd ${HOME}/projects/applicaster/android/zapp-platform-android",
          "adb -s emulator-5556 reverse tcp:8081 tcp:8081 && ANDROID_SERIAL=emulator-5556 ./gradlew installMobileGoogleDebug -PREACT_NATIVE_PACKAGER_ROOT=localhost:8081",
        ],
      },
      {
        name: "Deploy to attached device",
        commands: [
          "cd ${HOME}/projects/applicaster/android/zapp-platform-android",
          "adb reverse tcp:8081 tcp:8081 && ./gradlew installMobileGoogleDebug -PREACT_NATIVE_PACKAGER_ROOT=192.168.88.141:8081",
        ],
      },
    ],
  },
  {
    id: "tvos",
    name: "tvOS",
    groups: [
      {
        name: "QuickBrick setup",
        commands: [
          "cd ${HOME}/projects/applicaster/tvos/QuickBrick",
          "git reset --hard HEAD && git clean -xfd",
          "yarn && yarn add react-native@npm:react-native-tvos@0.77.2-1 && yarn zapplicaster prepare -a -b <APP_ID>",
          '/bin/bash -c "$(curl -fsSL https://applicaster-dev-setup.vercel.app/setup/tvos/v16/setup.sh)"',
          "yarn start",
        ],
      },
      {
        name: "Native setup",
        commands: [
          "cd ${HOME}/projects/applicaster/tvos/ZappAppleBuilder/ZappTvOS/",
          "git reset --hard HEAD && git clean -xfd",
          "git checkout master",
          "git pull",
          "rvm use 3.4.1 && zapptool -vi <APP_ID> -rn localhost:8081 -pu",
        ],
      },
    ],
  },
  {
    id: "androidtv",
    name: "AndroidTV",
    groups: [
      {
        name: "QuickBrick setup",
        commands: [
          "cd ${HOME}/projects/applicaster/androidtv/QuickBrick",
          "git reset --hard HEAD && git clean -xfd",
          "yarn && yarn zapplicaster prepare -a <APP_ID>",
          '/bin/bash -c "$(curl -fsSL https://applicaster-dev-setup.vercel.app/setup/androidtv/setup.sh)"',
          "yarn start",
        ],
      },
      {
        name: "Native setup",
        commands: [
          "cd ${HOME}/projects/applicaster/androidtv/zapp-platform-android",
          "git reset --hard HEAD && git clean -xfd",
          "git checkout master",
          "git pull",
          "rvm use 2.7.8-perf && bundle update --bundler && bundle exec rake prepare_workspace VERSION=<APP_ID>",
        ],
      },
      {
        name: "Deploy to emulator",
        commands: [
          "cd ${HOME}/projects/applicaster/androidtv/zapp-platform-android",
          "adb -s emulator-5556 reverse tcp:8081 tcp:8081 && ANDROID_SERIAL=emulator-5556 ./gradlew installTvGoogleDebug -PREACT_NATIVE_PACKAGER_ROOT=localhost:8081",
        ],
      },
      {
        name: "Build release and deploy to device",
        commands: [
          "cd ${HOME}/projects/applicaster/androidtv/QuickBrick",
          "rm -f ./android/main.hbc",
          "rm -f ../zapp-platform-android/app/build/outputs/apk/tvGoogle/release/app-tv-google-release.apk",
          '/bin/bash -c "$(curl -fsSL https://applicaster-dev-setup.vercel.app/setup/androidtv/patch-package-json.sh)"',
          "yarn build:ts && yarn build:android && yarn build:hermes:android",
          "cp ./android/main.hbc ../zapp-platform-android/app/src/tvGoogle/assets",
          "cd ${HOME}/projects/applicaster/androidtv/zapp-platform-android",
          '/bin/bash -c "$(curl -fsSL https://applicaster-dev-setup.vercel.app/setup/androidtv/patch-release-signing-debug.sh)"',
          "./gradlew assembleRelease",
          "adb disconnect 192.168.88.121 2>/dev/null || true && adb connect 192.168.88.121 && adb -s 192.168.88.121:5555 install -r ./app/build/outputs/apk/tvGoogle/release/app-tv-google-release.apk",
        ],
      },
    ],
  },
  {
    id: "firetv",
    name: "FireTV",
    groups: [
      {
        name: "QuickBrick setup",
        commands: [
          "cd ${HOME}/projects/applicaster/firetv/QuickBrick",
          "git reset --hard HEAD && git clean -xfd",
          "yarn && yarn zapplicaster prepare -a <APP_ID>",
          '/bin/bash -c "$(curl -fsSL https://applicaster-dev-setup.vercel.app/setup/androidtv/setup.sh)"',
          "yarn start",
        ],
      },
      {
        name: "Native setup",
        commands: [
          "cd ${HOME}/projects/applicaster/firetv/zapp-platform-android",
          "git reset --hard HEAD && git clean -xfd",
          "git checkout master",
          "git pull",
          "rvm use 2.7.8-perf && bundle update --bundler && bundle exec rake prepare_workspace VERSION=<APP_ID>",
        ],
      },
      {
        name: "Deploy to emulator",
        commands: [
          "cd ${HOME}/projects/applicaster/firetv/zapp-platform-android",
          "adb -s emulator-5556 reverse tcp:8081 tcp:8081 && ANDROID_SERIAL=emulator-5556 ./gradlew installTvAmazonDebug -PREACT_NATIVE_PACKAGER_ROOT=localhost:8081",
        ],
      },
      {
        name: "Build release and deploy to device",
        commands: [
          "cd ${HOME}/projects/applicaster/firetv/QuickBrick",
          "rm -f ./android/main.hbc",
          "rm -f ../zapp-platform-android/app/build/outputs/apk/tvAmazon/release/app-tv-amazon-release.apk",
          "yarn build:ts && yarn build:android_tv && yarn build:hermes:android",
          "cp ./android/main.hbc ../zapp-platform-android/app/src/tvAmazon/assets",
          "cd ${HOME}/projects/applicaster/androidtv/zapp-platform-android",
          '/bin/bash -c "$(curl -fsSL https://applicaster-dev-setup.vercel.app/setup/androidtv/patch-release-signing-debug.sh)"',
          "./gradlew assembleRelease",
          "adb disconnect 192.168.88.121 2>/dev/null || true && adb connect 192.168.88.121 && adb -s 192.168.88.121:5555 install -r ./app/build/outputs/apk/tvGoogle/release/app-tv-amazon-release.apk",
        ],
      },
    ],
  },
  {
    id: "samsung",
    name: "Samsung TV (Tizen OS)",
    groups: [
      {
        name: "QuickBrick setup",
        commands: [
          "cd ${HOME}/projects/applicaster/samsung/QuickBrick",
          "git reset --hard HEAD && git clean -xfd",
          "yarn && yarn zapplicaster prepare -a <APP_ID>",
          "yarn start",
        ],
      },
      {
        name: "TS and build",
        commands: [
          "cd ${HOME}/projects/applicaster/samsung/QuickBrick",
          "yarn build:ts && yarn build:web",
        ],
      },
      {
        name: "Install on device",
        commands: [
          "sdb disconnect 192.168.88.108 && sdb connect 192.168.88.108",
          "tizen package --type wgt --output ./ --sign Ruslan4 -- ./source",
          "mv The\ App.wgt com.apptheapp_14.0.12-build.9-debug.wgt",
          "tizen package --type wgt --sign Ruslan4 -- ./com.apptheapp_14.0.12-build.9-debug.wgt",
          "tizen install -t UE43AU7100UXCE --name ./com.watchnow.yestv_4.0.10-build.44-debug.wgt",
        ],
      },
    ],
  },
  {
    id: "lg",
    name: "LG TV (WebOS)",
    groups: [
      {
        name: "QuickBrick setup",
        commands: [
          "cd ${HOME}/projects/applicaster/lg/QuickBrick",
          "git reset --hard HEAD && git clean -xfd",
          "yarn && yarn zapplicaster prepare -a <APP_ID>",
          "yarn start",
        ],
      },
      {
        name: "TS and build",
        commands: [
          "cd ${HOME}/projects/applicaster/lg/QuickBrick",
          "yarn build:ts && yarn build:web",
        ],
      },
    ],
  },
];
