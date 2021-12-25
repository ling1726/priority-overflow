import * as React from "react";
import { overflowAttr, overflowPriorityAttr } from "./useOverflowContainer";
export function useOverflowItem(id: string | number, priority?: number) {
  const ref = React.useRef<HTMLElement>();
  const callbackRef = React.useCallback(
    (node: HTMLElement) => {
      if (node) {
        ref.current = node;
        ref.current.setAttribute(overflowAttr, id + "");
        if (priority) {
          ref.current.setAttribute(overflowPriorityAttr, priority + "");
        }
      }
    },
    [id, priority]
  );

  return callbackRef as unknown as React.MutableRefObject<any>;
}
