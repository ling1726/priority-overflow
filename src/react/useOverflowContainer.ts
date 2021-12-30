import React from "react";
import {
  OnUpdateOverflow,
  OverflowDirection,
  OverflowItemEntry,
  OverflowManager,
} from "../native/overflowManager";
import { useEventCallback } from "../utils/useEventCallback";

export interface OnUpdateOverflowData {
  visibleItems: OverflowItemEntry[];
  invisibleItems: OverflowItemEntry[];
  startItem?: OverflowItemEntry;
  endItem?: OverflowItemEntry;
}

export const useOverflowContainer = (
  update: OnUpdateOverflow,
  overflowDirection?: OverflowDirection
) => {
  // DOM ref to the overflow container element
  const containerRef = React.useRef<HTMLDivElement>(null);
  const updateOverflowItems = useEventCallback(update);
  const [overflowManager] = React.useState<OverflowManager>(
    () => new OverflowManager(updateOverflowItems)
  );

  React.useLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }

    overflowManager.observe(containerRef.current, {
      overflowDirection,
    });

    return () => {
      overflowManager.disconnect();
    };
  }, [updateOverflowItems, overflowDirection, overflowManager]);

  const registerItem = React.useCallback(
    (item: OverflowItemEntry) => {
      overflowManager.addItems(item);

      return () => overflowManager.removeItem(item.id);
    },
    [overflowManager]
  );

  const updateOverflow = React.useCallback(
    (padding?: number) => {
      overflowManager.updateOverflow(padding);
    },
    [overflowManager]
  );

  return {
    containerRef,
    registerItem,
    updateOverflow,
  };
};
