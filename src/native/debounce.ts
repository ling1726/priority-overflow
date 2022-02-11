/**
 * Microtask debouncer
 * https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide
 * @param fn - Function to debounce
 * @returns debounced function
 */
export default function debounce(fn: Function) {
  let pending: boolean;
  return () => {
    if (!pending) {
      pending = true;
      queueMicrotask(() => {
        fn();
        pending = false;
      });
    }
  };
}
