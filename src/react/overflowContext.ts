import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { OverflowItemEntry } from "../native/overflowManager";

export interface OverflowContextValue {
  itemVisibility: Record<string, boolean>;
  hasOverflow: boolean;
  registerItem: (item: OverflowItemEntry) => () => void;
  updateOverflow: (padding?: number) => void;
}
export const OverflowContext = createContext<OverflowContextValue>({
  itemVisibility: {},
  hasOverflow: false,
  registerItem: () => () => null,
  updateOverflow: () => null,
});

export const useOverflowContext = <SelectedValue>(
  selector: ContextSelector<OverflowContextValue, SelectedValue>
) => useContextSelector(OverflowContext, selector);
