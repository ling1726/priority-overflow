import React from "react";
import { makeStyles } from "@fluentui/react-components";
import { TestOverflowItem } from "../utils/TestOverflowItem";
import { TestOverflow } from "../utils/TestOverflow";
import { TestOverflowDivider } from "../utils/TestOverflowDivider";
import { OverflowMenu } from "../utils/OverflowMenu";

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
      <TestOverflow overflowDirection="end">
        <TestOverflowItem id={1} />
        <TestOverflowDivider id={`divider-1`} />
        <TestOverflowItem id={2} />
        <TestOverflowDivider id={`divider-2`} />
        <TestOverflowItem id={3} />
        <TestOverflowItem id={4} />
        <TestOverflowDivider id={`divider-3`} />
        <TestOverflowItem id={5} />
        <TestOverflowItem id={6} />
        <TestOverflowItem id={7} />
        <TestOverflowDivider id={`divider-4`} />
        <TestOverflowItem id={8} />
        <OverflowMenu
          itemIds={[
            1,
            "divider-1",
            2,
            "divider-2",
            3,
            4,
            "divider-3",
            5,
            6,
            7,
            "divider-4",
            8,
          ]}
        />
      </TestOverflow>
    </div>
  );
}

export default App;
