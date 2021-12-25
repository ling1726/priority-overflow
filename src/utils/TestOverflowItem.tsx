import { Button } from "@fluentui/react-components";
import * as React from "react";
import { useOverflowItem } from "../react/useOverflowItem";
export const TestOverflowItem: React.FC<{
  id: string | number;
  priority?: number;
}> = (props) => {
  const ref = useOverflowItem<HTMLButtonElement>(props.id, props.priority);

  return <Button ref={ref}>Item {props.id}</Button>;
};
