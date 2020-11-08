<script lang="ts">
  import { player } from "@app/stores/project";

  export let blob: Blob;
  export let visibleRange: [number, number];
  export let detail = 1;
  export let lineWidth = 1;
  export let debugRange = false;

  let decodedBuffer: AudioBuffer;
  let width: number;
  let height: number;
  let renderWidth: number = 1;
  let renderHeight: number = 1;

  let redrawFrame: number;
  let path: string = "";

  $: $player.decodeBlob(blob).then((buffer) => {
    if (decodedBuffer !== buffer) {
      decodedBuffer = buffer;
    }
  });

  $: if (width && height && detail) {
    scheduleRender(decodedBuffer, visibleRange);
  }

  function scheduleRender(buffer: AudioBuffer, range: [number, number]) {
    if (redrawFrame) {
      cancelAnimationFrame(redrawFrame);
    }

    redrawFrame = requestAnimationFrame(() => {
      redrawFrame = null;

      renderWaveform(buffer, range);
    });
  }

  function renderWaveform(buffer: AudioBuffer, range: [number, number]) {
    const rangeDuration = range[1] - range[0];

    if (rangeDuration <= 0) {
      return "";
    }

    const rangeWidth = (width * rangeDuration) / buffer.duration;
    const rangeSamples = rangeDuration * buffer.sampleRate;
    const detailSamples = (rangeSamples * detail) / rangeWidth;

    const bars: [number, number][] = new Array((rangeWidth / detail) | 0);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const data = buffer.getChannelData(channel);

      for (let x = detail / 2, i = 0; x < rangeWidth; x += detail, i++) {
        const t = range[0] + rangeDuration * (x / rangeWidth);
        const firstSample = (t * buffer.sampleRate) | 0;

        bars[i] = bars[i] ?? [1, -1];
        for (let s = 0; s < detailSamples; s++) {
          const sample =
            (((firstSample + s) % data.length) + data.length) % data.length;
          const sampleValue = data[sample];

          bars[i][0] = Math.min(bars[i][0], sampleValue);
          bars[i][1] = Math.max(bars[i][1], sampleValue);
        }
      }
    }

    const halfh = height / 2;
    const xoffset = (width * range[0]) / buffer.duration;

    path = bars
      .map(
        (p, i) =>
          `M ${xoffset + detail * (i + 0.5)},${halfh * (p[0] + 1)}` +
          `V ${halfh * (p[1] + 1)}`
      )
      .join(" ");

    renderWidth = width;
    renderHeight = height;
  }
</script>

<style lang="scss">
  .audio-waveform {
    color: var(--color-foreground-0);

    width: 100%;
    height: 100%;

    position: relative;

    svg {
      overflow: visible;

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
  <svg
    preserveAspectRatio="none"
    viewBox={`0 0 ${renderWidth} ${renderHeight}`}>
    <path
      d={path}
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width={lineWidth} />

    {#if decodedBuffer && debugRange}
      <path
        d={`
          M ${width * (visibleRange[0] / decodedBuffer.duration)},${height / 2}
          h 30
          m -30,0
          l 10,10
          m -10,-10
          l 10,-10

          M ${width * (visibleRange[1] / decodedBuffer.duration)},${height / 2}
          h -30
          m 30,0
          l -10,10
          m 10,-10
          l -10,-10
        `}
        fill="none"
        stroke="var(--color-background-0)"
        stroke-width="2" />
    {/if}
  </svg>
</div>
