import React from "react";
import { makeStyles } from "@fluentui/react-components";
// import { OverflowMenu } from "../utils/OverflowMenu";
import { TestOverflowItem } from "../utils/TestOverflowItem";
import { Overflow } from "../react/Overflow";
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
      <Overflow>
        <TestOverflowItem id={1} />
        <TestOverflowDivider id={`divider-${1}`} />
        <TestOverflowItem id={2} />
        <TestOverflowDivider id={`divider-${2}`} />
        <TestOverflowItem id={3} />
        <TestOverflowItem id={4} />
        <TestOverflowDivider id={`divider-${3}`} />
        <TestOverflowItem id={5} />
        <TestOverflowItem id={6} />
        <TestOverflowItem id={7} />
        <TestOverflowDivider id={`divider-${4}`} />
        <TestOverflowItem id={8} />
        <OverflowMenu itemIds={[1, 2, 3, 4, 5, 6, 7, 8]} />
      </Overflow>
    </div>
  );
}

export default App;
