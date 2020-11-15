import { persistent } from "@app/utils/persistentStore";
import { derived } from "svelte/store";

export enum TracklistMode {
  Playlist = "playlist",
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
  tracklistMode: TracklistMode.Playlist,
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
    command: "playlist.clip.delete",
  },
  {
    key: "delete",
    command: "playlist.track.delete",
  },
  {
    key: "ctrl+c",
    command: "playlist.clip.copy",
  },
  {
    key: "ctrl+v",
    command: "playlist.clip.paste",
  },
  {
    key: "ctrl+d",
    command: "playlist.clip.duplicate",
  },
];

export const shortcuts = derived(
  settings,
  (settings) => [...settings.userShortcuts, ...defaultShortcuts],
);
