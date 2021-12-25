import React from "react";
import { makeStyles } from "@fluentui/react-components";
import { useOverflowContainer } from "./useOverflowContainer";
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

export const Overflow: React.FC<{ overflowDirection?: OverflowDirection }> = (
  props
) => {
  const styles = useStyles();
  const [hasOverflow, setHasOverflow] = React.useState(false);
  const [itemVisiblity, setItemVisibility] = React.useState<
    Record<string, boolean>
  >({});
  const { containerRef, sentinelRef, registerItem, deregisterItem } =
    useOverflowContainer((visibleItems, invisibleItems) => {
      setHasOverflow(() => invisibleItems.length > 0);
      setItemVisibility(() => {
        const newState: Record<string, boolean> = {};
        visibleItems.forEach((x) => (newState[x.id] = true));
        invisibleItems.forEach((x) => (newState[x.id] = false));

        return newState;
      });
    }, props.overflowDirection);

  return (
    <OverflowContext.Provider
      value={{
        itemVisibility: itemVisiblity,
        hasOverflow,
        registerItem,
        deregisterItem,
      }}
    >
      <div ref={containerRef} className={styles.container}>
        {props.children}
        <div style={{ width: 1 }} ref={sentinelRef} />
      </div>
    </OverflowContext.Provider>
  );
};
