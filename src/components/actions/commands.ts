import { shortcuts as effectiveShortcuts } from "@app/stores/settings";
import { get } from "svelte/store";

const commandCallbacks = new Set<(command: string) => void>();

window.addEventListener("keydown", (e: KeyboardEvent) => {
  const shortcuts = get(effectiveShortcuts);

  shortcuts:
  for (const { key, command } of shortcuts) {
    let processedKey = key;
    let match: RegExpMatchArray;

    // handle modifiers
    while ((match = processedKey.match(/^(ctrl|alt|shift)\+/)) !== null) {
      if (!e[({
        ctrl: "ctrlKey",
        alt: "altKey",
        shift: "shiftKey",
      })[match[1]]]) {
        continue shortcuts;
      }

      processedKey = processedKey.substr(match[0].length);
    }

    // check key
    if (processedKey === e.key.toLowerCase()) {
      e.preventDefault();
      commandCallbacks.forEach((callback) => callback(command));
    }
  }
});

interface CommandsAction {
  destroy(): void;
}

export default function(
  node: Element,
  handler: (e: CustomEvent<string>) => void,
): CommandsAction {
  const callback = (action: string) => {
    handler.call(node, new CustomEvent("command", { detail: action }));
  };

  commandCallbacks.add(callback);

  return {
    destroy() {
      commandCallbacks.delete(callback);
    },
  };
}
