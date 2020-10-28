import { writable } from "svelte/store";

export interface PipelineModule {
  id: number,
  enabled: boolean,
  passthrough: boolean,
  title: string,
  x: null | number,
  y: null | number,
  parameters: string[],
}

export class Pipeline {
  modules: PipelineModule[] = [
    {
      id: 0,
      enabled: true,
      passthrough: false,
      title: "Compressor",
      x: 100,
      y: 100,
      parameters: ["Threshold", "Knee", "Ratio", "Reduction", "Attack", "Release"],
    },
    {
      id: 0,
      enabled: true,
      passthrough: false,
      title: "Compressor",
      x: 500,
      y: 100,
      parameters: ["Threshold", "Knee", "Ratio", "Reduction", "Attack", "Release"],
    },
    {
      id: 0,
      enabled: true,
      passthrough: false,
      title: "Delay",
      x: 100,
      y: 500,
      parameters: ["Time", "Offset", "Feedback", "Mix"],
    },
  ];
}

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
  tracks: Array<Track> = [...Array(3).keys()].map(() => new PluginTrack());
  pipeline: Pipeline = new Pipeline();
}

export default writable(new Project());
