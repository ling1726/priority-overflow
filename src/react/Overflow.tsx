import * as React from 'react';
import { useMergedRefs } from '@fluentui/react-utilities';
import { OverflowGroupState, OnUpdateOverflow, OverflowEventPayload } from '../native/overflowManager';
import { OverflowContext } from './overflowContext';
import { useOverflowContainer } from './useOverflowContainer';

export type OverflowChildProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<never>;
};

export type OverflowProps = {
  children: React.ReactElement;
};

export const Overflow = React.forwardRef((props: OverflowProps, ref) => {
  const [hasOverflow, setHasOverflow] = React.useState(false);
  const [itemVisibility, setItemVisibility] = React.useState<Record<string, boolean>>({});
  const [groupVisibility, setGroupVisibility] = React.useState<Record<string, OverflowGroupState>>({});

  const updateItemVisibility: OnUpdateOverflow = (data: OverflowEventPayload) => {
    setHasOverflow(() => data.invisibleItems.length > 0);
    setItemVisibility(() => {
      const newState: Record<string, boolean> = {};
      data.visibleItems.forEach(x => (newState[x.id] = true));
      data.invisibleItems.forEach(x => (newState[x.id] = false));
      return newState;
    });
    setGroupVisibility(groupVisibility);
  };

  const { containerRef, registerItem, updateOverflow } = useOverflowContainer(updateItemVisibility);

  const mergedRef = useMergedRefs(containerRef, ref);

  const children = React.cloneElement(React.Children.only(props.children), { ref: mergedRef });

  return (
    <OverflowContext.Provider
      value={{
        itemVisibility,
        groupVisibility,
        hasOverflow,
        registerItem,
        updateOverflow,
      }}
    >
      {children}
    </OverflowContext.Provider>
  );
});
