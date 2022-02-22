import * as React from 'react';
import { useMergedRefs } from "@fluentui/react-northstar";
import { useOverflowItem } from './useOverflowItem';

export type OverflowItemChildProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<never>;
};

export type OverflowItemProps = {
  id: string | number;
  groupId?: string | number;
  priority?: number;
  children: React.ReactElement;
};

export const OverflowItem = React.forwardRef((props: OverflowItemProps, ref) => {
  const { id, groupId, priority, children } = props;

  const containerRef = useOverflowItem<HTMLDivElement>(id, priority, groupId);

  const mergedRef = useMergedRefs(containerRef, ref);

  return React.cloneElement(React.Children.only(children), { ref: mergedRef, id, groupId, priority });
});
