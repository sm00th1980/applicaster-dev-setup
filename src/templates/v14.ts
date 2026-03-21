export const v14 = [
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
          '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/ios/v14/setup.sh)"',
          "yarn start",
        ],
      },
      {
        name: "Native setup",
        commands: [
          "cd ${HOME}/projects/applicaster/ios/ZappAppleBuilder/ZappiOS/",
          "git reset --hard HEAD && git clean -xfd",
          "git checkout release-10.0.0",
          "zapptool -vi <APP_ID> -rn localhost:8081 -pu",
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
          '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/android_tv/setup.sh)"',
          "yarn start",
        ],
      },
      {
        name: "Native setup",
        commands: [
          "cd ${HOME}/projects/applicaster/android/zapp-platform-android",
          "git reset --hard HEAD && git clean -xfd",
          "git checkout master",
          "rvm use 2.7.8-perf && bundle update --bundler && bundle exec rake prepare_workspace VERSION=<APP_ID>",
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
          '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/tvos/v14/setup.sh)"',
          "yarn start",
        ],
      },
      {
        name: "Native setup",
        commands: [
          "cd ${HOME}/projects/applicaster/tvos/ZappAppleBuilder/ZappTvOS/",
          "git reset --hard HEAD && git clean -xfd",
          "git checkout release-10.0.0",
          "zapptool -vi <APP_ID> -rn localhost:8081 -pu",
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
          '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/androidtv/v14/setup.sh)"',
          "yarn start",
        ],
      },
      {
        name: "Native setup",
        commands: [
          "cd ${HOME}/projects/applicaster/androidtv/zapp-platform-android",
          "git reset --hard HEAD && git clean -xfd",
          "git checkout master",
          "rvm use 2.7.8-perf && bundle update --bundler && bundle exec rake prepare_workspace VERSION=<APP_ID>",
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
          '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/firetv/v14/setup.sh)"',
          "yarn start",
        ],
      },
      {
        name: "Native setup",
        commands: [
          "cd ${HOME}/projects/applicaster/firetv/zapp-platform-android",
          "git reset --hard HEAD && git clean -xfd",
          "git checkout master",
          "rvm use 2.7.8-perf && bundle update --bundler && bundle exec rake prepare_workspace VERSION=<APP_ID>",
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
          "yarn start:web",
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
          "yarn start:web",
        ],
      },
    ],
  },
];
