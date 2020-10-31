import { AudioGraph, Outputs } from "@api/graph";

export abstract class Track extends Outputs {
  name: string;
  enabled = true;
  height = 64;

  constructor(name = "Track name") {
    super();

    this.name = name;
  }
}

export class PluginTrack extends Track {
  plugin = "Plug-in";
  volume = 1.0;
  pan = 0.0;
}

export class Project {
  name = "New Project";
  tracks: Array<Track> = [];
  graph: AudioGraph = new AudioGraph();
}
