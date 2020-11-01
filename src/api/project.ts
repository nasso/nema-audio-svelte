import { ProcessingGraph, Source, Track } from "@api/graph";

export class Project {
  name = "New Project";
  tracks: Array<Track<Source>> = [];
  graph: ProcessingGraph = new ProcessingGraph();
}
