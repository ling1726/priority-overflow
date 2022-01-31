import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuProps,
  MenuTrigger,
} from "@fluentui/react-components";
import { ChevronDownIcon } from "@fluentui/react-northstar";
import * as React from "react";
import { useIsOverflowItemVisible } from "../../react/useIsOverflowItemVisible";
import { OverflowMenuItem } from "./OverflowMenuItem";
import { OverflowToolbarItem } from "./OverflowToolbarItem";
import { useToolbarContext } from "./state";

/**
 * This item renders the same Menu but in two different places.
 * This is preferrable because composition of Menu will give all the default a11y behaviours of
 * nested menus for free
 */
export const ParagraphOverflowItem: React.FC = () => {
  const isOverflowing = !useIsOverflowItemVisible("Paragraph");
  const open = useToolbarContext((v) => {
    if (isOverflowing) {
      return false;
    }

    return v.paragraph;
  });
  const dispatch = useToolbarContext((v) => v.dispatch);

  React.useEffect(() => {
    if (isOverflowing) {
      dispatch({ type: "Paragraph", value: false });
    }
  }, [isOverflowing, dispatch]);

  const onOpenChange: MenuProps["onOpenChange"] = (e, data) => {
    dispatch({ type: "Paragraph", value: data.open });
  };

  return (
    <Menu open={open} onOpenChange={onOpenChange}>
      <MenuTrigger>
        <OverflowToolbarItem id="Paragraph">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
            }}
          >
            Paragraph
            <ChevronDownIcon />
          </div>
        </OverflowToolbarItem>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem>Heading 1</MenuItem>
          <MenuItem>Heading 2</MenuItem>
          <MenuItem>Heading 3</MenuItem>
          <MenuItem>Heading 4</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export const ParagraphOverflowMenuItem: React.FC = () => {
  const isOverflowing = !useIsOverflowItemVisible("Paragraph");
  const open = useToolbarContext((v) => v.paragraph);
  const dispatch = useToolbarContext((v) => v.dispatch);

  const onOpenChange: MenuProps["onOpenChange"] = (e, data) => {
    dispatch({ type: "Paragraph", value: data.open });
  };

  React.useEffect(() => {
    if (!isOverflowing) {
      dispatch({ type: "Paragraph", value: false });
    }
  }, [isOverflowing, dispatch]);

  return (
    <Menu open={open} onOpenChange={onOpenChange}>
      <MenuTrigger>
        <OverflowMenuItem persistOnClick id="Paragraph" />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem>Heading 1</MenuItem>
          <MenuItem>Heading 2</MenuItem>
          <MenuItem>Heading 3</MenuItem>
          <MenuItem>Heading 4</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
