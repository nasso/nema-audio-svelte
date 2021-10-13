import { persistent } from "@app/utils/persistentStore";
import { derived } from "svelte/store";

export enum TracklistMode {
  Timeline = "timeline",
  Graph = "graph",
}

interface UiConfig {
  sidePaneWidth: number;
  bottomPaneHeight: number;
  trackHeadsWidth: number,
  tracklistMode: TracklistMode;
  usePointerLock: boolean;
}

export const ui = persistent<UiConfig>("nema-ui", {
  sidePaneWidth: 200,
  bottomPaneHeight: 200,
  trackHeadsWidth: 150,
  tracklistMode: TracklistMode.Timeline,
  usePointerLock: false,
}, { version: "0.1.0" });

interface Shortcut {
  key: string,
  command: string,
  when?: string,
}

interface Settings {
  userShortcuts: Array<Shortcut>;
}

export const settings = persistent<Settings>("nema-settings", {
  userShortcuts: [],
}, { version: "0.1.0" });

const defaultShortcuts: Shortcut[] = [
  {
    key: "delete",
    command: "timeline.clip.delete",
  },
  {
    key: "delete",
    command: "timeline.track.delete",
  },
  {
    key: "delete",
    command: "graph.node.delete",
  },
  {
    key: "ctrl+c",
    command: "timeline.clip.copy",
  },
  {
    key: "ctrl+v",
    command: "timeline.clip.paste",
  },
  {
    key: "ctrl+d",
    command: "timeline.clip.duplicate",
  },
];

export const shortcuts = derived(
  settings,
  (settings) => [...settings.userShortcuts, ...defaultShortcuts],
);
