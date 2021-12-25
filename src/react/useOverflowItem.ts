import * as React from "react";
import { useOverflowContext } from "./overflowContext";

export function useOverflowItem<TElement extends HTMLElement>(
  id: string | number,
  priority?: number
) {
  const ref = React.useRef<TElement>(null);
  const registerItem = useOverflowContext((v) => v.registerItem);
  const deregisterItem = useOverflowContext((v) => v.deregisterItem);

  React.useLayoutEffect(() => {
    if (ref.current) {
      registerItem({
        element: ref.current,
        id: id + "",
        priority: priority ?? 0,
      });
    }

    return () => {
      deregisterItem(id);
    };
  }, [id, priority, registerItem, deregisterItem]);

  return ref;
}
