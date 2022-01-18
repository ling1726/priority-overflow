import { useOverflowContext } from "./overflowContext";

export function useIsOverflowGroupVisible(id: string | number) {
  return !!useOverflowContext((ctx) => ctx.groupVisibility[id]);
}
