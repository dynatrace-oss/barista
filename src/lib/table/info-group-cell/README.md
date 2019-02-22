---
type: "component"
---

# DtInfoGroupCell (deprecated)

This component is **deprecated**, please use the `dt-info-group` component instead. The `<dt-info-group-cell>` components handles the styles and alignment for cells that have 2 rows and an icon.

## Imports

You have to import the `DtTableModule` when you want to use the `<dt-info-group-cell>` component:

```typescript

@NgModule({
  imports: [
    DtTableModule,
  ],
})
class MyModule {}

```

## Usage

```html
<dt-info-group-cell>
  <dt-info-group-cell-icon>
    <dt-icon name="apache-tomcat"></dt-icon>
  </dt-info-group-cell-icon>
  <dt-info-group-cell-title>hz.hzInstance_1_cluster.thread-1</dt-info-group-cell-title>
  S0
</dt-info-group-cell>
```

In addition to the custom content, the info-group-cell can also hold some special sections:

* `<dt-info-group-cell-icon>` - The icon container that holds a `<dt-icon>`
* `<dt-info-group-cell-title>` - The title of this info-group-cell
