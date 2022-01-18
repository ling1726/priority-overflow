import React from "react";
import { makeStyles } from "@fluentui/react-components";
import { TestOverflowItem } from "../utils/TestOverflowItem";
import { Overflow } from "../react/Overflow";
import { OverflowMenu } from "../utils/OverflowMenu";
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
      <h2>Rendering dividers with groups with priority</h2>
      <Overflow overflowDirection="start" padding={30}>
        <TestOverflowItem id={6} priority={6} groupId={1} />
        <TestOverflowGroupDivider id={`divider-${1}`} groupId={1} />
        <TestOverflowItem id={7} priority={7} groupId={2} />
        <TestOverflowGroupDivider id={`divider-${2}`} groupId={2} />
        <TestOverflowItem id={4} priority={4} groupId={3} />
        <TestOverflowItem id={5} priority={5} groupId={3} />
        <TestOverflowGroupDivider id={`divider-${3}`} groupId={3} />
        <TestOverflowItem id={1} priority={1} groupId={4} />
        <TestOverflowItem id={2} priority={2} groupId={4} />
        <TestOverflowItem id={3} priority={3} groupId={4} />
        <TestOverflowGroupDivider id={`divider-${4}`} groupId={4} />
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

export const TestOverflowGroupDivider: React.FC<TestOverflowItemProps> = (
  props
) => {
  const styles = useDividerStyles();
  const isGroupVisible = useIsOverflowGroupVisible(props.groupId);

  if (!isGroupVisible) {
    return null;
  }

  return (
    <div className={styles.outer}>
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
