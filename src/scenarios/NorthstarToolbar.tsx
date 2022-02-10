import * as React from "react";
import {
  Provider,
  teamsTheme,
  Toolbar,
  ToolbarItem,
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
} from "@fluentui/react-icons-northstar";
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@fluentui/react-components";
import { Overflow } from "../react/Overflow";
import { useOverflowItem } from "../react/useOverflowItem";
import { useIsOverflowItemVisible } from "../react/useIsOverflowItemVisible";
import { useOverflowMenu } from "../react/useOverflowMenu";

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

const getIcon = () => {
  return iconSet[Math.floor(Math.random() * iconSet.length)];
};

function Example() {
  const itemIds = new Array(20).fill(0).map((_, i) => i + "");
  return (
    <Overflow>
      <Toolbar>
        {itemIds.map((id) => {
          const Icon = getIcon();

          return <OverflowToolbarItem id={id} icon={<Icon />} />;
        })}
        <OverflowMenu itemIds={itemIds} />
      </Toolbar>
    </Overflow>
  );
}

const OverflowToolbarItem: React.FC<{ id: string; icon: React.ReactNode }> = ({
  id,
  icon,
}) => {
  const ref = useOverflowItem<HTMLButtonElement>(id);

  return <ToolbarItem ref={ref} icon={icon} />;
};

const OverflowMenu: React.FC<{ itemIds: string[] }> = ({ itemIds }) => {
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
          {itemIds.map((id) => (
            <OverflowMenuItem id={id} />
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

const OverflowMenuItem: React.FC<{ id: string }> = ({ id }) => {
  const isVisible = useIsOverflowItemVisible(id);

  if (isVisible) {
    return null;
  }

  return <MenuItem>Item {id}</MenuItem>;
};
