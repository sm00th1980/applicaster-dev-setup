import { explainCommand } from "./explainCommand.ts";
import { v14 } from "./templates/v14.ts";
import { v15 } from "./templates/v15.ts";
import { v16 } from "./templates/v16.ts";

const commands = [v14, v15, v16].flatMap((platforms) =>
  platforms.flatMap((platform) =>
    platform.groups.flatMap((group) => group.commands),
  ),
);

const missing = commands.filter(
  (command) => explainCommand(command) === "Run this command.",
);

if (missing.length > 0) {
  throw new Error(`Unlabeled commands:\n${missing.join("\n")}`);
}

const latest = explainCommand(
  'git checkout "$(git tag --sort=-creatordate | head -n 1)"',
);

if (latest !== "We are switching to the latest tag.") {
  throw new Error(latest);
}

console.log(`labeled ${commands.length} commands`);
