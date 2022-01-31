import { MenuDivider } from "@fluentui/react-components";
import * as React from "react";
import { useIsOverflowGroupVisible } from "../../react/useIsOverflowGroupVisible";
export const OverflowMenuDivider: React.FC<{
  groupId: string | number;
}> = (props) => {
  const isGroupVisible = useIsOverflowGroupVisible(props.groupId);

  if (isGroupVisible === "visible") {
    return null;
  }

  return <MenuDivider />;
};
