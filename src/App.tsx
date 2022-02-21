import React from "react";
import {
  MenuButton,
  makeStyles,
  Menu,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MenuProps,
  FluentProvider,
  teamsLightTheme,
  shorthands,
} from "@fluentui/react-components";
import DomOrder from "./scenarios/DomOrderOverflow";
import Priority from "./scenarios/PriorityOverflow";
import ReverseDomOrder from "./scenarios/ReverseDomOrderOverflow";
import Divider from "./scenarios/DividerOverflow";
import DividerGroups from "./scenarios/DividerGroups";
import DividerGroupsWithPriority from "./scenarios/DividerGroupsWithPriority";
import FarItems from "./scenarios/FarItems";
import MinimumVisible from "./scenarios/MinimumVisible";
import NorthstarToolbar from "./scenarios/NorthstarToolbar";
import NorthstarToolbarDividerGroups from "./scenarios/NorthstarToolbarDividerGroups";
import Selection from "./scenarios/Selection";
import NorthstarToolbarPopovers from "./scenarios/NorthstarToolbarPopovers";

const useStyles = makeStyles({
  container: {
    textAlign: "center",
  },

  menu: {
    minWidth: "200px",
  },

  resizer: {
    "& .overflow-container": {
      ...shorthands.padding("4px"),
      width: "80%",
      ...shorthands.border("1px", "solid"),
      resize: "horizontal",
      "&::-webkit-resizer": {
        backgroundImage: "url(http://i.imgur.com/hQZDwHs.png)",
      },
    },
  },

  config: {
    display: "flex",
    ...shorthands.gap("10px"),
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
  | "northstar"
  | "northstarDividerGroup"
  | "northstarPopovers"
  | "selection"
  | "adaptive"
  | "farItems";

function App() {
  const styles = useStyles();
  const [scenarios, setScenarios] = React.useState<Scenarios[]>(["dom"]);
  const [useResizer, setUseResizer] = React.useState<boolean>(true);
  const onCheckedChange: MenuProps["onCheckedValueChange"] = (e, data) => {
    setScenarios(data.checkedItems as Scenarios[]);
  };
  const [rtl, setRtl] = React.useState(false);

  React.useEffect(() => {
    // css resize actually sets explicit width/height
    if (!useResizer) {
      const overflowContainerEl: HTMLElement | null = document.querySelector(
        ".overflow-container"
      );
      if (overflowContainerEl) {
        overflowContainerEl.style.width = "";
      }
    }
  }, [useResizer]);

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
                <MenuItemRadio name="scenario" value="dom">
                  Dom order
                </MenuItemRadio>
                <MenuItemRadio name="scenario" value="reverse">
                  Reverse dom order
                </MenuItemRadio>
                <MenuItemRadio name="scenario" value="minimumVisible">
                  Minimum visible items
                </MenuItemRadio>
                <MenuItemRadio name="scenario" value="priority">
                  Manual priority
                </MenuItemRadio>
                <MenuItemRadio name="scenario" value="farItems">
                  Far Items
                </MenuItemRadio>
                <MenuItemRadio name="scenario" value="divider">
                  With dividers
                </MenuItemRadio>
                <MenuItemRadio name="scenario" value="dividerGroups">
                  With divider groups
                </MenuItemRadio>
                <MenuItemRadio name="scenario" value="dividerGroupsPriority">
                  With divider groups and priority
                </MenuItemRadio>
                <MenuItemRadio name="scenario" value="northstar">
                  Northstar toolbar
                </MenuItemRadio>
                <MenuItemRadio name="scenario" value="northstarDividerGroup">
                  Northstar toolbar divider groups
                </MenuItemRadio>
                <MenuItemRadio name="scenario" value="selection">
                  Selection
                </MenuItemRadio>
                <MenuItemRadio name="scenario" value="northstarPopovers">
                  Northstar toolbar with popovers
                </MenuItemRadio>
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
          <div>
            <label htmlFor="rtl">Drag resize ?</label>
            <input
              id="rtl"
              onChange={(e) => setUseResizer((s) => !s)}
              type="checkbox"
              name="rtl"
              checked={useResizer}
            />
          </div>
        </div>

        <div className={useResizer ? styles.resizer : ""}>
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
          {scenarios.includes("northstar") && <NorthstarToolbar />}
          {scenarios.includes("northstarDividerGroup") && (
            <NorthstarToolbarDividerGroups />
          )}
          {scenarios.includes("selection") && <Selection />}
          {scenarios.includes("northstarPopovers") && (
            <NorthstarToolbarPopovers />
          )}
        </div>
      </div>
    </FluentProvider>
  );
}

export default App;
