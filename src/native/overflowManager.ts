import { PriorityQueue } from "./priorityQueue";

export interface OverflowItemEntry {
  element: HTMLElement;
  /**
   * Lower priority items are invisible first when the container is overflowed
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
  private container?: HTMLElement;
  private sentinel?: HTMLElement;
  private resizeObserver: ResizeObserver;
  private eventTarget: EventTarget = new EventTarget();
  private resizeTimeout: number = 0;
  private mutationObserver: MutationObserver;

  constructor() {
    this.visibleItemQueue = this.initVisibleItemQueue();
    this.invisibleItemQueue = this.initInvisibleItemQueue();
    this.resizeObserver = this.initResizeObserver();
    this.mutationObserver = this.initMutationObserver();
  }

  public start() {
    if (this.container) {
      this.resizeObserver.observe(this.container);
      this.mutationObserver.observe(this.container, { childList: true });
    }
  }

  public stop() {
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

  public removeEventListener(func: OverflowEventHandler) {
    this.eventTarget.removeEventListener(EVENT_NAME, func as EventListener);
  }

  public setContainer(container: HTMLElement) {
    this.container = container;
  }

  public setSentinel(sentinel: HTMLElement) {
    this.sentinel = sentinel;
  }

  private initMutationObserver() {
    // Adding removing children DOM nodes can affect overflow (i.e. sudden overflow menu appearing)
    // When this happens just 'jiggle' the width of the container to trigger the resize observer
    return new MutationObserver(() => {
      if (!this.container) {
        return;
      }

      const origWidth = this.container.getBoundingClientRect().width;

      this.container.style.width = `${origWidth + 1}px`;
      this.resizeTimeout = setTimeout(() => (this.container!.style.width = ""));
    });
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
