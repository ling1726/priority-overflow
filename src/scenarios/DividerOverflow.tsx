import React from "react";
import { makeStyles } from "@fluentui/react-components";
import { Overflow } from "../react/Overflow";
import { TestOverflowDividerItem } from "../utils/TestOverflowDividerItem";
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
      <h2>Rendering dividers</h2>
      <Overflow>
        {itemIds.map((_, i) => (
          <TestOverflowDividerItem key={i} id={i} />
        ))}
        <OverflowMenu itemIds={itemIds} />
      </Overflow>
    </div>
  );
}

export default App;
