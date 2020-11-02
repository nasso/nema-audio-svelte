import type { Track } from "@api/playlist";
import { ProcessingGraph, Source } from "@api/graph";

export class Project {
  name = "New Project";
  tracks: Array<Track<Source>> = [];
  graph: ProcessingGraph = new ProcessingGraph();
}
