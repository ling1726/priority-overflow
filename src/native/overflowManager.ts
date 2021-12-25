import { PriorityQueue } from "./priorityQueue";

export interface OverflowItemEntry {
  element: HTMLElement;
  /**
   * Higher priority items become invisible later
   */
  priority: number;
  id: string;
}

export type OverflowEventHandler = (
  e: CustomEvent<OverflowEventPayload>
) => void;

export interface OverflowEventPayload {
  visibleItems: OverflowItemEntry[];
  invisibleItems: OverflowItemEntry[];
}

const EVENT_NAME = "overflow";

export class OverflowManager {
  private visibleItemQueue: PriorityQueue<string>;
  private invisibleItemQueue: PriorityQueue<string>;
  private overflowItems: Record<string, OverflowItemEntry> = {};
  private container: HTMLElement;
  private sentinel: HTMLElement;
  private resizeObserver: ResizeObserver;
  private eventTarget: EventTarget = new EventTarget();
  private resizeTimeout: number = 0;

  constructor(
    container: HTMLElement,
    sentinel: HTMLElement,
    targetWindow: Window
  ) {
    this.container = container;
    this.sentinel = sentinel;

    this.visibleItemQueue = this.initVisibleItemQueue();
    this.invisibleItemQueue = this.initInvisibleItemQueue();
    this.resizeObserver = this.initResizeObserver();

    // When the window resizes jiggle the width to force the resize observer
    // to trigger. Useful for cases where there is no overflow menu before
    // a sudden browser resize
    targetWindow.addEventListener("resize", () => {
      const origWidth = container.getBoundingClientRect().width;

      container.style.width = `${origWidth + 1}px`;
      this.resizeTimeout = setTimeout(() => (container.style.width = ""));
    });
  }

  public start() {
    this.resizeObserver.observe(this.container);
  }

  public dispose() {
    this.resizeObserver.disconnect();
    clearTimeout(this.resizeTimeout);
  }

  public addItems(...items: OverflowItemEntry[]) {
    items.forEach((item) => {
      this.overflowItems[item.id] = item;
      this.visibleItemQueue.enqueue(item.id);
    });
  }

  public hasItem(itemId: string) {
    return !!this.overflowItems[itemId];
  }

  public removeItem(itemId: string) {
    delete this.overflowItems[itemId];
    this.visibleItemQueue.remove(itemId);
    this.invisibleItemQueue.remove(itemId);
  }

  public addEventListener(func: OverflowEventHandler) {
    this.eventTarget.addEventListener(EVENT_NAME, func as EventListener);
  }

  private initResizeObserver() {
    return new ResizeObserver((entries) => {
      if (!entries[0] || !this.sentinel) {
        return;
      }

      const contentBox = entries[0].contentBoxSize[0];
      const availableWidth = contentBox.inlineSize;

      // Snapshot of the visible/invisible state to compare for updates
      const visibleTop = this.visibleItemQueue.peek();
      const invisibleTop = this.invisibleItemQueue.peek();

      // Add items until available width is filled
      while (
        this.sentinel.getBoundingClientRect().left < availableWidth &&
        this.invisibleItemQueue.size > 0
      ) {
        const nextvisible = this.invisibleItemQueue.dequeue();
        this.visibleItemQueue.enqueue(nextvisible);

        this.overflowItems[nextvisible].element.style.display = "";
      }

      // Remove items until there's no more overlap
      while (
        this.sentinel.getBoundingClientRect().left > availableWidth &&
        this.visibleItemQueue.size > 0
      ) {
        const nextInvisible = this.visibleItemQueue.dequeue();
        this.invisibleItemQueue.enqueue(nextInvisible);

        this.overflowItems[nextInvisible].element.style.display = "none";
      }

      // only update when the state of visible/invisible items has changed
      if (
        this.visibleItemQueue.peek() !== visibleTop ||
        this.invisibleItemQueue.peek() !== invisibleTop
      ) {
        const visibleItemIds = this.visibleItemQueue.all();
        const invisibleItemIds = this.invisibleItemQueue.all();

        const visibleItems = visibleItemIds.map(
          (itemId) => this.overflowItems[itemId]
        );
        const invisibleItems = invisibleItemIds.map(
          (itemId) => this.overflowItems[itemId]
        );

        this.eventTarget.dispatchEvent(
          new CustomEvent<OverflowEventPayload>(EVENT_NAME, {
            detail: { visibleItems, invisibleItems },
          })
        );
      }
    });
  }

  private initInvisibleItemQueue() {
    return new PriorityQueue<string>((a, b) => {
      const itemA = this.overflowItems[a];
      const itemB = this.overflowItems[b];
      const priority = itemB.priority - itemA.priority;
      if (priority !== 0) {
        return priority;
      }

      // equal priority, earlier in DOM should be first
      if (
        itemA.element.compareDocumentPosition(itemB.element) &
        Node.DOCUMENT_POSITION_FOLLOWING
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

      // equal priority, later in DOM should be first
      if (
        itemA.element.compareDocumentPosition(itemB.element) &
        Node.DOCUMENT_POSITION_PRECEDING
      ) {
        return -1;
      } else {
        return 1;
      }
    });
  }
}
