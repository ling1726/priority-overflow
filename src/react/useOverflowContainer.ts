import React from "react";
import {
  OnUpdateOverflow,
  OverflowDirection,
  OverflowItemEntry,
  OverflowManager,
} from "../native/overflowManager";
import { useEventCallback } from "../utils/useEventCallback";

export const overflowAttr = "data-overflow-item";
export const overflowPriorityAttr = "data-overflow-priority";

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
  const overflowManagerRef = React.useRef<OverflowManager>(
    new OverflowManager(updateOverflowItems)
  );

  React.useLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const overflowManager = overflowManagerRef.current;
    overflowManager.observe(containerRef.current, {
      overflowDirection,
    });

    return () => {
      overflowManager.disconnect();
    };
  }, [updateOverflowItems, overflowDirection]);

  const registerItem = React.useCallback((item: OverflowItemEntry) => {
    if (overflowManagerRef.current) {
      overflowManagerRef.current.addItems(item);
    }
  }, []);

  const deregisterItem = React.useCallback((itemId: string | number) => {
    if (overflowManagerRef.current) {
      overflowManagerRef.current.removeItem(itemId + "");
    }
  }, []);

  const updateOverflow = React.useCallback(() => {
    if (overflowManagerRef.current) {
      overflowManagerRef.current.updateOverflow();
    }
  }, []);

  return {
    containerRef,
    registerItem,
    deregisterItem,
    updateOverflow,
  };
};
