import React from "react";
import {
  makeStyles,
  mergeClasses,
  shorthands,
} from "@fluentui/react-components";
import {
  defaultUpdateVisibilityCallback,
  useOverflowContainer,
} from "./useOverflowContainer";
import { OverflowContext } from "./overflowContext";
import {
  OnUpdateOverflow,
  OverflowAxis,
  OverflowDirection,
  OverflowGroupState,
} from "../native/overflowManager";
import { useMergedRefs } from "@fluentui/react-northstar";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexWrap: "nowrap",
    minWidth: 0,
    ...shorthands.overflow("hidden"),
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

export const Overflow = React.forwardRef<HTMLDivElement, OverflowProps>(
  (props, ref) => {
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
        onUpdateItemVisibility: defaultUpdateVisibilityCallback,
      }
    );

    const mergedRef = useMergedRefs(containerRef, ref);

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
          ref={mergedRef}
          className={mergeClasses(
            styles.container,
            props.className,
            props.overflowAxis === "vertical" && styles.vertical,
            "overflow-container"
          )}
        >
          {props.children}
        </div>
      </OverflowContext.Provider>
    );
  }
);
