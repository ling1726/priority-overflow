import * as React from "react";
import {
  Provider,
  teamsTheme,
  Toolbar,
  ToolbarItem,
  PopperRefHandle,
} from "@fluentui/react-northstar";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  FontSizeIcon,
  RemoveFormatIcon,
  OutdentIcon,
  IndentIcon,
  MoreIcon,
  QuoteIcon,
  CodeSnippetIcon,
} from "@fluentui/react-icons-northstar";
import {
  Menu,
  MenuList,
  MenuPopover,
  MenuProps,
  MenuTrigger,
} from "@fluentui/react-components";
import { Overflow } from "../../react/Overflow";
import { useOverflowMenu } from "../../react/useOverflowMenu";
import { useMergedRefs } from "@fluentui/react-utilities";
import {
  initialState,
  ToolbarContext,
  toolbarReducer,
  useToolbarContext,
} from "./state";
import { LinkOverflowItem, LinkOverflowMenuItem } from "./Link";
import { TableOverflowItem, TableOverflowMenuItem } from "./Table";
import { ParagraphOverflowItem, ParagraphOverflowMenuItem } from "./Paragraph";
import { OverflowMenuItem } from "./OverflowMenuItem";
import { OverflowToolbarItem } from "./OverflowToolbarItem";
import { OverflowMenuDivider } from "./OverflowMenuDivider";
import { OverflowToolbarDivider } from "./OverflowToolbarDivider";

export default function App() {
  return (
    <Provider theme={teamsTheme}>
      <Example />
    </Provider>
  );
}

function Example() {
  const [state, dispatch] = React.useReducer(toolbarReducer, initialState);
  const eventTarget = React.useState(() => new EventTarget())[0];
  // Popper can handle window resize, but if the overflow is not a result of window resize the popovers will not
  // update their positions to follow their targets
  const resizeObserver = React.useState(
    () =>
      new ResizeObserver((entries) => {
        if (entries[0]) {
          eventTarget.dispatchEvent(
            new CustomEvent("resize", { detail: { ...entries[0] } })
          );
        }
      })
  )[0];

  const ref = React.useRef<HTMLDivElement>();
  const callbackRef = React.useCallback(
    (el: HTMLDivElement) => {
      if (el) {
        resizeObserver.observe(el);
        ref.current = el;
      } else {
        if (ref.current) {
          resizeObserver.unobserve(ref.current);
        }
      }
    },
    [resizeObserver]
  );

  return (
    <Overflow padding={30} ref={callbackRef}>
      <ToolbarContext.Provider value={{ ...state, dispatch, eventTarget }}>
        <Toolbar>
          <OverflowToolbarItem id="Bold" icon={<BoldIcon />} groupId="style" />
          <OverflowToolbarItem
            id="Italic"
            icon={<ItalicIcon />}
            groupId="style"
          />
          <OverflowToolbarItem
            id="Underline"
            icon={<UnderlineIcon />}
            groupId="style"
          />
          <OverflowToolbarDivider groupId="style" />
          <OverflowToolbarItem
            id="FontSize"
            icon={<FontSizeIcon />}
            groupId="format"
          />
          <OverflowToolbarItem
            id="RemoveFormat"
            icon={<RemoveFormatIcon />}
            groupId="format"
          />
          <OverflowToolbarDivider groupId="format" />
          <OverflowToolbarItem
            id="Outdent"
            icon={<OutdentIcon />}
            groupId="indent"
          />
          <OverflowToolbarItem
            id="Indent"
            icon={<IndentIcon />}
            groupId="indent"
          />
          <OverflowToolbarDivider groupId="indent" />
          <OverflowToolbarItem id="Quote" icon={<QuoteIcon />} />
          <LinkOverflowItem />
          <OverflowToolbarItem id="CodeSnippet" icon={<CodeSnippetIcon />} />
          <TableOverflowItem />
          <ParagraphOverflowItem />
          <OverflowMenu />
        </Toolbar>
      </ToolbarContext.Provider>
    </Overflow>
  );
}

export const OverflowMenu: React.FC = () => {
  const { ref, isOverflowing } = useOverflowMenu<HTMLButtonElement>();
  const dispatch = useToolbarContext((v) => v.dispatch);
  const open = useToolbarContext((v) => v.overflowMenu);
  const target = useToolbarContext((v) => v.target);
  const eventTarget = useToolbarContext((v) => v.eventTarget);
  const popperRef = React.useRef<PopperRefHandle | null>(null);

  // Popper can handle window resize, but if the overflow is not a result of window resize the popovers will not
  // update their positions to follow their targets
  React.useEffect(() => {
    const listener = () => {
      if (popperRef.current) {
        popperRef.current.updatePosition();
      }
    };

    // @ts-ignore
    eventTarget?.addEventListener("resize", listener);
    return () => eventTarget?.removeEventListener("resize", listener);
  }, [popperRef, eventTarget]);
  const targetRef = React.useCallback(
    (el: HTMLButtonElement) => {
      if (target !== el) {
        dispatch({ type: "Target", value: el });
      }
    },
    [dispatch, target]
  );
  const mergedRef = useMergedRefs(ref, targetRef);

  const onOpenChange = React.useCallback<
    NonNullable<MenuProps["onOpenChange"]>
  >(
    (e, data) => {
      if (data.open) {
        dispatch({ type: "OverflowMenuOpen" });
      } else {
        dispatch({ type: "OverflowMenuClose" });
      }
    },
    [dispatch]
  );

  if (!isOverflowing) {
    return null;
  }

  // 1. each item creates its own popover, popover anchored to menutrigger
  // -- more boilerplate code
  // 2. reuse same popover, each 'feature' implements its own PopoverSurface
  // -- overflow menu becomes a lot more stateful
  // -- boundary stops at popover, hard modify the whole popover -> hacky shit
  // -- -- i.e. positioning props
  // 3.

  return (
    <>
      <Menu open={open} positioning={{ popperRef }} onOpenChange={onOpenChange}>
        <MenuTrigger>
          <ToolbarItem ref={mergedRef} icon={<MoreIcon />} />
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <OverflowMenuItem id="Bold" />
            <OverflowMenuItem id="Italic" />
            <OverflowMenuItem id="Underline" />
            <OverflowMenuDivider groupId="style" />
            <OverflowMenuItem id="FontSize" />
            <OverflowMenuItem id="RemoveFormat" />
            <OverflowMenuDivider groupId="format" />
            <OverflowMenuItem id="Outdent" />
            <OverflowMenuItem id="Indent" />
            <OverflowMenuDivider groupId="indent" />
            <OverflowMenuItem id="Quote" />
            <LinkOverflowMenuItem />
            <OverflowMenuItem id="CodeSnippet" />
            <TableOverflowMenuItem />
            <ParagraphOverflowMenuItem />
          </MenuList>
        </MenuPopover>
      </Menu>
    </>
  );
};
