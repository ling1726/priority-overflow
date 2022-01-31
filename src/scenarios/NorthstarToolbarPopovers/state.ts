import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";

export type ToolbarState = {
  link: boolean;
  table: boolean;
  paragraph: boolean;
  target: HTMLButtonElement | null;
  overflowMenu: boolean;
};

export type ToolbarAction =
  | { type: "Link"; value: boolean }
  | { type: "Table"; value: boolean }
  | { type: "Paragraph"; value: boolean }
  | { type: "Target"; value: HTMLButtonElement }
  | { type: "OverflowMenuOpen" }
  | { type: "OverflowMenuClose" };

export const initialState: ToolbarState = {
  link: false,
  table: false,
  paragraph: false,
  target: null,
  overflowMenu: false,
};

export function toolbarReducer(
  state: ToolbarState,
  action: ToolbarAction
): ToolbarState {
  switch (action.type) {
    case "Link":
      return { ...state, link: action.value };
    case "Table":
      return { ...state, table: action.value };

    case "Paragraph":
      return { ...state, paragraph: action.value };

    case "Target":
      return { ...state, target: action.value };

    case "OverflowMenuOpen":
      return { ...state, overflowMenu: true };

    // overflow menu closing needs to close all of its submenus
    case "OverflowMenuClose":
      return { ...state, overflowMenu: false, paragraph: false, table: false };

    default:
      throw new Error("unknown action in toolbar reducer");
  }
}

export interface ToolbarContextValue extends ToolbarState {
  dispatch: React.Dispatch<ToolbarAction>;
  eventTarget: EventTarget | null;
}
export const ToolbarContext = createContext<ToolbarContextValue>({
  link: false,
  table: false,
  paragraph: false,
  dispatch: () => null,
  target: null,
  eventTarget: null,
  overflowMenu: false,
});

export const useToolbarContext = <T>(
  selector: ContextSelector<ToolbarContextValue, T>
) => useContextSelector(ToolbarContext, selector);
