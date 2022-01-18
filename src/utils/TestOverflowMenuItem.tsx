import { MenuItem } from "@fluentui/react-components";
import * as React from "react";
import { useIsOverflowItemVisible } from "../react/useIsOverflowItemVisible";
export const TestOverflowMenuItem: React.FC<{
  id: string | number;
}> = (props) => {
  const isVisible = useIsOverflowItemVisible(props.id);

  if (isVisible) {
    return null;
  }

  return <MenuItem>Item {props.id}</MenuItem>;
};
