import { get, Writable, writable } from "svelte/store";

const LOCAL_STORAGE_KEY = "nema-audio-ui-state";
const STORE_TIMEOUT = 200;

interface UiState {
  readonly version: string,
  sidePaneWidth: number;
  bottomPaneHeight: number;
  currentView: string;
}

const uiState: Writable<UiState> = writable({
  version: "0.1.0",
  sidePaneWidth: 200,
  bottomPaneHeight: 200,
  currentView: "playlist",
});

// try to load config from localStorage
if (window.localStorage) {
  const configstr = window.localStorage.getItem(LOCAL_STORAGE_KEY);

  if (configstr) {
    const config = JSON.parse(configstr);

    if (config.version === (get(uiState) as UiState).version) {
      uiState.set(config);
    }
  }
}

let storeTimeout: undefined | number = undefined;

uiState.subscribe((value) => {
  if (storeTimeout) {
    clearTimeout(storeTimeout);
  }

  storeTimeout = setTimeout(() => {
    if (window.localStorage) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
    }

    storeTimeout = undefined;
  }, STORE_TIMEOUT);
});

export default uiState;
