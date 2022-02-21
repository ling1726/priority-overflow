import * as React from "react";
import {
  Button,
  Popover,
  PopoverProps,
  PopoverSurface,
  PopoverTrigger,
} from "@fluentui/react-components";
import { PopperRefHandle } from "@fluentui/react-positioning";
import { useToolbarContext } from "./state";
import { useIsOverflowItemVisible } from "../../react/useIsOverflowItemVisible";
import { LinkIcon } from "@fluentui/react-northstar";
import { OverflowToolbarItem } from "./OverflowToolbarItem";
import { OverflowMenuItem } from "./OverflowMenuItem";

/**
 * This overflow item will anchor the popover to the overflow menu trigger
 * Will use a target passed from context to anchor the popover if the item is overflowing
 */
export const LinkOverflowItem: React.FC = () => {
  const dispatch = useToolbarContext((v) => v.dispatch);
  // Workaround for tabster/focuszone incompatibility
  const toolbarItemRef = React.useRef<HTMLButtonElement>(null);
  const open = useToolbarContext((v) => v.link);
  const ctxTarget = useToolbarContext((v) => v.target);
  const overflowing = !useIsOverflowItemVisible("Link");
  const eventTarget = useToolbarContext((v) => v.eventTarget);
  const popperRef = React.useRef<PopperRefHandle>({
    updatePosition: () => null,
    setTarget: () => null,
  });
  // Popper should follow target on container resize
  React.useEffect(() => {
    const listener = (e: CustomEvent) => {
      if (popperRef.current) {
        popperRef.current.updatePosition();
      }
    };

    // @ts-ignore
    eventTarget?.addEventListener("resize", listener);
    // @ts-ignore
    return () => eventTarget?.removeEventListener("resize", listener);
  }, [eventTarget, popperRef]);

  const onOpenChange: PopoverProps["onOpenChange"] = (e, data) => {
    dispatch({ type: "Link", value: data.open });
  };

  React.useEffect(() => {
    if (!open) {
      if (overflowing) {
        ctxTarget?.focus();
      } else {
        toolbarItemRef.current?.focus();
      }
    }
    // explicitly missing dependencies to only focus when popover is open/closed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, toolbarItemRef]);

  const target = overflowing ? ctxTarget : undefined;

  // Can use manual target and not wrap the toolbar item at all
  // This would reduce the components rendered on initial render
  // However, would induce extra code to handle a11y behaviour (focus management)
  // Imperative popperRef.setTarget API would help here
  return (
    <Popover
      open={open}
      onOpenChange={onOpenChange}
      positioning={{ target, popperRef }}
      trapFocus
    >
      <PopoverTrigger>
        <OverflowToolbarItem
          ref={toolbarItemRef}
          id="Link"
          icon={<LinkIcon />}
        />
      </PopoverTrigger>
      <PopoverSurface aria-label="Add link">
        Add a link to the editor
        <Button>Add link</Button>
      </PopoverSurface>
    </Popover>
  );
};

export const LinkOverflowMenuItem: React.FC = (props) => {
  const dispatch = useToolbarContext((v) => v.dispatch);
  const onClick = React.useCallback(() => {
    dispatch({ type: "Link", value: true });
  }, [dispatch]);
  return <OverflowMenuItem onClick={onClick} id="Link" />;
};
