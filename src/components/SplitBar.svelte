<script>
  export let split_pos;
  export let direction = 'column';
  export let reverse = false;

  let mouse_is_down = false;

  function handleMouseDown(e) {
    if (!mouse_is_down && e.button === 0) {
      e.preventDefault();
      mouse_is_down = true;
    }
  }

  function handleMouseUp(e) {
    if (mouse_is_down && e.button === 0) {
      e.preventDefault();
      mouse_is_down = false;
    }
  }

  function handleMouseMove(e) {
    if (!mouse_is_down)
      return;

    e.preventDefault();

    const factor = reverse ? -1 : 1;

    if (direction === 'column') {
      split_pos += e.movementY * factor;
    } else if (direction === 'row') {
      split_pos += e.movementX * factor;
    }
  }
</script>

<style>
  div {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;

    opacity: 0.0;

    border-radius: 4px;

    background: var(--color-background-2);
    transition: opacity var(--anim-short);
  }

  div:hover {
    opacity: 1.0;
  }

  div.horizontal {
    cursor: ew-resize;
    width: 8px;
    transform: translateX(-50%);
  }

  div.vertical {
    cursor: ns-resize;
    height: 8px;
    transform: translateY(-50%);
  }
</style>

<svelte:window
  on:mouseup={handleMouseUp}
  on:mousemove={handleMouseMove}
/>

<div
  class:horizontal={direction === 'row'}
  class:vertical={direction === 'column'}
  on:mousedown={handleMouseDown}
></div>
