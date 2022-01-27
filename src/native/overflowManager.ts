import debounce from "./debounce";
import { PriorityQueue } from "./priorityQueue";

export type OverflowDirection = "start" | "end";
export type OverflowAxis = "horizontal" | "vertical";
export type OverflowGroupState = "visible" | "hidden" | "overflow";
/** Indicates that this item can be overflowed */
export const OVERFLOW_ITEM_DATA = "data-overflow-item";
export const OVERFLOW_ITEM_INVISIBLE = "data-overflow-invisible";
/** Indicates that this element is only visible when there is overflow */
export const OVERFLOW_ONLY_ITEM = "data-overflow-only";
export interface OverflowItemEntry {
  /**
   * HTML element that will be disappear when overflowed
   */
  element: HTMLElement;
  /**
   * Lower priority items are invisible first when the container is overflowed
   * @default 0
   */
  priority: number;
  /**
   * Specific id, used to track visibility and provide updates to consumers
   */
  id: string;

  groupId?: string;
}

/**
 * signature similar to standard event listeners, but typed to handle the custom event
 */
export type OnUpdateOverflow = (data: OverflowEventPayload) => void;

/**
 * Payload of the custom DOM event for overflow updates
 */
export interface OverflowEventPayload {
  visibleItems: OverflowItemEntry[];
  invisibleItems: OverflowItemEntry[];
  groupVisibility: Record<string, OverflowGroupState>;
}

export interface ObserveOptions {
  /**
   * Padding (in px) at the end of the container before overflow occurs
   * Useful to account for extra elements (i.e. dropdown menu)
   * or to account for any kinds of margins between items which are hard to measure with JS
   * @default 10
   */
  padding?: number;
  /**
   * Direction where items are removed when overflow occurs
   * @default end
   */
  overflowDirection?: OverflowDirection;

  /**
   * Horizontal or vertical overflow
   * @default horizontal
   */
  overflowAxis?: OverflowAxis;

  /**
   * The minimum number of visible items
   */
  minimumVisible?: number;
}

export class OverflowManager {
  /**
   * Called each time the item visibility is updated due to overflow
   */
  private onUpdateOverflow?: (data: OverflowEventPayload) => void;
  /**
   * Contains all overflow items
   */
  private container?: HTMLElement;
  private overflowDirection: NonNullable<ObserveOptions["overflowDirection"]> =
    "end";
  private overflowAxis: NonNullable<ObserveOptions["overflowAxis"]> =
    "horizontal";
  private padding: NonNullable<ObserveOptions["padding"]> = 10;
  /**
   * Priority queue of visible items to overflow
   */
  private visibleItemQueue: PriorityQueue<string>;
  /**
   * Priority queue of invisible items to display when there is space
   */
  private invisibleItemQueue: PriorityQueue<string>;
  /**
   * Collection of all managed overflow items
   */
  private overflowItems: Record<string, OverflowItemEntry> = {};

  private overflowGroups: Record<
    string,
    { visibleItemIds: Set<string>; invisibleItemIds: Set<string> }
  > = {};
  /**
   * Watches for changes to container size
   */
  private resizeObserver: ResizeObserver;

  private minimumVisible: NonNullable<ObserveOptions["minimumVisible"]> = 0;

  constructor(onUpdateOverflow: OnUpdateOverflow) {
    this.visibleItemQueue = this.initVisibleItemQueue();
    this.invisibleItemQueue = this.initInvisibleItemQueue();
    this.resizeObserver = this.initResizeObserver();
    this.onUpdateOverflow = onUpdateOverflow;
  }

  /**
   * Start observing container size and child elements and manages overflow item visiblity
   */
  public observe(container: HTMLElement, options: ObserveOptions = {}) {
    const { padding, overflowAxis, overflowDirection, minimumVisible } =
      options;
    this.container = container;
    this.padding = padding ?? this.padding;
    this.minimumVisible = minimumVisible ?? this.minimumVisible;
    this.overflowDirection = overflowDirection ?? this.overflowDirection;
    this.overflowAxis = overflowAxis ?? this.overflowAxis;

    this.dispatchOverflowUpdate();
    this.resizeObserver.observe(this.container);
  }

  /**
   * Stops observing container size and child elements
   */
  public disconnect() {
    this.resizeObserver.disconnect();
  }

