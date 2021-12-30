import { Button, makeStyles } from "@fluentui/react-components";
import * as React from "react";
import { useOverflowItem } from "../react/useOverflowItem";

const useStyles = makeStyles({
  container: {
    display: "flex",
    paddingLeft: "2px",
    paddingRight: "2px",
  },
});

export const TestOverflowItem: React.FC<TestOverflowItemProps> = (props) => {
  const ref = useOverflowItem<HTMLDivElement>(props.id, props.priority);
  const styles = useStyles();

  return (
    <div ref={ref} className={styles.container}>
      <Button>Item {props.id}</Button>
      {props.children}
    </div>
  );
};

export interface TestOverflowItemProps {
  id: string | number;
  priority?: number;
}
