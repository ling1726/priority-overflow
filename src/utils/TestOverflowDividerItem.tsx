import { makeStyles } from "@fluentui/react-components";
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

  return (
    <>
      <TestOverflowItem {...props}>
        {<div className={styles.divider} />}
      </TestOverflowItem>
    </>
  );
};
