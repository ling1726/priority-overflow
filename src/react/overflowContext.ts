import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { OverflowItemEntry } from "../native/overflowManager";

export interface OverflowContextValue {
  itemVisibility: Record<string, boolean>;
  hasOverflow: boolean;
  registerItem: (item: OverflowItemEntry) => void;
  deregisterItem: (itemId: string | number) => void;
  updateOverflow: () => void;
}
export const OverflowContext = createContext<OverflowContextValue>({
  itemVisibility: {},
  hasOverflow: false,
  registerItem: () => null,
  deregisterItem: () => null,
  updateOverflow: () => null,
});

export const useOverflowContext = <SelectedValue>(
  selector: ContextSelector<OverflowContextValue, SelectedValue>
) => useContextSelector(OverflowContext, selector);
