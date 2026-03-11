export type CommandLine = string;

export type CommandGroup = {
  name: string;
  commands: CommandLine[];
};

export type PlatformTemplate = {
  id: string;
  name: string;
  groups: CommandGroup[];
};

export type FrameworkVersion = "v15" | "v14";

export type PlatformTemplates = Record<FrameworkVersion, PlatformTemplate[]>;

function generateCommandLine(line: string, appId: string): string {
  return line.replaceAll("<APP_ID>", appId);
}

export function generateCommands(
  template: PlatformTemplate,
  appId: string,
): PlatformTemplate {
  return {
    ...template,
    groups: template.groups.map((group) => ({
      ...group,
      commands: group.commands.map((cmd) => generateCommandLine(cmd, appId)),
    })),
  };
}

export const platformTemplates: PlatformTemplates = {
  v15: [
    {
      id: "ios",
      name: "iOS",
      groups: [
        {
          name: "JS Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/ios/QuickBrick",
            "git reset --hard HEAD && git clean -xfd",
            "yarn && yarn zapplicaster prepare -a <APP_ID>",
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/ios/v15/setup.sh)"',
          ],
        },
        {
          name: "Native Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/ios/ZappAppleBuilder/ZappiOS/",
            "git reset --hard HEAD && git clean -xfd",
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
          name: "JS Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/android/QuickBrick",
            "git reset --hard HEAD && git clean -xfd",
            "yarn && yarn zapplicaster prepare -a <APP_ID>",
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/android/v15/setup.sh)"',
          ],
        },
        {
          name: "Native Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/android/ZappAndroidBuilder",
            "git reset --hard HEAD && git clean -xfd",
            "./gradlew clean",
            "./gradlew assembleDebug -Dapp.id=<APP_ID>",
          ],
        },
      ],
    },
    {
      id: "tvos",
      name: "tvOS",
      groups: [
        {
          name: "JS Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/tvos/QuickBrick",
            "git reset --hard HEAD && git clean -xfd",
            "yarn && yarn add react-native@npm:react-native-tvos@0.77.2-1 && yarn zapplicaster prepare -a -b <APP_ID>",
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/tvos/v15/setup.sh)"',
          ],
        },
        {
          name: "Native Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/tvos/ZappAppleBuilder/ZappTvOS/",
            "git reset --hard HEAD && git clean -xfd",
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
          name: "JS Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/androidtv/QuickBrick",
            "git reset --hard HEAD && git clean -xfd",
            "yarn && yarn zapplicaster prepare -a <APP_ID>",
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/androidtv/v15/setup.sh)"',
          ],
        },
        {
          name: "Native Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/androidtv/ZappAndroidBuilder",
            "git reset --hard HEAD && git clean -xfd",
            "./gradlew clean",
            "./gradlew assembleDebug -Dapp.id=<APP_ID>",
          ],
        },
      ],
    },
    {
      id: "firetv",
      name: "FireTV",
      groups: [
        {
          name: "JS Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/firetv/QuickBrick",
            "git reset --hard HEAD && git clean -xfd",
            "yarn && yarn zapplicaster prepare -a <APP_ID>",
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/firetv/v15/setup.sh)"',
          ],
        },
        {
          name: "Native Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/firetv/ZappAndroidBuilder",
            "git reset --hard HEAD && git clean -xfd",
            "./gradlew clean",
            "./gradlew assembleDebug -Dapp.id=<APP_ID>",
          ],
        },
      ],
    },
    {
      id: "samsung",
      name: "Samsung TV (Tizen OS)",
      groups: [
        {
          name: "JS Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/samsung/QuickBrick",
            "git reset --hard HEAD && git clean -xfd",
            "yarn && yarn zapplicaster prepare -a <APP_ID>",
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/samsung/v15/setup.sh)"',
          ],
        },
        {
          name: "Native Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/samsung/ZappTizenBuilder",
            "git reset --hard HEAD && git clean -xfd",
            "./build.sh <APP_ID>",
          ],
        },
      ],
    },
    {
      id: "lg",
      name: "LG TV (WebOS)",
      groups: [
        {
          name: "JS Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/lg/QuickBrick",
            "git reset --hard HEAD && git clean -xfd",
            "yarn && yarn zapplicaster prepare -a <APP_ID>",
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/lg/v15/setup.sh)"',
          ],
        },
        {
          name: "Native Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/lg/ZappWebOSBuilder",
            "git reset --hard HEAD && git clean -xfd",
            "./build.sh <APP_ID>",
          ],
        },
      ],
    },
  ],
  v14: [
    {
      id: "ios",
      name: "iOS",
      groups: [
        {
          name: "JS Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/ios/QuickBrick",
            "git reset --hard HEAD && git clean -xfd",
            "yarn && yarn zapplicaster prepare -a <APP_ID>",
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/ios/v14/setup.sh)"',
          ],
        },
        {
          name: "Native Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/ios/ZappAppleBuilder/ZappiOS/",
            "git reset --hard HEAD && git clean -xfd",
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
          name: "JS Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/android/QuickBrick",
            "git reset --hard HEAD && git clean -xfd",
            "yarn && yarn zapplicaster prepare -a <APP_ID>",
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/android/v14/setup.sh)"',
          ],
        },
        {
          name: "Native Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/android/ZappAndroidBuilder",
            "git reset --hard HEAD && git clean -xfd",
            "./gradlew clean",
            "./gradlew assembleDebug -Dapp.id=<APP_ID>",
          ],
        },
      ],
    },
    {
      id: "tvos",
      name: "tvOS",
      groups: [
        {
          name: "JS Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/tvos/QuickBrick",
            "git reset --hard HEAD && git clean -xfd",
            "yarn && yarn add react-native@npm:react-native-tvos@0.77.2-1 && yarn zapplicaster prepare -a -b <APP_ID>",
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/tvos/v14/setup.sh)"',
          ],
        },
        {
          name: "Native Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/tvos/ZappAppleBuilder/ZappiOS/",
            "git reset --hard HEAD && git clean -xfd",
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
          name: "JS Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/androidtv/QuickBrick",
            "git reset --hard HEAD && git clean -xfd",
            "yarn && yarn zapplicaster prepare -a <APP_ID>",
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/androidtv/v14/setup.sh)"',
          ],
        },
        {
          name: "Native Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/androidtv/ZappAndroidBuilder",
            "git reset --hard HEAD && git clean -xfd",
            "./gradlew clean",
            "./gradlew assembleDebug -Dapp.id=<APP_ID>",
          ],
        },
      ],
    },
    {
      id: "firetv",
      name: "FireTV",
      groups: [
        {
          name: "JS Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/firetv/QuickBrick",
            "git reset --hard HEAD && git clean -xfd",
            "yarn && yarn zapplicaster prepare -a <APP_ID>",
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/firetv/v14/setup.sh)"',
          ],
        },
        {
          name: "Native Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/firetv/ZappAndroidBuilder",
            "git reset --hard HEAD && git clean -xfd",
            "./gradlew clean",
            "./gradlew assembleDebug -Dapp.id=<APP_ID>",
          ],
        },
      ],
    },
    {
      id: "samsung",
      name: "Samsung TV (Tizen OS)",
      groups: [
        {
          name: "JS Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/samsung/QuickBrick",
            "git reset --hard HEAD && git clean -xfd",
            "yarn && yarn zapplicaster prepare -a <APP_ID>",
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/samsung/v14/setup.sh)"',
          ],
        },
        {
          name: "Native Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/samsung/ZappTizenBuilder",
            "git reset --hard HEAD && git clean -xfd",
            "./build.sh <APP_ID>",
          ],
        },
      ],
    },
    {
      id: "lg",
      name: "LG TV (WebOS)",
      groups: [
        {
          name: "JS Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/lg/QuickBrick",
            "git reset --hard HEAD && git clean -xfd",
            "yarn && yarn zapplicaster prepare -a <APP_ID>",
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/sm00th1980/applicaster-dev/HEAD/lg/v14/setup.sh)"',
          ],
        },
        {
          name: "Native Setup",
          commands: [
            "cd ${HOME}/projects/applicaster/lg/ZappWebOSBuilder",
            "git reset --hard HEAD && git clean -xfd",
            "./build.sh <APP_ID>",
          ],
        },
      ],
    },
  ],
};
