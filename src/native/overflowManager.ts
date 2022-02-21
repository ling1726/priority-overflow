import debounce from "./debounce";
import { PriorityQueue } from "./priorityQueue";

export type OverflowDirection = "start" | "end";
export type OverflowAxis = "horizontal" | "vertical";
export type OverflowGroupState = "visible" | "hidden" | "overflow";
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

export type OnUpdateItemVisibility = (
  data: OnUpdateItemVisibilityPayload
) => void;

/**
 * Payload of the custom DOM event for overflow updates
 */
export interface OverflowEventPayload {
  visibleItems: OverflowItemEntry[];
  invisibleItems: OverflowItemEntry[];
  groupVisibility: Record<string, OverflowGroupState>;
}

export interface OnUpdateItemVisibilityPayload {
  item: OverflowItemEntry;
  visible: boolean;
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

  /**
   * Callback when item visibility is updated
   */
  onUpdateItemVisibility?: OnUpdateItemVisibility;
}

export class OverflowManager {
  private onUpdateItemVisiblity: NonNullable<
    ObserveOptions["onUpdateItemVisibility"]
  > = () => null;
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
    const {
      padding,
      overflowAxis,
      overflowDirection,
      minimumVisible,
      onUpdateItemVisibility,
    } = options;

    this.container = container;
    this.padding = padding ?? this.padding;
    this.minimumVisible = minimumVisible ?? this.minimumVisible;
    this.overflowDirection = overflowDirection ?? this.overflowDirection;
    this.overflowAxis = overflowAxis ?? this.overflowAxis;
    this.onUpdateItemVisiblity =
      onUpdateItemVisibility ?? this.onUpdateItemVisiblity;
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
    this.visibleItemQueue.remove(itemId);
    this.invisibleItemQueue.remove(itemId);

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
  public updateOverflow = debounce(() => this.forceUpdate());

  /**
   * Manually runs the overflow calculation sync
   */
  public forceUpdate = () => {
    if (!this.container) {
      return;
    }

    const availableSize = this.getOffsetSize(this.container) - this.padding;
    this.processOverflowItems(availableSize);
  };

  private initResizeObserver() {
    return new ResizeObserver((entries) => {
      if (!entries[0] || !this.container) {
        return;
      }

      this.updateOverflow();
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

    const visibleItemIds = this.visibleItemQueue.all();
    let currentWidth = visibleItemIds.reduce((sum, visibleItemId) => {
      const child = this.overflowItems[visibleItemId].element;
      return sum + this.getOffsetSize(child);
    }, 0);

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
    this.onUpdateItemVisiblity({ item, visible: true });
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
    this.onUpdateItemVisiblity({ item, visible: false });
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
