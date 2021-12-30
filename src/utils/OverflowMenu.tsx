import {
  Button,
  Menu,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@fluentui/react-components";
import * as React from "react";
import { useOverflowContext } from "../react/overflowContext";
import { TestOverflowMenuItem } from "./TestOverflowMenuItem";

export const OverflowMenu: React.FC<{ itemIds: string[] | number[] }> = ({
  itemIds,
}) => {
  const overflowCount = useOverflowContext((v) => {
    return Object.entries(v.itemVisibility).reduce((acc, cur) => {
      if (!cur[0].startsWith("divider") && !cur[1]) {
        acc++;
      }

      return acc;
    }, 0);
  });
  const updateOverflow = useOverflowContext((v) => v.updateOverflow);

  // From what I can see no overflow solution really handles
  // extra elements (i.e. overflow menu button) unless it is coupled to the expected UI (IMO the coupling is bad)
  // I don't think manually recalculating is so bad
  // What commonly happens is to set padding in the container to account for the extra element
  // Alternatives:
  // 1. create a `renderOverflowMenu` call back (this is the same as currently tbh)
  // 2. use a mutation observer to observe smth like data-update-overflow when an element is added
  // 3. Use the configurable padding so that the menu always fits (reakit solution: https://codesandbox.io/s/ariakit-collapsible-tab-835t8?file=/src/tab-collapsible.tsx)
  React.useEffect(() => {
    if (overflowCount > 0) {
      updateOverflow();
    }
  }, [overflowCount, updateOverflow]);

  if (overflowCount === 0) {
    return null;
  }

  return (
    <Menu>
      <MenuTrigger>
        <Button>+{overflowCount} items</Button>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          {itemIds.map((i) => {
            if (typeof i === "string" && i.startsWith("divider")) {
              return null;
            }
            return <TestOverflowMenuItem key={i} id={i} />;
          })}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
