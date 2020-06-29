# fluid-tab

This is a experimental version of the tab component. It registers itself as
`fluid-tab` custom element.

## Properties

| Property   | Attribute  | Type      | Default                    | Description                                  |
| ---------- | ---------- | --------- | -------------------------- | -------------------------------------------- |
| `active`   | `active`   | `boolean` |                            | Defines whether a tab is active or not       |
| `disabled` | `disabled` | `boolean` |                            | Defines whether a tab is disabled or not     |
| `tabid`    | `tabid`    | `string`  | "`fluid-tab-${_unique++}`" | Defines the tab element with an id attribute |
| `tabindex` | `tabindex` | `number`  |                            | Defines the tabindex attribute               |

## Slots

| Name | Description                                  |
| ---- | -------------------------------------------- |
|      | Default slot to provide a label for the tab. |

# fluid-tag-group

This is a experimental version of the tab group component. It registers itself
as `fluid-tab-group` custom element.

## Properties

| Property      | Attribute     | Type     | Description                |
| ------------- | ------------- | -------- | -------------------------- |
| `activetabid` | `activetabid` | `string` | Defines a tab to be active |

## Slots

| Name | Description                                               |
| ---- | --------------------------------------------------------- |
|      | Default slot lets the user provide a group of fluid-tabs. |
