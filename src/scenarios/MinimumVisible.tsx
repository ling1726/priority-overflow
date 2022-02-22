import React from "react";
import { makeStyles } from "@fluentui/react-components";
import { TestOverflow } from "../utils/TestOverflow";
import { TestOverflowItem } from "../utils/TestOverflowItem";
import { OverflowMenu } from "../utils/OverflowMenu";

const useStyles = makeStyles({
  container: {
    textAlign: "center",
  },
});

function App() {
  const styles = useStyles();
  const itemIds = new Array(8).fill(0).map((_, i) => i);

  return (
    <div className={styles.container}>
      <h2>Minimum visible items</h2>
      <TestOverflow minimumVisible={5}>
        {itemIds.map((_, i) => (
          <TestOverflowItem key={i} id={i} />
        ))}
        <OverflowMenu itemIds={itemIds} />
      </TestOverflow>
    </div>
  );
}

export default App;
