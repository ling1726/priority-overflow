import { useFluent } from "@fluentui/react-components";
import React from "react";
import {
  OverflowDirection,
  OverflowEventHandler,
  OverflowItemEntry,
  OverflowManager,
} from "../native/overflowManager";
import { useEventCallback } from "../utils/useEventCallback";

export const overflowAttr = "data-overflow-item";
export const overflowPriorityAttr = "data-overflow-priority";

export type OnUpdateOverflow = (
  visibleItems: OverflowItemEntry[],
  invisibleItems: OverflowItemEntry[]
) => void;

export const useOverflowContainer = (
  update: OnUpdateOverflow,
  overflowDirection?: OverflowDirection
) => {
  const { targetDocument } = useFluent();
  // DOM ref to the overflow container element
  const containerRef = React.useRef<HTMLDivElement>(null);
  // DOM ref to a spacer element, used to detect available space at the end of the container
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const overflowManagerRef = React.useRef<OverflowManager>(
    new OverflowManager()
  );

  const updateOverflowItems = useEventCallback(update);

  React.useLayoutEffect(() => {
    if (
      !containerRef.current ||
      !sentinelRef.current ||
      !targetDocument?.defaultView
    ) {
      return;
    }

    const overflowManager = overflowManagerRef.current;
    overflowManager.overflowDirection = overflowDirection ?? "end";
    overflowManager.container = containerRef.current;
    overflowManager.sentinel = sentinelRef.current;
    const listener: OverflowEventHandler = (e) => {
      updateOverflowItems(e.detail.visibleItems, e.detail.invisibleItems);
    };
    overflowManager.addEventListener(listener);

    overflowManager.start();

    return () => {
      overflowManager.stop();
      overflowManager.removeEventListener(listener);
    };
  }, [updateOverflowItems, targetDocument, overflowDirection]);

  // Resize the contianer by 1px temporarily to trigger resize observer on initial render
  React.useLayoutEffect(() => {
    if (containerRef.current) {
      const origWidth = containerRef.current.getBoundingClientRect().width;

      containerRef.current.style.width = `${origWidth + 1}px`;
      setTimeout(() => (containerRef.current!.style.width = ""));
    }
  }, []);

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

  return { containerRef, sentinelRef, registerItem, deregisterItem };
};
