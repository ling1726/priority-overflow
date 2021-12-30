import React from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { useOverflowContainer } from "./useOverflowContainer";
import { OverflowContext } from "./overflowContext";
import {
  OnUpdateOverflow,
  OverflowAxis,
  OverflowDirection,
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
}

export const Overflow: React.FC<OverflowProps> = (props) => {
  const { overflowAxis = "horizontal", overflowDirection, ...rest } = props;
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
      // console.log("visible", visibleItems);
      // console.log("invisible", invisibleItems);

      return newState;
    });
  };

  const { containerRef, registerItem, updateOverflow } = useOverflowContainer(
    updateItemVisibility,
    {
      overflowDirection,
      overflowAxis,
    }
  );

  return (
    <OverflowContext.Provider
      value={{
        itemVisibility: itemVisiblity,
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
