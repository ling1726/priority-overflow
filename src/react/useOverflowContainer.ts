import { useFluent } from "@fluentui/react-components";
import React from "react";
import { OverflowItemEntry, OverflowManager } from "../native/overflowManager";
import { useEventCallback } from "../utils/useEventCallback";

export const overflowAttr = "data-overflow-item";
export const overflowPriorityAttr = "data-overflow-priority";

export type OnUpdateOverflow = (
  visibleItems: OverflowItemEntry[],
  invisibleItems: OverflowItemEntry[]
) => void;

export const useOverflowContainer = (update: OnUpdateOverflow) => {
  const { targetDocument } = useFluent();
  // DOM ref to the overflow container element
  const containerRef = React.useRef<HTMLDivElement>(null);
  // DOM ref to a spacer element, used to detect available space at the end of the container
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const overflowManagerRef = React.useRef<OverflowManager>();

  const updateOverflowItems = useEventCallback(update);

  React.useLayoutEffect(() => {
    if (
      !containerRef.current ||
      !sentinelRef.current ||
      !targetDocument?.defaultView
    ) {
      return;
    }

    overflowManagerRef.current = new OverflowManager(
      containerRef.current,
      sentinelRef.current,
      targetDocument?.defaultView
    );
    const overflowManager = overflowManagerRef.current;
    overflowManager.addEventListener((e) => {
      updateOverflowItems(e.detail.visibleItems, e.detail.invisibleItems);
    });

    const mutationObserver = new MutationObserver((mutationList) => {
      const shouldObserve = (el: HTMLElement) => {
        return el.hasAttribute && el.hasAttribute(overflowAttr);
      };

      mutationList.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          const el = node as HTMLElement;
          if (shouldObserve(el)) {
            const itemId = el.getAttribute(overflowAttr)!;
            overflowManager.removeItem(itemId);
          }
        });

        mutation.addedNodes.forEach((node) => {
          const el = node as HTMLElement;
          if (shouldObserve(el)) {
            const itemId = el.getAttribute(overflowAttr)!;
            const priority = parseInt(
              el.getAttribute(overflowPriorityAttr) ?? "0"
            );

            overflowManager.addItems({
              element: el,
              priority,
              id: itemId,
            });
          }
        });
      });
    });

    if (containerRef.current) {
      const initial = containerRef.current.querySelectorAll(
        `[${overflowAttr}]`
      );
      Array.from(initial).forEach((el: Element) => {
        const itemId = el.getAttribute(overflowAttr)!;
        const priority = parseInt(el.getAttribute(overflowPriorityAttr) ?? "0");
        if (!overflowManager.hasItem(itemId)) {
          overflowManager.addItems({
            element: el as HTMLElement,
            priority,
            id: itemId,
          });
        }
      });
    }

    overflowManager.start();
    if (containerRef.current) {
      mutationObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }
    return () => {
      mutationObserver.disconnect();
      overflowManager.dispose();
    };
  }, [updateOverflowItems, targetDocument]);

  // Resize the contianer by 1px temporarily to trigger resize observer on initial render
  React.useLayoutEffect(() => {
    if (containerRef.current) {
      const origWidth = containerRef.current.getBoundingClientRect().width;

      containerRef.current.style.width = `${origWidth + 1}px`;
      setTimeout(() => (containerRef.current!.style.width = ""));
    }
  }, []);

  return { containerRef, sentinelRef };
};
