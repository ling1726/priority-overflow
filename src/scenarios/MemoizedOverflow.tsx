import * as React from "react";
import { TestOverflowItem as Unmemoized } from "../utils/TestOverflowItem";
import { makeStyles } from "@fluentui/react-components";
import { Overflow } from "../react/Overflow";
import { OverflowMenu } from "../utils/OverflowMenu";

const TestOverflowItem = React.memo(Unmemoized);

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
      <h2>Memoized overflow items</h2>
      <Overflow>
        {itemIds.map((_, i) => (
          <TestOverflowItem key={i} id={i} />
        ))}
        <OverflowMenu itemIds={itemIds} />
      </Overflow>
    </div>
  );
}
export default App;
