import React from "react";
import {
  makeStyles,
  mergeClasses,
  shorthands,
} from "@fluentui/react-components";
import {
  OverflowAxis,
  OverflowDirection,
} from "../native/overflowManager";
import { Overflow } from "../react/Overflow";

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

export interface TestOverflowProps extends React.HTMLAttributes<HTMLDivElement> {
  overflowDirection?: OverflowDirection;
  overflowAxis?: OverflowAxis;
  padding?: number;
  minimumVisible?: number;
}

export const TestOverflow = React.forwardRef<HTMLDivElement, TestOverflowProps>(
  (props, ref) => {
    const {
      overflowAxis = "horizontal",
      overflowDirection,
      padding,
      minimumVisible,
      children,
      ...rest
    } = props;

    const styles = useStyles();

    return (
      <Overflow>
        <div
          {...rest}
          ref={ref}
          className={mergeClasses(
            styles.container,
            props.className,
            overflowAxis === "vertical" && styles.vertical,
            "overflow-container"
          )}
        >
          {children}
        </div>
      </Overflow>
    );
  }
);
