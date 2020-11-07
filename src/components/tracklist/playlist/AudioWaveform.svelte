<script lang="ts" context="module">
  import type { AudioPlayer } from "@api/audio";
  import player from "@app/stores/player";

  const waveformCache: WeakMap<Blob, Promise<string>> = new WeakMap();

  const quantum = 2400;

  async function computeWaveform(
    player: AudioPlayer,
    blob: Blob
  ): Promise<string> {
    const buffer = await player.decodeBlob(blob);

    const samples = new Array((buffer.length / quantum) | 0);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const data = buffer.getChannelData(channel);

      for (let i = 0; i < samples.length; i++) {
        samples[i] =
          (samples[i] ?? 0) + data[i * quantum] / buffer.numberOfChannels;
      }
    }

    const points: Array<[number, number]> = samples.map((sample, i) => [
      i / samples.length,
      sample,
    ]);

    return `0,0 ${points.map((point) => point.join(",")).join(" ")} 1,0`;
  }

  function getWaveform(player: AudioPlayer, blob: Blob) {
    let waveform = waveformCache.get(blob);

    if (!waveform) {
      waveformCache.set(blob, computeWaveform(player, blob));
    }

    return waveform;
  }
</script>

<script lang="ts">
  export let blob: Blob;

  $: waveform = getWaveform($player, blob);
</script>

<style lang="scss">
  .audio-waveform {
    color: var(--color-foreground-0);

    width: 100%;
    height: 100%;
  }
</style>

{#await waveform then points}
  <svg class="audio-waveform" viewBox="0 -1 1 2" preserveAspectRatio="none">
    <polyline id="waveform" {points} fill="currentColor" />
    <use href="#waveform" transform="scale(1, -1)" />
  </svg>
{/await}
