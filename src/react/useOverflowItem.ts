import * as React from "react";
import { useOverflowContext } from "./overflowContext";

export function useOverflowItem<TElement extends HTMLElement>(
  id: string | number,
  priority?: number
) {
  const ref = React.useRef<TElement>(null);
  const registerItem = useOverflowContext((v) => v.registerItem);
  // TODO should this be another hook or part of this hook
  // const isVisible = useOverflowContext((v) => v.itemVisibility[id]);

  React.useLayoutEffect(() => {
    let deregisterItem: () => void = () => null;
    if (ref.current) {
      deregisterItem = registerItem({
        element: ref.current,
        id: id + "",
        priority: priority ?? 0,
      });
    }

    return () => {
      deregisterItem();
    };
  }, [id, priority, registerItem]);

  return ref;
}
