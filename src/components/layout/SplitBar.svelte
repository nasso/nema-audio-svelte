<script lang="ts">
  export let position: number;
  export let factor: number = 1;
  export let direction: "column" | "row" = "column";
  export let reverse: boolean = false;
  export let snaps: undefined | number[] = undefined;
  export let snapdist: number = 10;
  export let min: undefined | number = undefined;
  export let max: undefined | number = undefined;
  export let color: string = "var(--color-foreground-2)";

  $: if (min) {
    position = Math.max(min, position);
  }

  $: if (max) {
    position = Math.min(max, position);
  }

  $: if (snaps) {
    const candidates = snaps.filter(
      (snap) => Math.abs(position - snap) < snapdist
    );

    if (candidates.length) {
      const closest = candidates.reduce((closestYet, snap) => {
        if (Math.abs(snap - position) < Math.abs(closestYet - position)) {
          return snap;
        }

        return closestYet;
      });

      position = closest;
    }
  }

  function handlePointerDown(e: PointerEvent) {
    if (e.button !== 0) {
      return;
    }

    const revFactor = reverse ? -1 : 1;
    const startPos = position;
    const pointerStart = { x: e.clientX, y: e.clientY };

    this.onpointermove = (e: PointerEvent) => {
      let delta: number;

      if (direction === "column") {
        delta = (e.clientY - pointerStart.y) * factor * revFactor;
      } else if (direction === "row") {
        delta = (e.clientX - pointerStart.x) * factor * revFactor;
      }

      position = startPos + delta;
    };

    this.onpointerup = (e: PointerEvent) => {
      this.onpointermove = null;
      this.onpointerup = null;
      this.releasePointerCapture(e.pointerId);
    };

    this.setPointerCapture(e.pointerId);
  }
</script>

<div class="split-bar">
  <div
    class="hotspot"
    class:horizontal={direction === "row"}
    class:vertical={direction === "column"}
    style={`color: ${color}`}
    on:pointerdown|stopPropagation={handlePointerDown}
  />
</div>

<style lang="scss">
  .split-bar {
    display: inline-block;
    position: relative;

    --hotspot-size: 8px;

    .hotspot {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      &::before {
        content: "";

        --distance-to-edge: 8px;
        --line-width: 2px;

        position: absolute;
        opacity: 0;

        border-radius: calc(var(--line-width) / 2);

        transition: opacity var(--anim-short);
        background: currentColor;
      }

      &:hover::before {
        opacity: 0.5;
      }

      &.horizontal {
        cursor: ew-resize;
        width: var(--hotspot-size);
        transform: translateX(-50%);

        &::before {
          left: calc(50% - var(--line-width) / 2);
          width: var(--line-width);
          top: var(--distance-to-edge);
          bottom: var(--distance-to-edge);
        }
      }

      &.vertical {
        cursor: ns-resize;
        height: var(--hotspot-size);
        transform: translateY(-50%);

        &::before {
          top: calc(50% - var(--line-width) / 2);
          height: var(--line-width);
          left: var(--distance-to-edge);
          right: var(--distance-to-edge);
        }
      }
    }
  }
</style>
