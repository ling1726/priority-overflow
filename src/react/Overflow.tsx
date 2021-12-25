import React from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { OnUpdateOverflow, useOverflowContainer } from "./useOverflowContainer";
import { OverflowContext } from "./overflowContext";
import { OverflowDirection } from "../native/overflowManager";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexWrap: "nowrap",
    minWidth: 0,
    overflow: "hidden",
  },
});

export const Overflow: React.FC<{
  overflowDirection?: OverflowDirection;
  className?: string;
}> = (props) => {
  const styles = useStyles();
  const [hasOverflow, setHasOverflow] = React.useState(false);
  const [itemVisiblity, setItemVisibility] = React.useState<
    Record<string, boolean>
  >({});

  const updateItemVisibility: OnUpdateOverflow = ({
    visibleItems,
    invisibleItems,
  }) => {
    setHasOverflow(() => invisibleItems.length > 0);
    setItemVisibility(() => {
      const newState: Record<string, boolean> = {};
      visibleItems.forEach((x) => (newState[x.id] = true));
      invisibleItems.forEach((x) => (newState[x.id] = false));

      return newState;
    });
  };

  const { containerRef, sentinelRef, registerItem, deregisterItem } =
    useOverflowContainer(updateItemVisibility, props.overflowDirection);

  return (
    <OverflowContext.Provider
      value={{
        itemVisibility: itemVisiblity,
        hasOverflow,
        registerItem,
        deregisterItem,
      }}
    >
      <div
        ref={containerRef}
        className={mergeClasses(styles.container, props.className)}
      >
        {props.children}
        <div style={{ width: 1 }} ref={sentinelRef} />
      </div>
    </OverflowContext.Provider>
  );
};
