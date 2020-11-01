import { AudioTrack } from "@api/audio";
import { GraphNode } from "@api/graph";
import { Project } from "@api/project";
import ChannelMergerEffect from "@app/effects/ChannelMergerEffect";
import ChannelSplitterEffect from "@app/effects/ChannelSplitterEffect";
import CompressorEffect from "@app/effects/CompressorEffect";
import DelayEffect from "@app/effects/DelayEffect";
import GainEffect from "@app/effects/GainEffect";
import OutputEffect from "@app/effects/OutputEffect";
import { writable } from "svelte/store";

const project = new Project();

project.tracks.push(new AudioTrack());
project.tracks.push(new AudioTrack());
project.tracks.push(new AudioTrack());

const output = new GraphNode({
  effect: new OutputEffect(),
  x: 1200,
  y: 100,
});

const gain = new GraphNode({
  effect: new GainEffect(),
  x: 100,
  y: 150,
});

const compressor = new GraphNode({
  effect: new CompressorEffect(),
  enabled: false,
  x: 300,
  y: 200,
});

const delay = new GraphNode({
  effect: new DelayEffect(),
  x: 550,
  y: 100,
});

const splitter = new GraphNode({
  effect: new ChannelSplitterEffect(),
  x: 200,
  y: 50,
});

const merger = new GraphNode({
  effect: new ChannelMergerEffect(),
  x: 900,
  y: 150,
});

project.graph.nodes.add(gain);
project.graph.nodes.add(compressor);
project.graph.nodes.add(delay);
project.graph.nodes.add(splitter);
project.graph.nodes.add(merger);
project.graph.nodes.add(output);

splitter.connect(delay, 0, 1);
delay.connect(merger, 0);
gain.connect(compressor);
compressor.connect(merger, 1);
merger.connect(output);

project.tracks[0].connect(splitter);
project.tracks[1].connect(gain);

export default writable(project);
