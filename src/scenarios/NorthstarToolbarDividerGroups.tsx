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
} from "@fluentui/react-icons-northstar";
import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@fluentui/react-components";
import { Overflow } from "../react/Overflow";
import { useOverflowItem } from "../react/useOverflowItem";
import { useIsOverflowItemVisible } from "../react/useIsOverflowItemVisible";
import { useOverflowMenu } from "../react/useOverflowMenu";
import { useIsOverflowGroupVisible } from "../react/useIsOverflowGroupVisible";

export default function App() {
  return (
    <Provider theme={teamsTheme}>
      <Example />
    </Provider>
  );
}

const iconSet = [
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  FontSizeIcon,
  RemoveFormatIcon,
  OutdentIcon,
  IndentIcon,
];

function Example() {
  return (
    <div style={{ resize: "horizontal", overflow: "auto" }}>
      <Overflow overflowDirection="start" padding={30}>
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
          <OverflowToolbarItem id="Link" icon={<LinkIcon />} />
          <OverflowToolbarItem id="CodeSnippet" icon={<CodeSnippetIcon />} />
          <OverflowMenu />
        </Toolbar>
      </Overflow>
    </div>
  );
}

const OverflowToolbarItem: React.FC<{
  id: string;
  icon: React.ReactNode;
  groupId?: string;
}> = ({ id, icon, groupId }) => {
  const ref = useOverflowItem<HTMLButtonElement>(id, undefined, groupId);

  return <ToolbarItem ref={ref} icon={icon} />;
};

export const OverflowMenu: React.FC = () => {
  const { ref, isOverflowing } = useOverflowMenu<HTMLButtonElement>();

  if (!isOverflowing) {
    return null;
  }

  return (
    <Menu>
      <MenuTrigger>
        <ToolbarItem ref={ref} icon={<MoreIcon />} />
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
          <OverflowMenuItem id="Link" />
          <OverflowMenuItem id="CodeSnippet" />
        </MenuList>
      </MenuPopover>
    </Menu>
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
  };

  return map[id];
};

const OverflowMenuItem: React.FC<{ id: string }> = ({ id }) => {
  const isVisible = useIsOverflowItemVisible(id);

  if (isVisible) {
    return null;
  }

  return <MenuItem icon={getIcon(id)}>{id}</MenuItem>;
};

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
