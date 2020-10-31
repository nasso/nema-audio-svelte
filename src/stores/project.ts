import CompressorModule from "@api/CompressorModule";
import DelayModule from "@api/DelayModule";
import GainModule from "@api/GainModule";
import { AudioGraphNode } from "@api/graph";
import { PluginTrack, Project } from "@api/project";
import { writable } from "svelte/store";

const project = new Project();

project.tracks.push(new PluginTrack());
project.tracks.push(new PluginTrack());
project.tracks.push(new PluginTrack());

const gain = new AudioGraphNode({
  mod: new GainModule(),
  x: 100,
  y: 50,
});

const compressor = new AudioGraphNode({
  mod: new CompressorModule(),
  enabled: false,
  x: 300,
  y: 200,
});

const delay = new AudioGraphNode({
  mod: new DelayModule(),
  x: 450,
  y: 100,
});

project.graph.nodes.add(gain);
project.graph.nodes.add(compressor);
project.graph.nodes.add(delay);

gain.connect(compressor);

export default writable(project);
