import * as React from "react";
import { OVERFLOW_ONLY_ITEM } from "../native/overflowManager";
import { useOverflowContext } from "./overflowContext";
import { useOverflowCount } from "./useOverflowCount";

export function useOverflowMenu<TElement extends HTMLElement>() {
  const overflowCount = useOverflowCount();
  const updateOverflow = useOverflowContext((v) => v.updateOverflow);
  const ref = React.useRef<TElement>(null);
  const isOverflowing = overflowCount > 0;

  React.useEffect(() => {
    if (ref.current) {
      ref.current.setAttribute(OVERFLOW_ONLY_ITEM, "");
    }
  }, [isOverflowing]);

  React.useEffect(() => {
    if (isOverflowing) {
      updateOverflow(ref.current?.offsetWidth);
    } else {
      updateOverflow(0);
    }
  }, [isOverflowing, updateOverflow, ref]);

  return { ref, overflowCount, isOverflowing };
}
