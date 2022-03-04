import React from "react";
import {
  createOverflowManager,
  ObserveOptions,
  OnUpdateItemVisibility,
  OnUpdateOverflow,
  OverflowItemEntry,
  OverflowManager,
} from "../native/overflowManager";
import { useEventCallback } from "../utils/useEventCallback";

export interface useOverflowContainerOptions extends ObserveOptions {}

export const useOverflowContainer = (
  update: OnUpdateOverflow,
  options: Omit<useOverflowContainerOptions, "onUpdateOverflow">
) => {
  const {
    overflowAxis,
    overflowDirection,
    padding,
    minimumVisible,
    onUpdateItemVisibility,
  } = options;
  // DOM ref to the overflow container element
  const containerRef = React.useRef<HTMLDivElement>(null);
  const updateOverflowItems = useEventCallback(update);
  const [overflowManager] = React.useState<OverflowManager>(() =>
    createOverflowManager()
  );

  React.useLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }

    overflowManager.observe(containerRef.current, {
      overflowDirection,
      overflowAxis,
      padding,
      minimumVisible,
      onUpdateItemVisibility,
      onUpdateOverflow: updateOverflowItems,
    });

    return () => {
      overflowManager.disconnect();
    };
  }, [
    updateOverflowItems,
    overflowManager,
    overflowDirection,
    overflowAxis,
    padding,
    minimumVisible,
    onUpdateItemVisibility,
  ]);

  const registerItem = React.useCallback(
    (item: OverflowItemEntry) => {
      overflowManager.addItems(item);

      return () => {
        item.element.style.removeProperty("display");
        overflowManager.removeItem(item.id);
      };
    },
    [overflowManager]
  );

  const updateOverflow = React.useCallback(() => {
    overflowManager.update();
  }, [overflowManager]);

  return {
    containerRef,
    registerItem,
    updateOverflow,
  };
};

export const defaultUpdateVisibilityCallback: OnUpdateItemVisibility = ({
  item,
  visible,
}) => {
  if (visible) {
    item.element.style.removeProperty("display");
  } else {
    item.element.style.setProperty("display", "none");
  }
};
