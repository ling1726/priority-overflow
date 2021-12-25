import React from "react";
import {
  Button,
  makeStyles,
  Menu,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@fluentui/react-components";
import { Overflow } from "../react/Overflow";
import { TestOverflowItem } from "../utils/TestOverflowItem";
import { TestOverflowMenuItem } from "../utils/TestOverflowMenuItem";
import { useOverflowContext } from "../react/overflowContext";

const useStyles = makeStyles({
  container: {
    textAlign: "center",
  },

  exampleContainer: {
    display: "flex",
    justifyContent: "space-between",
  },

  overflowContainer: {
    flexGrow: 1,
  },

  farItems: {
    dislay: "flex",
    gap: "4px",
  },
});

function App() {
  const styles = useStyles();
  const itemIds = new Array(8).fill(0).map((_, i) => i);

  return (
    <div className={styles.container}>
      <h2>Far items</h2>
      <div className={styles.exampleContainer}>
        <Overflow className={styles.overflowContainer}>
          {itemIds.map((_, i) => (
            <TestOverflowItem key={i} id={i} />
          ))}
          <OverflowMenu itemIds={itemIds} />
        </Overflow>

        <div className={styles.farItems}>
          <Button>Foo</Button>
          <Button>Bar</Button>
        </div>
      </div>
    </div>
  );
}

const OverflowMenu: React.FC<{ itemIds: string[] | number[] }> = ({
  itemIds,
}) => {
  const hasOverflow = useOverflowContext((v) => v.hasOverflow);

  if (!hasOverflow) {
    return null;
  }

  return (
    <Menu>
      <MenuTrigger>
        <Button>Overflow menu</Button>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          {itemIds.map((i) => (
            <TestOverflowMenuItem key={i} id={i} />
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export default App;
