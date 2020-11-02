import type { Readable } from "svelte/store";

interface TimeSubscribtion {
  timestamp: number,
  unsub: () => void;
}

export interface Timed {
  timestampStore: Readable<number>;
}

export default class TimedSequence<T extends Timed> {
  #times: Map<T, TimeSubscribtion> = new Map();
  #items: Array<T>;

  constructor(length?: number) {
    this.#items = length ? new Array(length) : [];
  }

  get length(): number {
    return this.#items.length;
  }

  get arr(): ArrayLike<T> {
    return this.#items;
  }

  resort(): this {
    this.#items.sort((a, b) => {
      const ta = this.#times.get(a).timestamp;
      const tb = this.#times.get(b).timestamp;

      return ta - tb;
    });

    return this;
  }

  insert(item: T): this {
    if (this.#times.has(item)) {
      return this;
    }

    const subscribtion: TimeSubscribtion = {
      timestamp: 0,
      unsub: null,
    };

    this.#items.push(item);
    this.#times.set(item, subscribtion);

    subscribtion.unsub = item.timestampStore.subscribe((time) => {
      subscribtion.timestamp = time;

      const index = this.#items.indexOf(item);
      let dirty = false;

      if (index + 1 < this.#items.length) {
        const nextTime = this.#times.get(this.#items[index + 1]).timestamp;

        dirty = dirty || time > nextTime;
      } else if (index > 0) {
        const previousTime = this.#times.get(this.#items[index - 1]).timestamp;

        dirty = dirty || previousTime > time;
      }

      if (dirty) {
        this.resort();
      }
    });
  }

  remove(item: T): this {
    const index = this.#items.indexOf(item);

    if (index >= 0) {
      this.#items.splice(index, 1);
      this.#times.delete(item);
    }

    return this;
  }
}
