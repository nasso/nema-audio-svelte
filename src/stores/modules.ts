import type { Effect } from "@api/graph";
import ChannelMergerEffect from "@app/effects/ChannelMergerEffect";
import ChannelSplitterEffect from "@app/effects/ChannelSplitterEffect";
import CompressorEffect from "@app/effects/CompressorEffect";
import DelayEffect from "@app/effects/DelayEffect";
import GainEffect from "@app/effects/GainEffect";
import { Writable, writable } from "svelte/store";

export interface ModuleDesc {
  name: string,
  class: new() => Effect,
}

export const modules: Writable<ModuleDesc[]> = writable([
  {
    name: "Channel merger",
    class: ChannelMergerEffect,
  },
  {
    name: "Channel splitter",
    class: ChannelSplitterEffect,
  },
  {
    name: "Gain",
    class: GainEffect,
  },
  {
    name: "Delay",
    class: DelayEffect,
  },
  {
    name: "Compressor",
    class: CompressorEffect,
  },
]);
