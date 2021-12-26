# Priority overflow implementation

## Usage

- npm install
- npm start

The app will allow you to try out the different scenarios that this tool supports.

## Supported use cases

### DOM Order overflow

Simply hides items that no longer fit outside the right (left for rtl) boundary of the viewport.

### Reverse DOM Order overflow

Can overflow from the beginning of the container instead of the end.

### RTL support

Overflow will work in the same way for RTL and LTR.

### Custom overflow order

Allows setting priorities to each overflow item, so that when overflow occurs, the items with the least priority are hidden first

### Subscribe for updates

It's possible to subscribe to updates in item visibility which can be used to implement additional UI around overflow.

## Not in scope

### Overflow menus

The tool does not support managing a dropdown menu for overflow items, since requirements can vary for each invidividual use case. However
it's possible to subscribe to changes in item visibility which can be used to implement additional UI around overflow.

## How it works

### ResizeObserver

The overflow management is done using a [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API), which watches
and reports resizes of a specific container element where this priority overflow pattern needs to be implemented.

### Priority queues

In order to support overflow not only for DOM order, but also for custom order, managed overflow items are stored in priority queues. This results in
`O(log(n))` time for displaying/hiding each item, where `n` is the number of items. Overflow that is only based on DOM order does not need this extra
complexity.

### display: none

Overflowed items are manually set with `display: none`. This benefits frameworks like React, which can result in extra rerenders to remove a rendered item.

### Item visibility subscription

It's possible to subscribe to changes in item visibility state. This can let you manage additional pieces of UI such as rendering dividers or overflow dropdown menus.
