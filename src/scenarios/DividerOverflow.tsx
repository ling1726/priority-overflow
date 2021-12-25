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
import { TestOverflowMenuItem } from "../utils/TestOverflowMenuItem";
import { useOverflowContext } from "../react/overflowContext";
import { TestOverflowDividerItem } from "../utils/TestOverflowDividerItem";

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
      <h2>DOM order overflow</h2>
      <Overflow>
        {itemIds.map((_, i) => (
          <TestOverflowDividerItem key={i} id={i} />
        ))}
        <OverflowMenu itemIds={itemIds} />
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
            <TestOverflowMenuItem key={i} id={i} />
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export default App;