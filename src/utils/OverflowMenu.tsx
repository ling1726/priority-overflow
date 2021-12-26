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
  const hasOverflow = useOverflowContext((v) => v.hasOverflow);
  const updateOverflow = useOverflowContext((v) => v.updateOverflow);

  React.useEffect(() => {
    if (hasOverflow) {
      updateOverflow();
    }
  }, [hasOverflow, updateOverflow]);

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
