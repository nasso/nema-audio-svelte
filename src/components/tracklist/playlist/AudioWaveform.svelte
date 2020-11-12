<script lang="ts">
  import player from "@app/stores/player";

  export let blob: Blob;
  export let visibleRange: [number, number];
  export let detail = 1;
  export let lineWidth = 1;
  export let debugRange = false;

  let decodedBuffer: AudioBuffer;
  let width: number;
  let renderWidth: number = 0;
  let renderRange: [number, number] = [0, 0];

  let redrawTimeout: number;
  let path: string = "";

  $: $player.decodeBlob(blob).then((buffer) => {
    if (decodedBuffer !== buffer) {
      decodedBuffer = buffer;
    }
  });

  $: if (
    visibleRange[0] !== renderRange[0] ||
    visibleRange[1] !== renderRange[1] ||
    width !== renderWidth
  ) {
    scheduleRender(decodedBuffer, visibleRange);
  }

  function scheduleRender(buffer: AudioBuffer, range: [number, number]) {
    if (redrawTimeout) {
      clearTimeout(redrawTimeout);
    }

    redrawTimeout = setTimeout(() => {
      redrawTimeout = null;

      requestAnimationFrame(() => {
        renderWaveform(buffer, range);
      });
    }, 100);
  }

  function renderWaveform(buffer: AudioBuffer, range: [number, number]) {
    const rangeDuration = range[1] - range[0];

    if (rangeDuration <= 0) {
      return "";
    }

    const rangeWidth = width * (rangeDuration / buffer.duration);
    const rangeSamples = rangeDuration * buffer.sampleRate;
    const detailSamples = rangeSamples * (detail / rangeWidth);
    const sampleRange = range.map((t) => Math.round(t * buffer.sampleRate));

    const xoffset = (width * range[0]) / buffer.duration;
    let pathBuilder = "";

    const channels: Float32Array[] = new Array(buffer.numberOfChannels);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels[i] = buffer.getChannelData(i);
    }

    if (detailSamples > 1) {
      let lastMin = -1;
      let lastMax = 1;

      for (let bar = 0; bar * detail < rangeWidth; bar++) {
        const sample = sampleRange[0] + bar * detailSamples;
        let min = 1;
        let max = -1;

        for (const channel of channels) {
          for (let s = sample | 0; s < sample + detailSamples; s++) {
            const i = ((s % channel.length) + channel.length) % channel.length;

            min = Math.min(min, channel[i]);
            max = Math.max(max, channel[i]);
          }
        }

        min = Math.min(min, lastMax);
        max = Math.max(max, lastMin);

        lastMin = min;
        lastMax = max;

        pathBuilder += `M${xoffset + detail * bar},${min}V${max}`;
      }
    } else {
      const sampleWidth = rangeWidth / (sampleRange[1] - sampleRange[0]);

      for (const channel of channels) {
        for (let s = sampleRange[0]; s < sampleRange[1]; s++) {
          const i = ((s % channel.length) + channel.length) % channel.length;

          if (s === sampleRange[0]) {
            pathBuilder += `M${xoffset},${channel[i]}`;
          } else {
            pathBuilder += `V${channel[i]}`;
          }

          pathBuilder += `h${sampleWidth}`;
        }
      }
    }

    path = pathBuilder;

    renderRange[0] = range[0];
    renderRange[1] = range[1];
    renderWidth = width;
  }
</script>

<style lang="scss">
  .audio-waveform {
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
