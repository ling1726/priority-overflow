import * as React from "react";
import {
  Provider,
  teamsTheme,
  Toolbar,
  ToolbarItem,
  ToolbarDivider,
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
  LinkIcon,
  TableIcon,
} from "@fluentui/react-icons-northstar";
import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuItemProps,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  PopoverProps,
} from "@fluentui/react-components";
import { Overflow } from "../react/Overflow";
import { useOverflowItem } from "../react/useOverflowItem";
import { useIsOverflowItemVisible } from "../react/useIsOverflowItemVisible";
import { useOverflowMenu } from "../react/useOverflowMenu";
import { useIsOverflowGroupVisible } from "../react/useIsOverflowGroupVisible";
import { useMergedRefs } from "@fluentui/react-utilities";
import {
  createContext,
  useContextSelector,
  ContextSelector,
} from "@fluentui/react-context-selector";

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
    <div style={{ resize: "horizontal", overflow: "auto" }}>
      <Overflow padding={30} ref={callbackRef}>
        <ToolbarContext.Provider value={{ ...state, dispatch, eventTarget }}>
          <Toolbar>
            <OverflowToolbarItem
              id="Bold"
              icon={<BoldIcon />}
              groupId="style"
            />
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
            <OverflowMenu />
          </Toolbar>
        </ToolbarContext.Provider>
      </Overflow>
    </div>
  );
}

interface OverflowToolbarItemProps {
  id: string;
  icon: React.ReactNode;
  groupId?: string;
  onClick?: (e: React.SyntheticEvent<HTMLElement>) => void;
}

const OverflowToolbarItem = React.forwardRef<
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

export const OverflowMenu: React.FC = (props) => {
  const { ref, isOverflowing } = useOverflowMenu<HTMLButtonElement>();
  const dispatch = useToolbarContext((v) => v.dispatch);
  const target = useToolbarContext((v) => v.target);
  const eventTarget = useToolbarContext((v) => v.eventTarget);
  const popperRef = React.useRef<PopperRefHandle | null>(null);

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
      <Menu positioning={{ popperRef }}>
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
          </MenuList>
        </MenuPopover>
      </Menu>
    </>
  );
};

const getIcon = (id: string) => {
  const map: Record<string, React.ReactElement> = {
    Bold: <BoldIcon />,
    Italic: <ItalicIcon />,
    Underline: <UnderlineIcon />,
    Outdent: <OutdentIcon />,
    Indent: <IndentIcon />,
    FontSize: <FontSizeIcon />,
    RemoveFormat: <RemoveFormatIcon />,
    Quote: <QuoteIcon />,
    Link: <LinkIcon />,
    CodeSnippet: <CodeSnippetIcon />,
    Table: <TableIcon />,
  };

  return map[id];
};

interface OverflowMenuItemProps extends Pick<MenuItemProps, "persistOnClick"> {
  id: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
}

const OverflowMenuItem = React.forwardRef<
  HTMLDivElement,
  OverflowMenuItemProps
>((props, ref) => {
  const { id, persistOnClick, onClick, ...rest } = props;
  const isVisible = useIsOverflowItemVisible(id);
  const onClickMenuItem = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e, id);
    },
    [id, onClick]
  );

  if (isVisible) {
    return null;
  }

  return (
    <MenuItem
      persistOnClick={!!persistOnClick}
      ref={ref}
      icon={getIcon(id)}
      onClick={onClickMenuItem}
      {...rest}
    >
      {id}
    </MenuItem>
  );
});

export const OverflowMenuDivider: React.FC<{
  groupId: string | number;
}> = (props) => {
  const isGroupVisible = useIsOverflowGroupVisible(props.groupId);

  if (isGroupVisible === "visible") {
    return null;
  }

  return <MenuDivider />;
};

const OverflowToolbarDivider: React.FC<{ groupId: string }> = ({ groupId }) => {
  const isGroupVisible = useIsOverflowGroupVisible(groupId);

  if (isGroupVisible === "hidden") {
    return null;
  }

  return <ToolbarDivider />;
};

const LinkOverflowItem: React.FC = () => {
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

const LinkOverflowMenuItem: React.FC = (props) => {
  const dispatch = useToolbarContext((v) => v.dispatch);
  const onClick = React.useCallback(() => {
    dispatch({ type: "Link", value: true });
  }, [dispatch]);
  return <OverflowMenuItem onClick={onClick} id="Link" />;
};

const TableOverflowItem: React.FC = () => {
  const isOverflowing = !useIsOverflowItemVisible("Table");
  let open = useToolbarContext((v) => v.table === "main");
  const dispatch = useToolbarContext((v) => v.dispatch);

  React.useEffect(() => {
    if (isOverflowing) {
      dispatch({ type: "Table", value: false });
    }
  }, [isOverflowing, dispatch]);

  const onOpenChange: PopoverProps["onOpenChange"] = (e, data) => {
    dispatch({ type: "Table", value: data.open ? "main" : false });
  };

  if (isOverflowing) {
    open = false;
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger>
        <OverflowToolbarItem id="Table" icon={<TableIcon />} />
      </PopoverTrigger>
      <PopoverSurface aria-label="add table">
        Add a table to the editor main
      </PopoverSurface>
    </Popover>
  );
};

const TableOverflowMenuItem: React.FC = () => {
  const isOverflowing = !useIsOverflowItemVisible("Table");
  const open = useToolbarContext((v) => v.table === "overflow");
  const dispatch = useToolbarContext((v) => v.dispatch);

  const onOpenChange: PopoverProps["onOpenChange"] = (e, data) => {
    dispatch({ type: "Table", value: data.open ? "overflow" : false });
  };

  React.useEffect(() => {
    if (!isOverflowing) {
      dispatch({ type: "Table", value: false });
    }
  }, [isOverflowing, dispatch]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger>
        <OverflowMenuItem persistOnClick id="Table" />
      </PopoverTrigger>
      <PopoverSurface aria-label="Add table">
        Add a table to the editor overflow
      </PopoverSurface>
    </Popover>
  );
};

export type ToolbarState = {
  link: boolean;
  table: false | "main" | "overflow";
  paragraph: boolean;
  target: HTMLButtonElement | null;
};

export type ToolbarAction =
  | { type: "Link"; value: boolean }
  | { type: "Table"; value: false | "main" | "overflow" }
  | { type: "Paragraph"; value: boolean }
  | { type: "Target"; value: HTMLButtonElement };

export const initialState: ToolbarState = {
  link: false,
  table: false,
  paragraph: false,
  target: null,
};

export function toolbarReducer(
  state: ToolbarState,
  action: ToolbarAction
): ToolbarState {
  switch (action.type) {
    case "Link":
      return { ...state, link: action.value };
    case "Table":
      return { ...state, table: action.value };

    case "Paragraph":
      return { ...state, paragraph: action.value };

    case "Target":
      return { ...state, target: action.value };

    default:
      throw new Error("unknown action in toolbar reducer");
  }
}

interface ToolbarContextValue extends ToolbarState {
  dispatch: React.Dispatch<ToolbarAction>;
  eventTarget: EventTarget | null;
}
const ToolbarContext = createContext<ToolbarContextValue>({
  link: false,
  table: false,
  paragraph: false,
  dispatch: () => null,
  target: null,
  eventTarget: null,
});

const useToolbarContext = <T,>(
  selector: ContextSelector<ToolbarContextValue, T>
) => useContextSelector(ToolbarContext, selector);
