import { makeStyles } from "@fluentui/react-components";
import * as React from "react";
import { useOverflowItem } from "../react/useOverflowItem";

const useStyles = makeStyles({
  outer: {
    paddingLeft: "4px",
    paddingRight: "4px",
  },

  inner: {
    width: "1px",
    backgroundColor: "red",
    height: "100%",
  },
});

export const TestOverflowDivider: React.FC<TestOverflowItemProps> = (props) => {
  const ref = useOverflowItem<HTMLDivElement>(props.id, props.priority);
  const styles = useStyles();

  return (
    <div ref={ref} className={styles.outer}>
      <div className={styles.inner} />
    </div>
  );
};

export interface TestOverflowItemProps {
  id: string | number;
  priority?: number;
}
