import React from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { useOverflowContainer } from "./useOverflowContainer";
import { OverflowContext } from "./overflowContext";
import {
  OnUpdateOverflow,
  OverflowAxis,
  OverflowDirection,
  OverflowGroupState,
} from "../native/overflowManager";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexWrap: "nowrap",
    minWidth: 0,
    overflow: "hidden",
  },

  vertical: {
    flexDirection: "column",
  },
});

export interface OverflowProps extends React.HTMLAttributes<HTMLDivElement> {
  overflowDirection?: OverflowDirection;
  overflowAxis?: OverflowAxis;
  padding?: number;
  minimumVisible?: number;
}

export const Overflow: React.FC<OverflowProps> = (props) => {
  const {
    overflowAxis = "horizontal",
    overflowDirection,
    padding,
    minimumVisible,
    ...rest
  } = props;
  const styles = useStyles();
  const [hasOverflow, setHasOverflow] = React.useState(false);
  const [itemVisibility, setItemVisibility] = React.useState<
    Record<string, boolean>
  >({});

  const [groupVisibility, setGroupVisibility] = React.useState<
    Record<string, OverflowGroupState>
  >({});

  const updateItemVisibility: OnUpdateOverflow = ({
    visibleItems,
    invisibleItems,
    groupVisibility,
  }) => {
    setHasOverflow(() => invisibleItems.length > 0);
    setItemVisibility(() => {
      const newState: Record<string, boolean> = {};
      visibleItems.forEach((x) => (newState[x.id] = true));
      invisibleItems.forEach((x) => (newState[x.id] = false));
      return newState;
    });
    setGroupVisibility(groupVisibility);
  };

  const { containerRef, registerItem, updateOverflow } = useOverflowContainer(
    updateItemVisibility,
    {
      overflowDirection,
      overflowAxis,
      padding,
      minimumVisible,
    }
  );

  return (
    <OverflowContext.Provider
      value={{
        itemVisibility,
        groupVisibility,
        hasOverflow,
        registerItem,
        updateOverflow,
      }}
    >
      <div
        {...rest}
        ref={containerRef}
        className={mergeClasses(
          styles.container,
          props.className,
          props.overflowAxis === "vertical" && styles.vertical
        )}
      >
        {props.children}
      </div>
    </OverflowContext.Provider>
  );
};
