import React from "react";
import { makeStyles } from "@fluentui/react-components";
import { Overflow } from "../react/Overflow";
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
      <h2>Reverse DOM order overflow</h2>
      <Overflow overflowDirection="start">
        <OverflowMenu itemIds={itemIds} />
        {itemIds.map((_, i) => (
          <TestOverflowItem key={i} id={i} />
        ))}
      </Overflow>
    </div>
  );
}

export default App;
