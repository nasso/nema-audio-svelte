import type { Track } from "@api/playlist";
import { ProcessingGraph, Source } from "@api/graph";

export class Project {
  name = "New Project";
  sampleRate = 48000;
  tempo = 136;
  signature = [4, 4];
  tracks: Array<Track<Source>> = [];
  graph: ProcessingGraph = new ProcessingGraph();

  timeToBars(timeInSeconds: number): number {
    return timeInSeconds / 60 * (this.tempo / this.signature[0]);
  }

  barsToTime(bars: number): number {
    return 60 * bars * this.signature[0] / this.tempo;
  }
}
