import { AudioGraph, Output } from "@api/graph";

export abstract class Track extends Output {
  name = "Track name";
  enabled = true;
  height = 64;
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
