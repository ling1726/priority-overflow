import {
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

export const TableOverflowItem: React.FC = () => {
  const isOverflowing = !useIsOverflowItemVisible("Table");
  let open = useToolbarContext((v) => v.table === "main");
  const dispatch = useToolbarContext((v) => v.dispatch);

  React.useEffect(() => {
    if (isOverflowing) {
      dispatch({ type: "Table", value: false });
    }
  }, [isOverflowing, dispatch]);

  const onOpenChange: PopoverProps["onOpenChange"] = (e, data) => {
    dispatch({ type: "Table", value: data.open ? "main" : false });
  };

  if (isOverflowing) {
    open = false;
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger>
        <OverflowToolbarItem id="Table" icon={<TableIcon />} />
      </PopoverTrigger>
      <PopoverSurface aria-label="add table">
        Add a table to the editor main
      </PopoverSurface>
    </Popover>
  );
};

export const TableOverflowMenuItem: React.FC = () => {
  const isOverflowing = !useIsOverflowItemVisible("Table");
  const open = useToolbarContext((v) => v.table === "overflow");
  const dispatch = useToolbarContext((v) => v.dispatch);

  const onOpenChange: PopoverProps["onOpenChange"] = (e, data) => {
    dispatch({ type: "Table", value: data.open ? "overflow" : false });
  };

  React.useEffect(() => {
    if (!isOverflowing) {
      dispatch({ type: "Table", value: false });
    }
  }, [isOverflowing, dispatch]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger>
        <OverflowMenuItem persistOnClick id="Table" />
      </PopoverTrigger>
      <PopoverSurface aria-label="Add table">
        Add a table to the editor overflow
      </PopoverSurface>
    </Popover>
  );
};
