---
title: Container-breakpoint-observer
description: 'Observes a container element for provided queries and notifies the consumer if
a query is matching or not'
public: true
toc: true
contributors:
  dev:
    - thomas.pink
---

# Container-breakpoint-observer (experimental)

Observes the created container for provided queries and notifies the consumer if
a query is matching or not. Use the `observe` with a query to start monitoring.
The queries have the same syntax as the browsers media queries (e.g.:
`(min-width: 300px)`).

_Note_: Only `min-width`, `max-width`, `min-height` and `max-height` are
supported.

<docs-source-example example="ContainerBreakpointObserverDefaultExample"></docs-source-example>

## Experimental

Why is it experimental:

- As this component heavily uses the `Intersection Observer` and some overlaying
  elements we do not have to rely on the browser's resize event and should
  therefor theoretically get much better performance. We still want to monitor
  the use-cases and performance figures before we fully introduce this feature.
- This component just now has one method where you can monitor a media query.
  More directives and APIs are planed to make it easier to use it.
- Proper UI testing is still missing.

## Imports

You have to import the `DtContainerBreakpointObserverModule` when you want to
use the `<dt-container-breakpoint-observer>`.

```typescript
@NgModule({
  imports: [DtContainerBreakpointObserverModule],
})
class MyModule {}
```

## Methods

| Name    | Params             | Return type                     | Description                                                                                                                                                                                                                                                  |
| ------- | ------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| observe | `string |string[]` | `Observable<DtBreakpointState>` | Start observing the container with the provided media query/queries. The observable will provide you a `DtBreakpointState` object which tells you if all media queries are currently matching (or not) and which of the individual breakpoints are matching. |

## Responsive Table

Using the breakpoint observer creating a responsive table got easier:

<docs-source-example example="TableResponsiveExample"></docs-source-example>
