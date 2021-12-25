import { Button } from "@fluentui/react-components";
import * as React from "react";
import { useOverflowItem } from "../react/useOverflowItem";
export const TestOverflowItem: React.FC<TestOverflowItemProps> = (props) => {
  const ref = useOverflowItem<HTMLButtonElement>(props.id, props.priority);

  return <Button ref={ref}>Item {props.id}</Button>;
};

export interface TestOverflowItemProps {
  id: string | number;
  priority?: number;
}
