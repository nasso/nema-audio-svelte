import { Readable, writable } from "svelte/store";

interface Settable<T> extends Readable<T> {
  set(value: T): void;
}

interface DragOffset {
  x: number,
  y: number,
}

type MouseButtons = number | number[];

export interface DragParameters {
  button?: MouseButtons;
  offset: Settable<DragOffset>;
}

interface Action<T> {
  update: (parameters: T) => void,
  destroy: () => void,
}

export default function drag(node: HTMLElement, parameters: DragParameters): Action<DragParameters> {
  const currentOffset: DragOffset = { x: 0, y: 0 };
  let unsub = parameters.offset.subscribe(handleOffsetChange);

  function handleOffsetChange(val: DragOffset) {
    // copy the values
    currentOffset.x = val.x;
    currentOffset.y = val.y;
  }

  function handlePointerDown(this: HTMLElement, e: PointerEvent) {
    if (
      (typeof parameters.button === "number" && e.button !== parameters.button) ||
      (Array.isArray(parameters.button) && !parameters.button.includes(e.button))
    ) {
      return;
    }

    const pointerStart: DragOffset = { x: e.clientX, y: e.clientY };
    const startOffset = { ...currentOffset };

    function handlePointerMove(this: HTMLElement, e: PointerEvent) {
      const delta = {
        x: pointerStart.x - e.clientX,
        y: pointerStart.y - e.clientY,
      };

      parameters.offset.set({
        x: startOffset.x + delta.x,
        y: startOffset.y + delta.y,
      });
    }

    function handlePointerUp(this: HTMLElement, e: PointerEvent) {
      this.removeEventListener("pointermove", handlePointerMove);
      this.removeEventListener("pointerup", handlePointerUp);
      this.releasePointerCapture(e.pointerId);
    }

    this.addEventListener("pointermove", handlePointerMove);
    this.addEventListener("pointerup", handlePointerUp);
    this.setPointerCapture(e.pointerId);
  }

  node.addEventListener("pointerdown", handlePointerDown);

  return {
    update(newOptions) {
      parameters = newOptions;

      unsub();
      unsub = parameters.offset.subscribe(handleOffsetChange);
    },

    destroy() {
      unsub();
    },
  };
}

export function dragscroller(node: HTMLElement, button: MouseButtons = 1): Action<MouseButtons> {
  const scrollStore = writable({ x: node.scrollLeft, y: node.scrollTop });
  const scroll: Settable<DragOffset> = {
    subscribe: scrollStore.subscribe,

    set(offset) {
      node.scrollLeft = offset.x;
      node.scrollTop = offset.y;

      scrollStore.set({
        x: node.scrollLeft,
        y: node.scrollTop,
      });
    },
  };

  const action = drag(node, {
    button,
    offset: scroll,
  });

  return {
    update(newButton) {
      button = newButton;

      action.update({
        button,
        offset: scroll,
      });
    },

    destroy: action.destroy,
  };
}
