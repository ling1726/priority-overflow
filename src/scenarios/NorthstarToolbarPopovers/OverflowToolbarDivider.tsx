import { ToolbarDivider } from "@fluentui/react-northstar";
import * as React from "react";
import { useIsOverflowGroupVisible } from "../../react/useIsOverflowGroupVisible";

export const OverflowToolbarDivider: React.FC<{ groupId: string }> = ({
  groupId,
}) => {
  const isGroupVisible = useIsOverflowGroupVisible(groupId);

  if (isGroupVisible === "hidden") {
    return null;
  }

  return <ToolbarDivider />;
};
