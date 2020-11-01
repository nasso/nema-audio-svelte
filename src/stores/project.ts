import { AudioTrack } from "@api/audio";
import CompressorEffect from "@api/CompressorEffect";
import DelayEffect from "@api/DelayEffect";
import GainEffect from "@api/GainEffect";
import { GraphNode } from "@api/graph";
import { Project } from "@api/project";
import { writable } from "svelte/store";

const project = new Project();

project.tracks.push(new AudioTrack());
project.tracks.push(new AudioTrack());
project.tracks.push(new AudioTrack());

const gain = new GraphNode({
  effect: new GainEffect(),
  x: 100,
  y: 50,
});

const compressor = new GraphNode({
  effect: new CompressorEffect(),
  enabled: false,
  x: 300,
  y: 200,
});

const delay = new GraphNode({
  effect: new DelayEffect(),
  x: 450,
  y: 100,
});

project.graph.nodes.add(gain);
project.graph.nodes.add(compressor);
project.graph.nodes.add(delay);

gain.connect(compressor);
project.tracks[1].connect(gain);

export default writable(project);
