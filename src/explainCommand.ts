const directories: Record<string, string> = {
  "ios/QuickBrick": "We open the iOS QuickBrick project.",
  "ios/ZappAppleBuilder/ZappiOS": "We open the iOS native project.",
  "android/QuickBrick": "We open the Android QuickBrick project.",
  "android/zapp-platform-android": "We open the Android native project.",
  "tvos/QuickBrick": "We open the tvOS QuickBrick project.",
  "tvos/ZappAppleBuilder/ZappTvOS": "We open the tvOS native project.",
  "androidtv/QuickBrick": "We open the Android TV QuickBrick project.",
  "androidtv/zapp-platform-android": "We open the Android TV native project.",
  "firetv/QuickBrick": "We open the Fire TV QuickBrick project.",
  "firetv/zapp-platform-android": "We open the Fire TV native project.",
  "samsung/QuickBrick": "We open the Samsung TV QuickBrick project.",
  "lg/QuickBrick": "We open the LG TV QuickBrick project.",
};

const setupNames: Record<string, string> = {
  ios: "iOS",
  android: "Android",
  tvos: "tvOS",
  androidtv: "Android TV",
};

export function explainCommand(command: string): string {
  const directory = command.match(
    /^cd \$\{HOME\}\/projects\/applicaster\/(.+?)\/?$/,
  );
  if (directory) {
    return directories[directory[1]] ?? "We open this project directory.";
  }

  if (command.includes("git tag --sort=-creatordate")) {
    return "We are switching to the latest tag.";
  }

  if (command === "git checkout master") {
    return "We switch to master.";
  }

  const tag = command.match(/^git checkout (\S+)$/);
  if (tag) {
    return `We check out tag ${tag[1]}.`;
  }

  if (command.startsWith("git reset --hard")) {
    return "We discard local changes and untracked files.";
  }

  if (command === "git pull") {
    return "We pull the latest commits.";
  }

  if (command.includes("react-native-tvos")) {
    return "We install the tvOS React Native build, then prepare the app.";
  }

  if (command.includes("zapplicaster prepare")) {
    return "We install dependencies and prepare the app.";
  }

  const setup = command.match(/\/setup\/(.+?)\/setup\.sh/);
  if (setup) {
    const [platform, version] = setup[1].split("/");
    const name = setupNames[platform] ?? platform;
    return version
      ? `We run the ${name} ${version} setup script.`
      : `We run the ${name} setup script.`;
  }

  if (command.includes("patch-package-json.sh")) {
    return "We patch package.json for the Android TV release build.";
  }

  if (command.includes("patch-release-signing-debug.sh")) {
    return "We point release signing at the debug keystore.";
  }

  if (command === "yarn start") {
    return "We start the React Native packager.";
  }

  if (command === "yarn start:web") {
    return "We start the web packager.";
  }

  if (command.includes("openssl-legacy-provider")) {
    return "We build TypeScript and the web bundle with the legacy OpenSSL provider.";
  }

  if (command.includes("build:android_tv")) {
    return "We build TypeScript, the Android TV bundle, and the Hermes bytecode.";
  }

  if (command.includes("build:hermes")) {
    return "We build TypeScript, the Android bundle, and the Hermes bytecode.";
  }

  if (command.includes("build:web")) {
    return "We build TypeScript and the web bundle.";
  }

  if (command.includes("zapptool")) {
    return "We prepare the native Apple workspace for this app.";
  }

  if (command.includes("prepare_workspace")) {
    return "We prepare the native Android workspace for this app.";
  }

  if (command.includes("installMobileGoogleDebug") && command.includes("DEVICE=")) {
    return "We install the debug build on the running emulator.";
  }

  if (command.includes("installMobileGoogleDebug")) {
    return "We install the debug build on the attached device.";
  }

  if (command.includes("installTvGoogleDebug")) {
    return "We install the Android TV debug build on the emulator.";
  }

  if (command.includes("installTvAmazonDebug")) {
    return "We install the Fire TV debug build on the emulator.";
  }

  if (command.includes("main.hbc") && command.startsWith("rm ")) {
    return "We remove the previous Hermes bundle.";
  }

  if (command.includes(".apk") && command.startsWith("rm ")) {
    return "We remove the previous release APK.";
  }

  if (command.includes("tvAmazon/assets")) {
    return "We copy the Hermes bundle into the Fire TV app assets.";
  }

  if (command.includes("tvGoogle/assets")) {
    return "We copy the Hermes bundle into the Android TV app assets.";
  }

  if (command.includes("assembleRelease")) {
    return "We build the release APK.";
  }

  if (command.includes("adb connect") && command.includes("install -r")) {
    return "We install the release APK on the TV device.";
  }

  if (command.startsWith("sdb ")) {
    return "We connect to the Samsung TV.";
  }

  if (command.includes("tizen package") && command.includes("--output")) {
    return "We package the Tizen widget.";
  }

  if (command.startsWith("mv ")) {
    return "We rename the widget package.";
  }

  if (command.includes("tizen package")) {
    return "We sign the Tizen widget.";
  }

  if (command.startsWith("tizen install")) {
    return "We install the widget on the Samsung TV.";
  }

  return "Run this command.";
}
