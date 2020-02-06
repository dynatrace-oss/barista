# Pagination

<ba-ux-snippet name="pagination-intro"></ba-ux-snippet>

<ba-live-example name="DtExamplePaginationDefault"></ba-live-example>

## Imports

You have to import the `DtPaginationModule` when you want to use the
`dt-pagination`.

```typescript
@NgModule({
  imports: [DtPaginationModule],
})
class MyModule {}
```

## Initialization

To use the pagination in your template you need the `<dt-pagination>` element.

Each pagination instance requires:

- the total number of items being paged
- the number of items per page _(default set to 50)_

The current page index defaults to 0, but can be explicitly set via the
`currentPage` input. When the user interacts with the pagination a `changed`
event will be fired that can be used to update any associated data view.

## Inputs

| Name                | Type     | Default                       | Description                                   |
| ------------------- | -------- | ----------------------------- | --------------------------------------------- |
| `length`            | `number` | `0`                           | Number of items to display on a page.         |
| `pageSize`          | `number` | `50`                          | Number of items to display on a page.         |
| `currentPage`       | `number` | `1`                           | The current page of the pagination.           |
| `ariaLabelPrevious` | `string` | `Previous page`               | ARIA label for the previous page button.      |
| `ariaLabelNext`     | `string` | `Next page`                   | ARIA label for the next page button.          |
| `aria-label`        | `string` | `Pagination`                  | ARIA label for the pagination.                |
| `ariaLabelEllipses` | `string` | `The next pages are ellipses` | ARIA label for the ellipsis character.        |
| `ariaLabelPage`     | `string` | `page`                        | ARIA label for a page button (Page 1,2,3...). |
| `ariaLabelCurrent`  | `string` | `You are currently on page`   | ARIA label for the current page button.       |

## Outputs

| Name      | Type                   | Description                                                                                   |
| --------- | ---------------------- | --------------------------------------------------------------------------------------------- |
| `changed` | `EventEmitter<number>` | Event that gets fired if the current page changes. It emits the new number as a current page. |

## Methods

The following methods are available on the `DtPagination` class.

| Name               | Description                                                                          | Return value |
| ------------------ | ------------------------------------------------------------------------------------ | ------------ |
| `getNumberOfPages` | Calculates the number of pages by the provided page size and the length of all items | `number`     |
| `previous`         | Sets the previous page as current page                                               | `void`       |
| `next`             | Sets the next page as current page                                                   | `void`       |

## Pagination in use

<ba-ux-snippet name="pagination-in-use"></ba-ux-snippet>
