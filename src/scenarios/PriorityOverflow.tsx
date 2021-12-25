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
            <TestOverflowMenuItem id={i} key={i} />
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export default App;
