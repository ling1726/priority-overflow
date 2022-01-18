import React from "react";
import { makeStyles } from "@fluentui/react-components";
import { TestOverflowItem } from "../utils/TestOverflowItem";
import { Overflow } from "../react/Overflow";
import { OverflowMenu } from "../utils/OverflowMenu";
import { useOverflowItem } from "../react/useOverflowItem";
import { useIsOverflowGroupVisible } from "../react/useIsOverflowGroupVisible";

const useStyles = makeStyles({
  container: {
    textAlign: "center",
  },
});

function App() {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <h2>Rendering dividers</h2>
      <Overflow overflowDirection="start">
        <TestOverflowItem id={1} groupId={1} />
        <TestOverflowDivider id={`divider-${1}`} groupId={1} />
        <TestOverflowItem id={2} groupId={2} />
        <TestOverflowDivider id={`divider-${2}`} groupId={2} />
        <TestOverflowItem id={3} groupId={3} />
        <TestOverflowItem id={4} groupId={3} />
        <TestOverflowDivider id={`divider-${3}`} groupId={3} />
        <TestOverflowItem id={5} groupId={5} />
        <TestOverflowItem id={6} groupId={5} />
        <TestOverflowItem id={7} groupId={5} />
        <TestOverflowDivider id={`divider-${4}`} groupId={5} />
        <TestOverflowItem id={8} groupId={4} />
        <OverflowMenu itemIds={[1, 2, 3, 4, 5, 6, 7, 8]} />
      </Overflow>
    </div>
  );
}

const useDividerStyles = makeStyles({
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
  const styles = useDividerStyles();
  const isGroupVisible = useIsOverflowGroupVisible(props.groupId);

  if (!isGroupVisible) {
    return null;
  }

  return (
    <div ref={ref} className={styles.outer}>
      <div className={styles.inner} />
    </div>
  );
};

export interface TestOverflowItemProps {
  id: string | number;
  priority?: number;
  groupId: string | number;
}

export default App;
