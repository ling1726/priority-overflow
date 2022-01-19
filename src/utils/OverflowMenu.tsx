import {
  Button,
  Menu,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@fluentui/react-components";
import * as React from "react";
import { useOverflowMenu } from "../react/useOverflowMenu";
import { TestOverflowMenuItem } from "./TestOverflowMenuItem";
import { TestOverflowMenuDivider } from "./TestOverflowMenuDivider";

export const OverflowMenu: React.FC<{ itemIds: (string | number)[] }> = ({
  itemIds,
}) => {
  const { ref, overflowCount, isOverflowing } =
    useOverflowMenu<HTMLButtonElement>();

  if (!isOverflowing) {
    return null;
  }

  return (
    <Menu>
      <MenuTrigger>
        <Button ref={ref}>+{overflowCount} items</Button>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          {itemIds.map((i) => {
            if (typeof i === "string" && i.startsWith("divider")) {
              return <TestOverflowMenuDivider key={i} id={i} />;
            }
            return <TestOverflowMenuItem key={i} id={i} />;
          })}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
