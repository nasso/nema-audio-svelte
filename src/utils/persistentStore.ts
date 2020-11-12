import { eq, satisfies } from "semver";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

interface PersistentStoreData<T> {
  ver: string,
  data: T,
}

function isPersistentStoreData<T>(val: unknown):
  val is PersistentStoreData<T> {
  if (val instanceof Object && !Array.isArray(val)) {
    const rec = val as Record<string, unknown>;

    return !!rec.ver && rec.data !== undefined;
  }

  return false;
}

type Patcher<T> = (
    current: T,
    stored: Record<string, unknown>,
    storedVersion: string
) => void;

export interface PersistentStoreOptions<T> {
  version?: string,
  timeout?: number,
  patch?: Patcher<T>,
}

export type Persistent<T> = Writable<T>;

export function persistent<T>(
  key: string,
  defaultValue: T,
  options?: PersistentStoreOptions<T>,
): Persistent<T> {
  // degrade gracefully to a plain writable
  if (!window.localStorage) {
    return writable(defaultValue);
  }

  // default parameters
  const parameters = Object.assign({
    version: "1.0.0",
    timeout: 200,
    patch: (current, stored) => {
      const storedKeys = Object.keys(stored);

      Object.keys(current)
        .filter((key) => storedKeys.includes(key))
        .forEach((key) => {
          current[key] = stored[key];
        });
    },
  } as PersistentStoreOptions<T>, options);

  const initialValue: PersistentStoreData<T> = {
    ver: parameters.version,
    data: defaultValue,
  };

  // load initial value from localStorage
  const storedJson = window.localStorage.getItem(key);

  if (storedJson) {
    const storedValue = JSON.parse(storedJson);

    if (isPersistentStoreData<Record<string, unknown>>(storedValue)) {
      if (satisfies(parameters.version, `^${storedValue.ver}`)) {
        parameters.patch(
          initialValue.data,
          storedValue.data,
          storedValue.ver,
        );
      }

      // if the values differ, persist the updated value
      if (!eq(initialValue.ver, storedValue.ver)) {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      }
    }
  }

  // create the store
  const store = writable(initialValue);

  let timeout: number = null;

  store.subscribe((newValue) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;
      window.localStorage.setItem(key, JSON.stringify(newValue));
    }, parameters.timeout);
  });

  return {
    subscribe: (run) => {
      return store.subscribe(({ data }) => run(data));
    },
    set: (newValue) => {
      store.update((value) => ({ ...value, data: newValue }));
    },
    update: (updater) => {
      store.update((value) => ({ ...value, data: updater(value.data) }));
    },
  };
}