  /**
   * Adds a new item to manage
   * @param items - New item to manage
   */
  public addItems(...items: OverflowItemEntry[]) {
    items.forEach((item) => {
      item.element.setAttribute(OVERFLOW_ITEM_DATA, item.id);
      this.overflowItems[item.id] = item;
      this.visibleItemQueue.enqueue(item.id);

      if (item.groupId) {
        if (!this.overflowGroups[item.groupId]) {
          this.overflowGroups[item.groupId] = {
            visibleItemIds: new Set<string>(),
            invisibleItemIds: new Set<string>(),
          };
        }

        this.overflowGroups[item.groupId].visibleItemIds.add(item.id);
      }
    });

    this.updateOverflow();
  }

  /**
   * Removes item from the overflow manager.
   * Should be called when element is removed from DOM.
   * @param itemId
   */
  public removeItem(itemId: string) {
    const item = this.overflowItems[itemId];
    item.element.removeAttribute(OVERFLOW_ITEM_DATA);
    this.visibleItemQueue.remove(itemId);
    this.invisibleItemQueue.remove(itemId);

    item.element.style.display = "";
    item.element.removeAttribute(OVERFLOW_ITEM_INVISIBLE);

    if (item.groupId) {
      this.overflowGroups[item.groupId].visibleItemIds.delete(item.id);
      this.overflowGroups[item.groupId].invisibleItemIds.delete(item.id);
    }

    delete this.overflowItems[itemId];
    this.updateOverflow();
  }

  /**
   * Manually runs the overflow calculation that is async and debounced.
   * Useful when new elements are inserted into the container after the overflow update
   * i.e. extra dividers or menus
   */
  public updateOverflow = debounce(
    () =>
      new Promise<void>((resolve) => {
        this.forceUpdate();
        resolve();
      })
  );

  /**
   * Manually runs the overflow calculation sync
   */
  public forceUpdate = () => {
    if (!this.container) {
      return;
    }

    this.processOverflowItems(
      this.getOffsetSize(this.container) - this.padding
    );
  };

  private initResizeObserver() {
    return new ResizeObserver((entries) => {
      if (!entries[0] || !this.container) {
        return;
      }

      const dimension =
        this.overflowAxis === "horizontal" ? "inlineSize" : "blockSize";

      const availableSize =
        entries[0].contentBoxSize[0][dimension] - this.padding;
      this.processOverflowItems(availableSize);
    });
  }

  private getOffsetSize(el: HTMLElement) {
    return this.overflowAxis === "horizontal"
      ? el.offsetWidth
      : el.offsetHeight;
  }

  private processOverflowItems(availableSize: number) {
    if (!this.container) {
      return;
    }

    // Snapshot of the visible/invisible state to compare for updates
    const visibleTop = this.visibleItemQueue.peek();
    const invisibleTop = this.invisibleItemQueue.peek();

    const children = this.container.querySelectorAll(`[${OVERFLOW_ITEM_DATA}]`);
    let currentWidth = 0;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (
        child instanceof HTMLElement &&
        !child.hasAttribute(OVERFLOW_ITEM_INVISIBLE)
      ) {
        currentWidth += this.getOffsetSize(child);
      }
    }

    const overflowOnlyItems = document.querySelectorAll(
      `[${OVERFLOW_ONLY_ITEM}]`
    );
    for (let i = 0; i < overflowOnlyItems.length; i++) {
      const overflowOnlyItem = overflowOnlyItems[i];
      if (overflowOnlyItem instanceof HTMLElement) {
        currentWidth += this.getOffsetSize(overflowOnlyItem);
      }
    }

    // Add items until available width is filled
    while (currentWidth < availableSize && this.invisibleItemQueue.size > 0) {
      currentWidth += this.makeItemVisible();
    }

    // Remove items until there's no more overlap
    while (currentWidth > availableSize && this.visibleItemQueue.size > 0) {
      if (this.visibleItemQueue.size === this.minimumVisible) {
        break;
      }
      currentWidth -= this.makeItemInvisible();
    }

