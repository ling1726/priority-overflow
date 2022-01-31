import * as React from "react";
import { MenuItem, MenuItemProps } from "@fluentui/react-components";
import { useIsOverflowItemVisible } from "../../react/useIsOverflowItemVisible";
import {
  BoldIcon,
  CodeSnippetIcon,
  FontSizeIcon,
  IndentIcon,
  ItalicIcon,
  LinkIcon,
  OutdentIcon,
  QuoteIcon,
  RemoveFormatIcon,
  TableIcon,
  UnderlineIcon,
} from "@fluentui/react-northstar";

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

export const OverflowMenuItem = React.forwardRef<
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

export interface OverflowMenuItemProps
  extends Pick<MenuItemProps, "persistOnClick"> {
  id: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
}
