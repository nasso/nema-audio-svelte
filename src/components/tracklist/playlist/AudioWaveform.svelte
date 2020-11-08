<script lang="ts">
  import { player } from "@app/stores/project";

  export let blob: Blob;
  export let visibleRange: [number, number];
  export let detail = 1;
  export let lineWidth = 1;
  export let debugRange = false;

  let decodedBuffer: AudioBuffer;
  let width: number;
  let renderWidth: number = 0;
  let renderRange: [number, number] = [0, 0];

  let redrawFrame: number;
  let path: string = "";

  $: $player.decodeBlob(blob).then((buffer) => {
    if (decodedBuffer !== buffer) {
      decodedBuffer = buffer;
    }
  });

  $: if (
    visibleRange[0] !== renderRange[0] ||
    visibleRange[1] !== renderRange[1]
  ) {
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

    const rangeWidth = width * (rangeDuration / buffer.duration);
    const rangeSamples = rangeDuration * buffer.sampleRate;
    const detailSamples = rangeSamples * (detail / rangeWidth);

    const bars: [number, number][] = new Array((rangeWidth / detail) | 0);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const data = buffer.getChannelData(channel);

      for (let x = detail / 2, i = 0; x < rangeWidth; x += detail, i++) {
        const t0 = range[0] + rangeDuration * (x / rangeWidth);
        const t1 = Math.min(t0 + detailSamples / buffer.sampleRate, range[1]);
        const firstSample = (t0 * buffer.sampleRate) | 0;
        const lastSample = (t1 * buffer.sampleRate) | 0;

        bars[i] = bars[i] ?? [1, -1];
        for (let s = firstSample; s < lastSample; s++) {
          const sample = ((s % data.length) + data.length) % data.length;
          const sampleValue = data[sample];

          bars[i][0] = Math.min(bars[i][0], sampleValue);
          bars[i][1] = Math.max(bars[i][1], sampleValue);
        }
      }
    }

    for (let i = 0; i < bars.length - 1; i++) {
      const bar = bars[i];
      const next = bars[i + 1];

      if (bar[0] > next[1]) {
        bar[0] = next[1];
      } else if (bar[1] < next[0]) {
        bar[1] = next[1];
      }
    }

    const xoffset = (width * range[0]) / buffer.duration;

    if (detailSamples > 1) {
      path = bars
        .map((p, i) => `M ${xoffset + detail * i},${p[0]} V ${p[1]}`)
        .join(" ");
    } else {
      path =
        `M ${xoffset},0 L` +
        bars.map((p, i) => `${xoffset + detail * i},${p[0]}`).join(" ");
    }

    renderRange[0] = range[0];
    renderRange[1] = range[1];
    renderWidth = width;
  }
</script>

<style lang="scss">
  .audio-waveform {
    color: var(--color-foreground-0);

    width: 100%;
    height: 100%;

    svg {
      overflow: visible;

      width: 100%;
      height: 100%;
    }
  }
</style>

<div class="audio-waveform" bind:clientWidth={width}>
  <svg preserveAspectRatio="none" viewBox={`0 0 ${renderWidth} 2`}>
    <path
      transform="translate(0 1) scale(1 0.9)"
      fill="none"
      vector-effect="non-scaling-stroke"
      stroke="currentColor"
      stroke-width={lineWidth}
      stroke-linecap="round"
      d={path} />

    {#if decodedBuffer && debugRange}
      <path
        d={`
            M ${width * (visibleRange[0] / decodedBuffer.duration)},0
            h 30
            m -30,0
            l 10,10
            m -10,-10
            l 10,-10

            M ${width * (visibleRange[1] / decodedBuffer.duration)},0
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
