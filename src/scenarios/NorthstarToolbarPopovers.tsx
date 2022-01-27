import * as React from "react";
import {
  Provider,
  teamsTheme,
  Toolbar,
  ToolbarItem,
  ToolbarDivider,
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
  PopoverProps,
  PopoverSurface,
  PopoverTrigger,
} from "@fluentui/react-components";
import { Overflow } from "../react/Overflow";
import { useOverflowItem } from "../react/useOverflowItem";
import { useIsOverflowItemVisible } from "../react/useIsOverflowItemVisible";
import { useOverflowMenu } from "../react/useOverflowMenu";
import { useIsOverflowGroupVisible } from "../react/useIsOverflowGroupVisible";
import { useMergedRefs } from "@fluentui/react-utilities";

export default function App() {
  return (
    <Provider theme={teamsTheme}>
      <Example />
    </Provider>
  );
}

function Example() {
  return (
    <div style={{ resize: "horizontal", overflow: "auto" }}>
      <Overflow padding={30}>
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
          <OverflowMenu />
        </Toolbar>
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

export const OverflowMenu: React.FC = () => {
  const [target, setTarget] = React.useState<HTMLButtonElement>(() =>
    document.createElement("button")
  );
  const { ref, isOverflowing } = useOverflowMenu<HTMLButtonElement>();
  const mergedRef = useMergedRefs(
    ref,
    setTarget as React.Ref<HTMLButtonElement>
  );
  if (!isOverflowing) {
    return null;
  }

  return (
    <>
      <Menu>
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
}

const OverflowMenuItem = React.forwardRef<
  HTMLDivElement,
  OverflowMenuItemProps
>((props, ref) => {
  const { id, persistOnClick, ...rest } = props;
  const isVisible = useIsOverflowItemVisible(id);

  if (isVisible) {
    return null;
  }

  return (
    <MenuItem
      persistOnClick={!!persistOnClick}
      ref={ref}
      icon={getIcon(id)}
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
  return (
    <Popover>
      <PopoverTrigger>
        <OverflowToolbarItem id="Link" icon={<LinkIcon />} />
      </PopoverTrigger>
      <PopoverSurface aria-label="Add link">
        Add a link to the editor
      </PopoverSurface>
    </Popover>
  );
};

const LinkOverflowMenuItem: React.FC = () => {
  return <OverflowMenuItem id="Link" />;
};

const TableOverflowItem: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <OverflowToolbarItem id="Table" icon={<TableIcon />} />
      </PopoverTrigger>
      <PopoverSurface aria-label="add table">
        Add a link to the editor
      </PopoverSurface>
    </Popover>
  );
};

const TableOverflowMenuItem: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <OverflowMenuItem persistOnClick id="Table" />
      </PopoverTrigger>
      <PopoverSurface aria-label="Add table">
        Add a link to the editor
      </PopoverSurface>
    </Popover>
  );
};

export type ToolbarState = {
  link: boolean;
  table: boolean;
};

export type ToolbarAction =
  | { type: "Link"; value: boolean }
  | { type: "Table"; value: boolean };

export const initialState: ToolbarState = {
  link: false,
  table: false,
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
    default:
      throw new Error("unknown action in toolbar reducer");
  }
}
