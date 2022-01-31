import * as React from "react";
import {
  Popover,
  PopoverProps,
  PopoverSurface,
  PopoverTrigger,
} from "@fluentui/react-components";
import { useToolbarContext } from "./state";
import { useIsOverflowItemVisible } from "../../react/useIsOverflowItemVisible";
import { LinkIcon, PopperRefHandle } from "@fluentui/react-northstar";
import { OverflowToolbarItem } from "./OverflowToolbarItem";
import { OverflowMenuItem } from "./OverflowMenuItem";

export const LinkOverflowItem: React.FC = () => {
  // reduce initial render
  // was ever visible ? -> bailout of rendering popover completely
  // imperative API can allow conditional rendering

  const dispatch = useToolbarContext((v) => v.dispatch);
  const open = useToolbarContext((v) => v.link);
  const ctxTarget = useToolbarContext((v) => v.target);
  const overflowing = !useIsOverflowItemVisible("Link");
  const eventTarget = useToolbarContext((v) => v.eventTarget);
  const popperRef = React.useRef<PopperRefHandle | null>(null);
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

  const target = overflowing ? ctxTarget : undefined;

  return (
    <Popover
      open={open}
      onOpenChange={onOpenChange}
      positioning={{ target, popperRef }}
    >
      <PopoverTrigger>
        <OverflowToolbarItem id="Link" icon={<LinkIcon />} />
      </PopoverTrigger>
      <PopoverSurface aria-label="Add link">
        Add a link to the editor
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
