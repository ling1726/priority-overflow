import { Button, makeStyles } from "@fluentui/react-components";
import * as React from "react";
import { OverflowItem } from "../react/OverflowItem";

const useStyles = makeStyles({
  button: {
    marginLeft: "2px",
    marginRight: "2px",
  },
});

export const TestOverflowItem: React.FC<TestOverflowItemProps> = (props) => {
  const styles = useStyles();

  return (
    <OverflowItem id={props.id} priority={props.priority} groupId={props.groupId}>
      <Button className={styles.button}>Item {props.id}</Button>
    </OverflowItem>
  );
};

export interface TestOverflowItemProps {
  id: string | number;
  groupId?: string | number;
  priority?: number;
}
