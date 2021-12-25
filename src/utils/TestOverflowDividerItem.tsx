import { makeStyles } from "@fluentui/react-components";
import { useOverflowContext } from "../react/overflowContext";
import { TestOverflowItem, TestOverflowItemProps } from "./TestOverflowItem";

const useStyles = makeStyles({
  divider: {
    width: "1px",
    backgroundColor: "red",
    marginLeft: "4px",
    marginRight: "4px",
  },
});

export const TestOverflowDividerItem: React.FC<TestOverflowItemProps> = (
  props
) => {
  const styles = useStyles();
  const isVisible = useOverflowContext((v) => {
    return v.itemVisibility[props.id];
  });

  return (
    <>
      <TestOverflowItem {...props}>
        {isVisible && <div className={styles.divider} />}
      </TestOverflowItem>
    </>
  );
};
