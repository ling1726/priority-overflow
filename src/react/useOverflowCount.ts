import { useOverflowContext } from "./overflowContext";

export const useOverflowCount = () =>
  useOverflowContext((v) => {
    return Object.entries(v.itemVisibility).reduce((acc, cur) => {
      if (!cur[0].startsWith("divider") && !cur[1]) {
        acc++;
      }

      return acc;
    }, 0);
  });