    // Make sure that any overflow only items (i.e. dropdown menus) can actually be removed
    if (this.invisibleItemQueue.size === 1) {
      for (let i = 0; i < overflowOnlyItems.length; i++) {
        const overflowOnlyItem = overflowOnlyItems[i];
        if (overflowOnlyItem instanceof HTMLElement) {
          currentWidth -= this.getOffsetSize(overflowOnlyItem);
        }
      }

      currentWidth += this.makeItemVisible();

      if (currentWidth > availableSize) {
        this.makeItemInvisible();
      }
    }

    // only update when the state of visible/invisible items has changed
    if (
      this.visibleItemQueue.peek() !== visibleTop ||
      this.invisibleItemQueue.peek() !== invisibleTop
    ) {
      this.dispatchOverflowUpdate();
    }
  }

  private makeItemVisible() {
    const nextVisible = this.invisibleItemQueue.dequeue();
    this.visibleItemQueue.enqueue(nextVisible);

    const item = this.overflowItems[nextVisible];
    item.element.style.display = ""; // TODO remove this and apply through css in scenarios
    item.element.removeAttribute(OVERFLOW_ITEM_INVISIBLE);
    if (item.groupId) {
      this.overflowGroups[item.groupId].invisibleItemIds.delete(item.id);
      this.overflowGroups[item.groupId].visibleItemIds.add(item.id);
    }

    return this.getOffsetSize(item.element);
  }

  private makeItemInvisible() {
    const nextInvisible = this.visibleItemQueue.dequeue();
    this.invisibleItemQueue.enqueue(nextInvisible);

    const item = this.overflowItems[nextInvisible];
    const width = this.getOffsetSize(item.element);
    item.element.style.display = "none"; // TODO remove this and apply through css in scenarios
    item.element.setAttribute(OVERFLOW_ITEM_INVISIBLE, "");
    if (item.groupId) {
      this.overflowGroups[item.groupId].visibleItemIds.delete(item.id);
      this.overflowGroups[item.groupId].invisibleItemIds.add(item.id);
    }

    return width;
  }

  private dispatchOverflowUpdate() {
    const visibleItemIds = this.visibleItemQueue.all();
    const invisibleItemIds = this.invisibleItemQueue.all();

    const visibleItems = visibleItemIds.map(
      (itemId) => this.overflowItems[itemId]
    );
    const invisibleItems = invisibleItemIds.map(
      (itemId) => this.overflowItems[itemId]
    );

    const groupVisibility: Record<string, OverflowGroupState> = {};
    Object.entries(this.overflowGroups).forEach((entry) => {
      const groupId = entry[0];
      if (entry[1].invisibleItemIds.size && entry[1].visibleItemIds.size) {
        groupVisibility[groupId] = "overflow";
      } else if (entry[1].visibleItemIds.size === 0) {
        groupVisibility[groupId] = "hidden";
      } else {
        groupVisibility[groupId] = "visible";
      }
    });

    this.onUpdateOverflow?.({ visibleItems, invisibleItems, groupVisibility });
  }

  private initInvisibleItemQueue() {
    return new PriorityQueue<string>((a, b) => {
      const itemA = this.overflowItems[a];
      const itemB = this.overflowItems[b];
      // Higher priority at the top of the queue
      const priority = itemB.priority - itemA.priority;
      if (priority !== 0) {
        return priority;
      }

      const positionStatusBit =
        this.overflowDirection === "end"
          ? Node.DOCUMENT_POSITION_FOLLOWING
          : Node.DOCUMENT_POSITION_PRECEDING;

      // equal priority, use DOM order
      if (
        itemA.element.compareDocumentPosition(itemB.element) & positionStatusBit
      ) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  private initVisibleItemQueue() {
    return new PriorityQueue<string>((a, b) => {
      const itemA = this.overflowItems[a];
      const itemB = this.overflowItems[b];
      // Lower priority at the top of the queue
      const priority = itemA.priority - itemB.priority;

      if (priority !== 0) {
        return priority;
      }

      const positionStatusBit =
        this.overflowDirection === "end"
          ? Node.DOCUMENT_POSITION_PRECEDING
          : Node.DOCUMENT_POSITION_FOLLOWING;

      // equal priority, use DOM order
      if (
        itemA.element.compareDocumentPosition(itemB.element) & positionStatusBit
      ) {
        return -1;
      } else {
        return 1;
      }
    });
  }
}
