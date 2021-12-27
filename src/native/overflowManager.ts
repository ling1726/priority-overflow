import { PriorityQueue } from "./priorityQueue";

export type OverflowDirection = "start" | "end";
export const OVERFLOW_ITEM_DATA = "data-overflow-item";
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
}

export interface ObserveOptions {
  /**
   * Padding at the end of the container before overflow occurs
   * @default 30
   */
  padding?: number;
  /**
   * Direction where items are removed when overflow occurs
   * @default end
   */
  overflowDirection?: OverflowDirection;
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
  private padding: NonNullable<ObserveOptions["padding"]> = 30;
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
  /**
   * Used to subscribe to item visibility updates
   */
  private eventTarget: EventTarget = new EventTarget();
  /**
   * Watches for changes to container size
   */
  private resizeObserver: ResizeObserver;
  /**
   * Watches for when the sentinel is no longer visible
   */
  // private intersectionObserver: IntersectionObserver;

  constructor(update: OnUpdateOverflow) {
    this.visibleItemQueue = this.initVisibleItemQueue();
    this.invisibleItemQueue = this.initInvisibleItemQueue();
    this.resizeObserver = this.initResizeObserver();
    this.onUpdateOverflow = update;
  }

  /**
   * Start observing container size and child elements and manages overflow item visiblity
   */
  public observe(container: HTMLElement, options: ObserveOptions = {}) {
    const { padding = 30, overflowDirection = "end" } = options;
    this.container = container;
    this.padding = padding;
    this.overflowDirection = overflowDirection;

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
    });
  }

  /**
   * Removes item from the overflow manager.
   * Should be called when element is removed from DOM.
   * @param itemId
   */
  public removeItem(itemId: string) {
    this.overflowItems[itemId].element.removeAttribute(OVERFLOW_ITEM_DATA);
    delete this.overflowItems[itemId];
    this.visibleItemQueue.remove(itemId);
    this.invisibleItemQueue.remove(itemId);
  }

  /**
   * Manually runs the overflow calculation.
   * Useful when new elements are inserted into the container after the overflow update
   * i.e. extra dividers or menus
   */
  public updateOverflow() {
    if (!this.container) {
      return;
    }
    this.processOverflowItems(this.container.offsetWidth - this.padding);
  }

  private initResizeObserver() {
    return new ResizeObserver((entries) => {
      if (!entries[0] || !this.container) {
        return;
      }

      const availableWidth =
        entries[0].contentBoxSize[0].inlineSize - this.padding;
      this.processOverflowItems(availableWidth);
    });
  }

  private processOverflowItems(availableWidth: number) {
    if (!this.container) {
      return;
    }
    // Snapshot of the visible/invisible state to compare for updates
    const visibleTop = this.visibleItemQueue.peek();
    const invisibleTop = this.invisibleItemQueue.peek();

    const children = this.container.children;
    let currentWidth = 0;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      if (!isNaN(child.offsetWidth)) {
        currentWidth += child.offsetWidth;
      }
    }

    // Add items until available width is filled
    while (currentWidth < availableWidth && this.invisibleItemQueue.size > 0) {
      const nextvisible = this.invisibleItemQueue.dequeue();
      this.visibleItemQueue.enqueue(nextvisible);

      const nextVisibleElement = this.overflowItems[nextvisible].element;
      nextVisibleElement.style.display = "";
      currentWidth += nextVisibleElement.offsetWidth;
    }

    // Remove items until there's no more overlap
    while (currentWidth > availableWidth && this.visibleItemQueue.size > 0) {
      const nextInvisible = this.visibleItemQueue.dequeue();
      this.invisibleItemQueue.enqueue(nextInvisible);
      const nextInvisibleElement = this.overflowItems[nextInvisible].element;

      currentWidth -= nextInvisibleElement.offsetWidth;
      this.overflowItems[nextInvisible].element.style.display = "none";
    }

    // only update when the state of visible/invisible items has changed
    if (
      this.visibleItemQueue.peek() !== visibleTop ||
      this.invisibleItemQueue.peek() !== invisibleTop
    ) {
      this.dispatchOverflowUpdate();
    }
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

    this.onUpdateOverflow?.({ visibleItems, invisibleItems });
  }

  private initInvisibleItemQueue() {
    return new PriorityQueue<string>((a, b) => {
      const itemA = this.overflowItems[a];
      const itemB = this.overflowItems[b];
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
