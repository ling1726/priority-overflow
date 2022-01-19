import React from "react";
import {
  Button,
  makeStyles,
  Menu,
  MenuDivider,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@fluentui/react-components";
import { TestOverflowItem } from "../utils/TestOverflowItem";
import { Overflow } from "../react/Overflow";
import { useIsOverflowGroupVisible } from "../react/useIsOverflowGroupVisible";
import { useOverflowMenu } from "../react/useOverflowMenu";
import { TestOverflowMenuItem } from "../utils/TestOverflowMenuItem";

const useStyles = makeStyles({
  container: {
    textAlign: "center",
  },
});

function App() {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <h2>Rendering dividers with groups with priority</h2>
      <Overflow overflowDirection="start" padding={30}>
        <TestOverflowItem id={6} priority={6} groupId={1} />
        <TestOverflowGroupDivider groupId={1} />
        <TestOverflowItem id={7} priority={7} groupId={2} />
        <TestOverflowGroupDivider groupId={2} />
        <TestOverflowItem id={4} priority={4} groupId={3} />
        <TestOverflowItem id={5} priority={5} groupId={3} />
        <TestOverflowGroupDivider groupId={3} />
        <TestOverflowItem id={1} priority={1} groupId={4} />
        <TestOverflowItem id={2} priority={2} groupId={4} />
        <TestOverflowItem id={3} priority={3} groupId={4} />
        <TestOverflowGroupDivider groupId={4} />
        <TestOverflowItem id={8} priority={8} groupId={5} />
        <OverflowMenu
          itemIds={[
            6,
            "divider-1",
            7,
            "divider-2",
            4,
            5,
            "divider-3",
            1,
            2,
            3,
            "divider-4",
            8,
          ]}
        />
      </Overflow>
    </div>
  );
}

const useDividerStyles = makeStyles({
  outer: {
    paddingLeft: "4px",
    paddingRight: "4px",
  },

  inner: {
    width: "1px",
    backgroundColor: "red",
    height: "100%",
  },
});

export const TestOverflowGroupDivider: React.FC<TestOverflowItemProps> = (
  props
) => {
  const styles = useDividerStyles();
  const isGroupVisible = useIsOverflowGroupVisible(props.groupId);

  if (isGroupVisible === "hidden") {
    return null;
  }

  return (
    <div className={styles.outer}>
      <div className={styles.inner} />
    </div>
  );
};

export const OverflowMenu: React.FC<{ itemIds: (string | number)[] }> = ({
  itemIds,
}) => {
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
            if (typeof i === "string" && i.startsWith("divider")) {
              const groupId = i.split("-")[1];
              return <TestOverflowMenuDivider key={i} id={groupId} />;
            }
            return <TestOverflowMenuItem key={i} id={i} />;
          })}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export const TestOverflowMenuDivider: React.FC<{
  id: string | number;
}> = (props) => {
  const isGroupVisible = useIsOverflowGroupVisible(props.id);

  if (isGroupVisible === "visible") {
    return null;
  }

  return <MenuDivider />;
};

export interface TestOverflowItemProps {
  priority?: number;
  groupId: string | number;
}

export default App;
