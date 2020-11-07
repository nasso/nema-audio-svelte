import type { Track } from "@api/playlist";
import { ProcessingGraph, Source } from "@api/graph";

export class Project {
  name = "New Project";
  sampleRate = 48000;
  tempo = 136;
  tracks: Array<Track<Source>> = [];
  graph: ProcessingGraph = new ProcessingGraph();
}
