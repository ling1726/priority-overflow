import React from "react";
import {
  MenuButton,
  makeStyles,
  Menu,
  MenuItemCheckbox,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MenuProps,
} from "@fluentui/react-components";
import DomOrder from "./scenarios/DomOrderOverflow";
import Priority from "./scenarios/PriorityOverflow";
import Memoized from "./scenarios/MemoizedOverflow";
import ReverseDomOrder from "./scenarios/ReverseDomOrderOverflow";
import Divider from "./scenarios/DividerOverflow";
import FarItems from "./scenarios/FarItems";

const useStyles = makeStyles({
  container: {
    textAlign: "center",
  },

  menu: {
    minWidth: "200px",
  },

  menuButton: {
    marginBottom: "50px",
  },
});

type Scenarios =
  | "dom"
  | "priority"
  | "memoized"
  | "reverse"
  | "divider"
  | "farItems";

function App() {
  const styles = useStyles();
  const [scenarios, setScenarios] = React.useState<Scenarios[]>(["dom"]);
  const onCheckedChange: MenuProps["onCheckedValueChange"] = (e, data) => {
    setScenarios(data.checkedItems as Scenarios[]);
  };

  return (
    <div className={styles.container}>
      <Menu
        onCheckedValueChange={onCheckedChange}
        defaultCheckedValues={{ scenario: scenarios }}
      >
        <MenuTrigger>
          <MenuButton className={styles.menuButton}>
            Hide/display scenarios
          </MenuButton>
        </MenuTrigger>

        <MenuPopover>
          <MenuList className={styles.menu}>
            <MenuItemCheckbox name="scenario" value="dom">
              Dom order
            </MenuItemCheckbox>
            <MenuItemCheckbox name="scenario" value="reverse">
              Reverse dom order
            </MenuItemCheckbox>
            <MenuItemCheckbox name="scenario" value="priority">
              Manual priority
            </MenuItemCheckbox>
            <MenuItemCheckbox name="scenario" value="memoized">
              Memoized
            </MenuItemCheckbox>
            <MenuItemCheckbox name="scenario" value="divider">
              With dividers
            </MenuItemCheckbox>
            <MenuItemCheckbox name="scenario" value="farItems">
              FarItems
            </MenuItemCheckbox>
          </MenuList>
        </MenuPopover>
      </Menu>

      {scenarios.includes("dom") && <DomOrder />}
      {scenarios.includes("reverse") && <ReverseDomOrder />}
      {scenarios.includes("priority") && <Priority />}
      {scenarios.includes("memoized") && <Memoized />}
      {scenarios.includes("divider") && <Divider />}
      {scenarios.includes("farItems") && <FarItems />}
    </div>
  );
}

export default App;
