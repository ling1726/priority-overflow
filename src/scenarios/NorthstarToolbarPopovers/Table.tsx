import {
  Button,
  Popover,
  PopoverProps,
  PopoverSurface,
  PopoverTrigger,
} from "@fluentui/react-components";
import { TableIcon } from "@fluentui/react-northstar";
import * as React from "react";
import { useIsOverflowItemVisible } from "../../react/useIsOverflowItemVisible";
import { OverflowMenuItem } from "./OverflowMenuItem";
import { OverflowToolbarItem } from "./OverflowToolbarItem";
import { useToolbarContext } from "./state";

/**
 * This item renders the same Popover but in two different places
 * It would be possible to use the same popover in different targets
 * however, that would increase the amount of state management code and increase complexity
 */
export const TableOverflowItem: React.FC = () => {
  const isOverflowing = !useIsOverflowItemVisible("Table");
  // Workaround for tabster/focuszone incompatibility
  const toolbarItemRef = React.useRef<HTMLButtonElement>(null);
  const open = useToolbarContext((v) => {
    if (isOverflowing) {
      return false;
    }

    return v.table;
  });
  const dispatch = useToolbarContext((v) => v.dispatch);

  React.useEffect(() => {
    if (isOverflowing) {
      dispatch({ type: "Table", value: false });
    }
  }, [isOverflowing, dispatch]);

  React.useEffect(() => {
    if (!open && !isOverflowing) {
      toolbarItemRef.current?.focus();
    }
  }, [open, toolbarItemRef]); // explicitly missing dependencies to only focus when popover is open/closed

  const onOpenChange: PopoverProps["onOpenChange"] = (e, data) => {
    dispatch({ type: "Table", value: data.open });
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange} trapFocus>
      <PopoverTrigger>
        <OverflowToolbarItem
          ref={toolbarItemRef}
          id="Table"
          icon={<TableIcon />}
        />
      </PopoverTrigger>
      <PopoverSurface aria-label="add table">
        Add a table to the editor main
        <Button>Add table</Button>
      </PopoverSurface>
    </Popover>
  );
};

export const TableOverflowMenuItem: React.FC = () => {
  const isOverflowing = !useIsOverflowItemVisible("Table");
  const open = useToolbarContext((v) => v.table);
  const dispatch = useToolbarContext((v) => v.dispatch);

  const onOpenChange: PopoverProps["onOpenChange"] = (e, data) => {
    dispatch({ type: "Table", value: data.open });
  };

  React.useEffect(() => {
    if (!isOverflowing) {
      dispatch({ type: "Table", value: false });
    }
  }, [isOverflowing, dispatch]);

  return (
    <Popover open={open} onOpenChange={onOpenChange} trapFocus>
      <PopoverTrigger>
        <OverflowMenuItem persistOnClick id="Table" />
      </PopoverTrigger>
      <PopoverSurface aria-label="Add table">
        Add a table to the editor overflow
        <Button>Add table</Button>
      </PopoverSurface>
    </Popover>
  );
};
