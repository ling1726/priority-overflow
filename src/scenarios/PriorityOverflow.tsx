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
  const priorities = [2, 3, 6, 1, 4, 5, 0, 7];

  return (
    <div className={styles.container}>
      <h2>Priority overflow</h2>
      <Overflow>
        {priorities.map((i) => (
          <TestOverflowItem key={i} id={i} priority={i} />
        ))}
        <OverflowMenu itemIds={priorities} />
      </Overflow>
    </div>
  );
}

export default App;
