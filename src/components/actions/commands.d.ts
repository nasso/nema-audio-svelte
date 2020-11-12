/* eslint-disable @typescript-eslint/no-unused-vars */

declare namespace svelte.JSX {
  interface DOMAttributes<T> {
    oncommand?: svelte.JSX.EventHandler<CustomEvent<string>, T>;
  }
}
