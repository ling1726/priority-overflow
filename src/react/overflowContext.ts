import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";

export interface OverflowContextValue {
  itemVisibility: Record<string, boolean>;
  hasOverflow: boolean;
}
export const OverflowContext = createContext<OverflowContextValue>({
  itemVisibility: {},
  hasOverflow: false,
});

export const useOverflowContext = <SelectedValue>(
  selector: ContextSelector<OverflowContextValue, SelectedValue>
) => useContextSelector(OverflowContext, selector);
