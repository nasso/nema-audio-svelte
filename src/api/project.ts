import { AudioGraph } from "@api/graph";

export interface Track {
  name: string;
  enabled: boolean;
  height: number;
}

export class PluginTrack implements Track {
  enabled = true;
  height = 64;
  name = "Track name";
  plugin = "Plug-in";
  volume = 1.0;
  pan = 0.0;
}

export class Project {
  name = "New Project";
  tracks: Array<Track> = [];
  graph: AudioGraph = new AudioGraph();
}
