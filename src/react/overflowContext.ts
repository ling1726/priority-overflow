import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import {
  OverflowGroupState,
  OverflowItemEntry,
} from "../native/overflowManager";

export interface OverflowContextValue {
  itemVisibility: Record<string, boolean>;
  groupVisibility: Record<string, OverflowGroupState>;
  hasOverflow: boolean;
  registerItem: (item: OverflowItemEntry) => () => void;
  updateOverflow: (padding?: number) => void;
}
export const OverflowContext = createContext<OverflowContextValue>({
  itemVisibility: {},
  groupVisibility: {},
  hasOverflow: false,
  registerItem: () => () => null,
  updateOverflow: () => null,
});

export const useOverflowContext = <SelectedValue>(
  selector: ContextSelector<OverflowContextValue, SelectedValue>
) => useContextSelector(OverflowContext, selector);
