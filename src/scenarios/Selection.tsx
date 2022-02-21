import React from "react";
import {
  Button,
  makeStyles,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  mergeClasses,
} from "@fluentui/react-components";
import { Overflow } from "../react/Overflow";
import { useOverflowItem } from "../react/useOverflowItem";
import { useIsOverflowItemVisible } from "../react/useIsOverflowItemVisible";
import { useOverflowMenu } from "../react/useOverflowMenu";

const useStyles = makeStyles({
  container: {
    textAlign: "center",
  },
});

function App() {
  const styles = useStyles();
  const [selected, setSelected] = React.useState<string | number>(0);

  const onSelect = (itemId: string | number) => {
    setSelected(itemId);
  };

  const itemIds = new Array(8).fill(0).map((_, i) => i);

  return (
    <div className={styles.container}>
      <h2>Selection - selected item is always visible</h2>
      <Overflow>
        {itemIds.map((_, i) => (
          <OverflowSelectionItem
            onSelect={onSelect}
            key={i}
            id={i}
            selected={selected === i}
          />
        ))}
        <OverflowMenu itemIds={itemIds} onSelect={onSelect} />
      </Overflow>
    </div>
  );
}

const useItemStyles = makeStyles({
  container: {
    display: "flex",
    paddingLeft: "2px",
    paddingRight: "2px",
  },

  selected: {
    backgroundColor: "#ffd1a3",
  },
});

const OverflowSelectionItem: React.FC<OverflowSelectionItemProps> = (props) => {
  const ref = useOverflowItem<HTMLDivElement>(
    props.id,
    props.selected ? 1000 : 0,
    props.groupId
  );
  const styles = useItemStyles();

  const onClick = () => {
    props.onSelect?.(props.id);
  };

  return (
    <div ref={ref} className={mergeClasses(styles.container)}>
      <Button
        className={mergeClasses(props.selected && styles.selected)}
        onClick={onClick}
      >
        Item {props.id}
      </Button>
      {props.children}
    </div>
  );
};

export interface OverflowSelectionItemProps {
  id: string | number;
  groupId?: string | number;
  priority?: number;
  onSelect?: (itemId: string | number) => void;
  selected?: boolean;
}

const OverflowMenu: React.FC<{
  itemIds: (string | number)[];
  onSelect: (itemId: string | number) => void;
}> = ({ itemIds, onSelect }) => {
  const { ref, overflowCount, isOverflowing } =
    useOverflowMenu<HTMLButtonElement>();

  if (!isOverflowing) {
    return null;
  }

  return (
    <Menu>
      <MenuTrigger>
        <Button ref={ref}>+{overflowCount} items</Button>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          {itemIds.map((i) => {
            const onClick = () => onSelect(i);
            return <OverflowMenuItem onClick={onClick} key={i} id={i} />;
          })}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

const OverflowMenuItem: React.FC<{
  id: string | number;
  onClick?: () => void;
}> = (props) => {
  const isVisible = useIsOverflowItemVisible(props.id);

  if (isVisible) {
    return null;
  }

  return <MenuItem onClick={props.onClick}>Item {props.id}</MenuItem>;
};

export default App;
