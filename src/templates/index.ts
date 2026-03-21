import { v14 } from "./v14";
import { v15 } from "./v15";

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

export type QuickBrickVersion = "v15" | "v14";

export type PlatformTemplates = Record<QuickBrickVersion, PlatformTemplate[]>;

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
  v15,
  v14,
};
