<script lang="ts">
  import { player } from "@app/stores/project";

  export let blob: Blob;
  export let detail = 1;
  export let lineWidth = 1;

  let decodedBuffer: AudioBuffer;
  let width: number;
  let height: number;

  let redrawFrame: number;
  let path: string = "";

  $: $player.decodeBlob(blob).then((buffer) => {
    if (decodedBuffer !== buffer) {
      decodedBuffer = buffer;
    }
  });

  $: if (width && height && detail) {
    scheduleRedraw(decodedBuffer);
  }

  function scheduleRedraw(buffer: AudioBuffer) {
    if (redrawFrame) {
      cancelAnimationFrame(redrawFrame);
    }

    redrawFrame = requestAnimationFrame(() => {
      redrawFrame = null;

      const t0 = performance.now();
      redrawWaveform(buffer);
      const t1 = performance.now();
      console.log(`redrawing took ${t1 - t0}ms`);
    });
  }

  function redrawWaveform(buffer: AudioBuffer) {
    const points: [number, number][] = new Array((width / detail) | 0);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const data = buffer.getChannelData(channel);

      for (let x = detail / 2, p = 0; x < width; x += detail, p++) {
        const sampleRange = [
          Math.min(((data.length * x) / width) | 0, data.length - 1),
          Math.min(((data.length * (x + detail)) / width) | 0, data.length - 1),
        ];

        points[p] = points[p] ?? [1, -1];
        for (let s = sampleRange[0]; s < sampleRange[1]; s++) {
          points[p][0] = Math.min(points[p][0], data[s]);
          points[p][1] = Math.max(points[p][1], data[s]);
        }
      }
    }

    path = points
      .map(
        (p, i) =>
          `M ${detail / 2 + i * detail},${(height / 2) * (p[0] + 1)}` +
          `V ${(height / 2) * (p[1] + 1)}`
      )
      .join(" ");
  }
</script>

<style lang="scss">
  .audio-waveform {
    color: var(--color-foreground-0);

    width: 100%;
    height: 100%;

    position: relative;

    svg {
      $margin: 10%;

      width: 100%;
      height: 100% - $margin * 2;

      position: absolute;
      top: $margin;
      bottom: $margin;
      left: 0;
    }
  }
</style>

<div class="audio-waveform" bind:clientWidth={width} bind:clientHeight={height}>
  <svg preserveAspectRatio="none" viewBox={`0 0 ${width ?? 1} ${height ?? 1}`}>
    <path
      d={path}
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width={lineWidth} />
  </svg>
</div>
