# Applicaster Preparation Generator – Project Plan

## Overview

- Lightweight web app built with **React + TypeScript + Vite**.
- UI design using **Bootstrap**.
- Purpose: Generate terminal commands from templates for **personal macOS workflows**.

---

## Input

- `APP_ID` (UUID), e.g., `dae0baf4-262d-41b0-9044-37de74982a6f`.
- Input can also come from the URL, e.g., `http://localhost:5173/?id=dae0baf4-262d-41b0-9044-37de74982a67`.
- Validation ensures the input follows the **UUID specification**, implemented using **Zod**.

---

## Output

- Commands organized **per platform** and **per command group**.

---

## Copy Options

- **Copy per group only**
  - Each group represents a logical set of commands (e.g., JS part, Native part).
  - No global “Copy All” needed.

- **Copy individual lines**
  - Users can copy specific commands.

- **Copy multiple lines as a single line**
  - When multiple commands are copied together, they are combined into **one continuous line** for execution in the shell.

| Platform   | Command Groups         |
| ---------- | ---------------------- |
| iOS        | JS Setup, Native Setup |
| Android    | JS Setup, Native Setup |
| tvOS       | JS Setup, Native Setup |
| AndroidTV  | JS Setup, Native Setup |
| Samsung TV | JS Setup, Native Setup |
| LG TV      | JS Setup, Native Setup |

## Template Structure in Code

```ts
type CommandLine = string;

type CommandGroup = {
  name: string;
  commands: CommandLine[];
};

type PlatformTemplate = {
  id: string;
  name: string;
  groups: CommandGroup[];
};
```

## Example iOS Template

```ts
const iosTemplate: PlatformTemplate = {
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
};
```

## UI Workflow

### 1. APP_ID Input

- User enters a **UUID** or opens a URL containing `id=<APP_ID>`.
- Input validation is performed using **Zod**.

### 2. Platform Selection

- User selects platforms to generate commands for:
  - iOS
  - Android
  - tvOS
  - AndroidTV
  - FireTV
  - Samsung TV (Tizen OS)
  - LG TV (WebOS)

### 3. Framework Version Selection

- User may specify the **framework version** (`v15`, `v14`).
- The selected version determines which **JS** and **Native** templates are used.

### 4. Command Generation

- The app replaces `<APP_ID>` in the templates with the user-provided value.

### 5. Command Display

- Commands are displayed **per platform** and **per command group**.

**Example:**

iOS
JS Setup
[Copy All] // Copies the whole group
cd ... [Copy] // Copy individual line
git reset ... [Copy]
yarn ... [Copy]
Native Setup
...

### 6. URL-based Generation (Optional)

- `/app?id=<APP_ID>` pre-fills the APP_ID input and generates commands automatically.

## Features

- Copy **individual command lines**
- Copy **entire command group**
- No need to copy all commands for selected platforms; copying is done **per group**
- URL-based **APP_ID** generation
- Validation of **APP_ID**
- **macOS only**
- **Personal usage** (no accounts required)

> **Note:** No global “Copy All Platforms” is needed; copying is done per group.

## Technical Notes

- Templates are stored **directly in code** (**no backend**).

Fewer than 10 templates; a simple replaceAll engine is sufficient:

```ts
function generateCommandLine(line: string, appId: string) {
  return line.replaceAll("<APP_ID>", appId);
}
```

React + TypeScript ensures type safety.

Vite provides fast development builds.

Bootstrap provides a quick, responsive UI.
