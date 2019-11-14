# Pagination

The `DtPagination` provides navigation for paged information, typically used in
combination with long lists or tables. List and table lengths should always be
adjusted to their use cases. Avoid unnecessary pagination whenever possible.

<docs-source-example example="PaginationDefaultExample"></docs-source-example>

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

| Name                  | Type     | Default                       | Description                                   |
| --------------------- | -------- | ----------------------------- | --------------------------------------------- |
| `length`              | `number` | `0`                           | Number of items to display on a page.         |
| `pageSize`            | `number` | `50`                          | Number of items to display on a page.         |
| `currentPage`         | `number` | `1`                           | The current page of the pagination.           |
| `aria-label-previous` | `string` | `Previous page`               | ARIA label for the previous page button.      |
| `aria-label-next`     | `string` | `Next page`                   | ARIA label for the next page button.          |
| `aria-label`          | `string` | `Pagination`                  | ARIA label for the pagination.                |
| `aria-label-ellipses` | `string` | `The next pages are ellipses` | ARIA label for the ellipsis character.        |
| `aria-label-page`     | `string` | `page`                        | ARIA label for a page button (Page 1,2,3...). |
| `aria-label-current`  | `string` | `You are currently on page`   | ARIA label for the current page button.       |

## Outputs

| Name      | Type                        | Description                                                                                                                                       |
| --------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `changed` | `EventEmitter<number>`      | Event that gets fired if the current page changes. It emits the new number as a current page.                                                     |
| `page`    | `EventEmitter<DtPageEvent>` | Event emitted when the pagination changes the page size or page index. The DtPageEvent contains the current page, the actual page size and length |

## Methods

The following methods are available on the `DtPagination` class.

| Name               | Description                                                                          | Return value |
| ------------------ | ------------------------------------------------------------------------------------ | ------------ |
| `getNumberOfPages` | Calculates the number of pages by the provided page size and the length of all items | `number`     |
| `previous`         | Sets the previous page as current page                                               | `void`       |
| `next`             | Sets the next page as current page                                                   | `void`       |

## Pagination in use

The pagination component should be used when space is limited and not flexible.
For example if the selection in a table affects content underneath.

<docs-source-example example="PaginationDynamicTableExample"></docs-source-example>

The following example shows a pagination example with more than seven pages
where an ellipsis is used to hide remaining pages.

<docs-source-example example="PaginationManyExample"></docs-source-example>

Another variant of the paging behavior - loading more items if not everything is
visible initially - is the [show more component]({{link_to_id id='show-more'}}).
