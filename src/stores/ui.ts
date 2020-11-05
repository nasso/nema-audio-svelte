import { get, Writable, writable } from "svelte/store";
import satisfies from "semver/functions/satisfies";
import eq from "semver/functions/eq";

const LOCAL_STORAGE_KEY = "nema-audio-ui-state";
const STORE_TIMEOUT = 200;

export enum TracklistMode {
  Playlist = "playlist",
  Graph = "graph",
}

interface UiState {
  readonly version: string;
  sidePaneWidth: number;
  bottomPaneHeight: number;
  trackHeadsWidth: number,
  tracklistMode: TracklistMode;
  usePointerLock: boolean;
}

const uiState: Writable<UiState> = writable({
  version: "0.2.0",
  sidePaneWidth: 200,
  bottomPaneHeight: 200,
  trackHeadsWidth: 150,
  tracklistMode: TracklistMode.Playlist,
  usePointerLock: false,
});

function patch(state: UiState, newValues: Record<string, unknown>) {
  const newValuesKeys = Object.keys(newValues);

  Object.keys(state)
    .filter((key) => key !== "version")
    .filter((key) => newValuesKeys.includes(key))
    .forEach((key) => {
      state[key] = newValues[key];
    });
}

function saveToLocalStorage(newState: UiState) {
  if (window.localStorage) {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
  }
}

function loadFromLocalStorage() {
  if (window.localStorage) {
    const configstr = window.localStorage.getItem(LOCAL_STORAGE_KEY);

    if (configstr) {
      const config = JSON.parse(configstr);
      const current = get(uiState) as UiState;

      if (satisfies(current.version, `^${config.version}`)) {
        patch(current, config);
        uiState.set(current);
      }

      if (!eq(current.version, config.version)) {
        saveToLocalStorage(config);
      }
    }
  }
}

// try to load config from localStorage
loadFromLocalStorage();

let storeTimeout: undefined | number = undefined;

uiState.subscribe((newState) => {
  if (storeTimeout) {
    clearTimeout(storeTimeout);
  }

  storeTimeout = setTimeout(() => {
    saveToLocalStorage(newState);

    storeTimeout = undefined;
  }, STORE_TIMEOUT);
});

export default uiState;
