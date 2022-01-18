import { useOverflowContext } from "./overflowContext";

export function useIsOverflowItemVisible(id: string | number) {
  return !!useOverflowContext((ctx) => ctx.itemVisibility[id]);
}
