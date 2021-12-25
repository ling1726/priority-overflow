import { MenuItem } from "@fluentui/react-components";
import * as React from "react";
import { useOverflowContext } from "../react/overflowContext";
export const TestOverflowMenuItem: React.FC<{
  id: string | number;
}> = (props) => {
  const isVisible = !!useOverflowContext((v) => v.itemVisibility[props.id]);

  if (isVisible) {
    return null;
  }

  return <MenuItem>Item {props.id}</MenuItem>;
};
