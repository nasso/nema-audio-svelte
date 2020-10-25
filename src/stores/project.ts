import { writable } from "svelte/store";

export interface Track {
  name: string;
  enabled: boolean;
}

export class PluginTrack implements Track {
  enabled = true;
  name = "Track name";
  plugin = "Plug-in";
  volume = 1.0;
  pan = 0.0;
}

export class Project {
  name = "New Project";
  tracks: Array<Track>;

  constructor() {
    this.tracks = [
      new PluginTrack(),
      new PluginTrack(),
      new PluginTrack(),
    ];
  }
}

export default writable(new Project());
