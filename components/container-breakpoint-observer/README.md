# Container-breakpoint-observer (experimental)

Observes the created container for provided queries and notifies the consumer if
a query is matching or not. Use the `observe` with a query to start monitoring.
The queries have the same syntax as the browsers media queries (e.g.:
`(min-width: 300px)`).

_Note_: Only `min-width`, `max-width`, `min-height` and `max-height` are
supported.

<ba-live-example name="DtExampleContainerBreakpointObserverDefault"></ba-live-example>

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

## `dtIfContainerBreakpoint` directive

A structural directive, much like Angulars `ngIf`, that takes a container media
query (or multiple) and whenever the breakpoint observer matches this query it
renders the template provided in the `then`, or when false renders the template
provided in an optional else clause.

_Important notice:_ This directive needs a `dt-container-breakpoint-observer` to
work, because it passes the provided query to the observer and evaluates
every-time the observed query changes state.

## Inputs

| Name                          | Type                                                 | Description                                                                |
| ----------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------- |
| `dtIfContainerBreakpoint`     | `query: string | string[]`                           | The query to observe and evaluate as the condition for showing a template. |
| `dtIfContainerBreakpointThen` | `TemplateRef<DtIfContainerBreakpointContext> | null` | A template to show if the breakpoint does match.                           |
| `dtIfContainerBreakpointElse` | `TemplateRef<DtIfContainerBreakpointContext> | null` | A template to show if the breakpoint does not match.                       |

Example:
<ba-live-example name="DtExampleContainerBreakpointObserverIf"></ba-live-example>

Using the `then` template:
<ba-live-example name="DtExampleContainerBreakpointObserverIfElse"></ba-live-example>

## Responsive Table

Using the breakpoint observer creating a responsive table got easier:

<ba-live-example name="DtExampleTableResponsive"></ba-live-example>
