import * as React from "react";
import { ToolbarItem, useMergedRefs } from "@fluentui/react-northstar";
import { useOverflowItem } from "../../react/useOverflowItem";

export const OverflowToolbarItem = React.forwardRef<
  HTMLButtonElement,
  OverflowToolbarItemProps
>((props, ref) => {
  const { id, icon, groupId, ...rest } = props;
  const overflowItemref = useOverflowItem<HTMLButtonElement>(
    id,
    undefined,
    groupId
  );
  const mergedRef = useMergedRefs(overflowItemref, ref);

  return <ToolbarItem ref={mergedRef} icon={icon} {...rest} />;
});

export interface OverflowToolbarItemProps {
  id: string;
  icon?: React.ReactNode;
  groupId?: string;
  onClick?: (e: React.SyntheticEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}
