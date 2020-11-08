import { AudioClip, AudioPlayer, AudioTrack } from "@api/audio";
import { GraphNode } from "@api/graph";
import { Project } from "@api/project";
import ChannelMergerEffect from "@app/effects/ChannelMergerEffect";
import ChannelSplitterEffect from "@app/effects/ChannelSplitterEffect";
import CompressorEffect from "@app/effects/CompressorEffect";
import DelayEffect from "@app/effects/DelayEffect";
import GainEffect from "@app/effects/GainEffect";
import OutputEffect from "@app/effects/OutputEffect";
import { writable } from "svelte/store";

const proj = new Project();

proj.tempo = 150;
proj.tracks.push(new AudioTrack());
proj.tracks.push(new AudioTrack());
proj.tracks.push(new AudioTrack());

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

proj.graph.nodes.add(gain);
proj.graph.nodes.add(compressor);
proj.graph.nodes.add(delay);
proj.graph.nodes.add(splitter);
proj.graph.nodes.add(merger);
proj.graph.nodes.add(output);

splitter.connect(delay, 0, 1);
delay.connect(merger, 0);
gain.connect(compressor);
compressor.connect(merger, 1);
merger.connect(output);

proj.tracks[0].connect(splitter);
proj.tracks[1].connect(gain);

const project = writable(proj);
const playerValue = new AudioPlayer(new AudioContext(), proj);

(async () => {
  const sample = await fetch("data/BRLY_ALV_MORE_DRUMS_Drumloop_150_OnHoldC78.wav");
  const blob = await sample.blob();

  const audioBuffer = await playerValue.decodeBlob(blob);

  project.update((project) => {
    project.tracks[0].insert(new AudioClip(blob, 0, audioBuffer.duration));
    project.tracks[1].insert(new AudioClip(blob, 0, audioBuffer.duration));
    project.tracks[2].insert(new AudioClip(blob, 0, audioBuffer.duration));

    return project;
  });
})();

export const player = writable(playerValue);
export default project;
