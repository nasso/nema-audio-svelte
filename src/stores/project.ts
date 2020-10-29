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

project.graph.nodes.push(new AudioGraphNode({
  mod: new GainModule(),
  x: 300,
  y: 50,
}));

project.graph.nodes.push(new AudioGraphNode({
  mod: new CompressorModule(),
  enabled: false,
  x: 300,
  y: 200,
}));

project.graph.nodes.push(new AudioGraphNode({
  mod: new DelayModule(),
  x: 450,
  y: 100,
}));

export default writable(project);
