import type { Track } from "@api/playlist";
import { ProcessingGraph, Source } from "@api/graph";

export class Project {
  name = "New Project";
  sampleRate = 48000;
  tempo = 136;
  signature = [4, 4];
  tracks: Array<Track<Source>> = [];
  graph: ProcessingGraph = new ProcessingGraph();

  timeToBeats(timeInSeconds: number): number {
    return timeInSeconds / 60 * this.tempo;
  }

  beatsToTime(beats: number): number {
    return beats / this.tempo * 60;
  }

  timeToBars(timeInSeconds: number): number {
    return this.timeToBeats(timeInSeconds) / this.signature[0];
  }

  barsToTime(bars: number): number {
    return this.beatsToTime(bars * this.signature[0]);
  }
}
