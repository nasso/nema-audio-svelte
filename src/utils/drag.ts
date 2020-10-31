import type { Point } from "@app/utils/geom";
import { get, Readable, writable } from "svelte/store";

interface Settable<T> extends Readable<T> {
  set(value: T): void;
}

type MouseButtons = number | number[];

export interface DragParameters {
  invert?: boolean;
  button?: MouseButtons;
  capture?: boolean | Element;
  offset: Settable<Point>;
}

interface Action<T> {
  update: (parameters: T) => void,
}

export default function drag(node: HTMLElement, parameters: DragParameters): Action<DragParameters> {
  function handlePointerDown(this: HTMLElement, e: PointerEvent) {
    if (
      (typeof parameters.button === "number" && e.button !== parameters.button) ||
      (Array.isArray(parameters.button) && !parameters.button.includes(e.button))
    ) {
      return;
    }

    e.stopImmediatePropagation();
    e.preventDefault();

    const pointerStart: Point = { x: e.clientX, y: e.clientY };
    const startOffset = { ...get(parameters.offset) as Point };
    const capture = parameters.capture
      ? (parameters.capture === true
        ? this
        : parameters.capture)
      : (parameters.capture === false
        ? null
        : this);
    const elem = capture || this;

    const handlePointerMove = (e: PointerEvent) => {
      const delta = {
        x: e.clientX - pointerStart.x,
        y: e.clientY - pointerStart.y,
      };

      const factor = parameters.invert ? -1 : 1;

      parameters.offset.set({
        x: startOffset.x + delta.x * factor,
        y: startOffset.y + delta.y * factor,
      });
    };

    const handlePointerUp = (e: PointerEvent) => {
      elem.removeEventListener("pointermove", handlePointerMove);
      elem.removeEventListener("pointerup", handlePointerUp);

      if (capture) {
        capture.releasePointerCapture(e.pointerId);
      }

      this.dispatchEvent(new CustomEvent("dragend"));
    };

    elem.addEventListener("pointermove", handlePointerMove);
    elem.addEventListener("pointerup", handlePointerUp);

    if (capture) {
      capture.setPointerCapture(e.pointerId);
    }

    this.dispatchEvent(new CustomEvent("dragstart"));
  }

  node.addEventListener("pointerdown", handlePointerDown);

  return {
    update(newParams) {
      parameters = newParams;
    },
  };
}

export function dragscroller(node: HTMLElement, button: MouseButtons = 1): Action<MouseButtons> {
  const scrollStore = writable({ x: node.scrollLeft, y: node.scrollTop });
  const scroll: Settable<Point> = {
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
  };
}
