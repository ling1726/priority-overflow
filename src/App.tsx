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
  FluentProvider,
  teamsLightTheme,
} from "@fluentui/react-components";
import DomOrder from "./scenarios/DomOrderOverflow";
import Priority from "./scenarios/PriorityOverflow";
import ReverseDomOrder from "./scenarios/ReverseDomOrderOverflow";
import Divider from "./scenarios/DividerOverflow";
import DividerGroups from "./scenarios/DividerGroups";
import DividerGroupsWithPriority from "./scenarios/DividerGroupsWithPriority";
import FarItems from "./scenarios/FarItems";
import MinimumVisible from "./scenarios/MinimumVisible";

const useStyles = makeStyles({
  container: {
    textAlign: "center",
  },

  menu: {
    minWidth: "200px",
  },

  config: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "50px",
  },
});

type Scenarios =
  | "dom"
  | "minimumVisible"
  | "priority"
  | "reverse"
  | "divider"
  | "dividerGroups"
  | "dividerGroupsPriority"
  | "farItems";

function App() {
  const styles = useStyles();
  const [scenarios, setScenarios] = React.useState<Scenarios[]>(["dom"]);
  const onCheckedChange: MenuProps["onCheckedValueChange"] = (e, data) => {
    setScenarios(data.checkedItems as Scenarios[]);
  };
  const [rtl, setRtl] = React.useState(false);

  return (
    <FluentProvider dir={rtl ? "rtl" : "ltr"} theme={teamsLightTheme}>
      <div className={styles.container}>
        <div className={styles.config}>
          <Menu
            onCheckedValueChange={onCheckedChange}
            defaultCheckedValues={{ scenario: scenarios }}
          >
            <MenuTrigger>
              <MenuButton>Hide/display scenarios</MenuButton>
            </MenuTrigger>

            <MenuPopover>
              <MenuList className={styles.menu}>
                <MenuItemCheckbox name="scenario" value="dom">
                  Dom order
                </MenuItemCheckbox>
                <MenuItemCheckbox name="scenario" value="reverse">
                  Reverse dom order
                </MenuItemCheckbox>
                <MenuItemCheckbox name="scenario" value="minimumVisible">
                  Minimum visible items
                </MenuItemCheckbox>
                <MenuItemCheckbox name="scenario" value="priority">
                  Manual priority
                </MenuItemCheckbox>
                <MenuItemCheckbox name="scenario" value="farItems">
                  Far Items
                </MenuItemCheckbox>
                <MenuItemCheckbox name="scenario" value="divider">
                  With dividers
                </MenuItemCheckbox>
                <MenuItemCheckbox name="scenario" value="dividerGroups">
                  With divider groups
                </MenuItemCheckbox>
                <MenuItemCheckbox name="scenario" value="dividerGroupsPriority">
                  With divider groups and priority
                </MenuItemCheckbox>
              </MenuList>
            </MenuPopover>
          </Menu>
          <div>
            <label htmlFor="rtl">RTL ?</label>
            <input
              id="rtl"
              onChange={(e) => setRtl(e.target.checked)}
              type="checkbox"
              name="rtl"
              checked={rtl}
            />
          </div>
        </div>

        {scenarios.includes("dom") && <DomOrder />}
        {scenarios.includes("reverse") && <ReverseDomOrder />}
        {scenarios.includes("priority") && <Priority />}
        {scenarios.includes("divider") && <Divider />}
        {scenarios.includes("farItems") && <FarItems />}
        {scenarios.includes("dividerGroups") && <DividerGroups />}
        {scenarios.includes("dividerGroupsPriority") && (
          <DividerGroupsWithPriority />
        )}
        {scenarios.includes("minimumVisible") && <MinimumVisible />}
      </div>
    </FluentProvider>
  );
}

export default App;
