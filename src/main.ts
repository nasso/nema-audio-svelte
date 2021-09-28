import { AudioClip, AudioTrack } from "@api/audio";
import { GraphNode } from "@api/graph";
import ChannelMergerEffect from "@app/effects/ChannelMergerEffect";
import ChannelSplitterEffect from "@app/effects/ChannelSplitterEffect";
import CompressorEffect from "@app/effects/CompressorEffect";
import DelayEffect from "@app/effects/DelayEffect";
import GainEffect from "@app/effects/GainEffect";
import OutputEffect from "@app/effects/OutputEffect";
import player from "@app/stores/player";
import project from "@app/stores/project";
import { get } from "svelte/store";
import App from "./App.svelte";

(async () => {
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

  splitter.connect(delay, 0, 1);
  delay.connect(merger, 0);
  gain.connect(compressor);
  compressor.connect(merger, 1);
  merger.connect(output);

  const sampleName = "BRLY_ALV_MORE_DRUMS_Drumloop_150_OnHoldC78.wav";
  const sample = await fetch(`data/${sampleName}`);
  const blob = await sample.blob();

  const audioBuffer = await get(player).decodeBlob(blob);

  project.update((project) => {
    project.tempo = 150;
    project.tracks.push(new AudioTrack());
    project.tracks.push(new AudioTrack());
    project.tracks.push(new AudioTrack());

    project.tracks[1].name = "Longer name";
    project.tracks[2].name = "Very very very long name";

    project.graph.nodes.add(gain);
    project.graph.nodes.add(compressor);
    project.graph.nodes.add(delay);
    project.graph.nodes.add(splitter);
    project.graph.nodes.add(merger);
    project.graph.nodes.add(output);

    project.tracks[0].connect(splitter);
    project.tracks[1].connect(gain);

    project.tracks[0].clips.push(
      new AudioClip(sampleName, blob, 0, audioBuffer.duration),
    );
    project.tracks[1].clips.push(
      new AudioClip(
        sampleName,
        blob,
        0,
        audioBuffer.duration,
        audioBuffer.duration * 2,
      ),
    );
    project.tracks[2].clips.push(
      new AudioClip(
        sampleName,
        blob,
        2,
        audioBuffer.duration,
        audioBuffer.duration * 1.5,
        -1,
      ),
    );

    return project;
  });
})();

const app = new App({
  target: document.body,
});

export default app;
