# Styling

## Link

<docs-source-example example="LinkSimpleExampleComponent"></docs-source-example>

### API

#### Importing

*Links are not Angular components, thus it's not necessary to import any module.* However, make sure you include `link.scss`
into your stylesheet (it's also automatically imported when using `main.scss` stylesheet).

#### Initialization

Link styles are automatically applied to any `<a>` tag.

#### Options

##### CSS classes

| Name | Description|
| --- | --- |
| `fonticon-*` | Sets selected font-icon |
| `dt-external` | Marks link as leading to outside the product (add external link icon) |
| `theme--dark` | Set on the button itself or on any of its parent, changes button colors to be better visible on a dark background |

#### External link

<docs-source-example example="LinkExternalExampleComponent"></docs-source-example>

#### Dark theme

<docs-source-example example="LinkDarkExampleComponent"></docs-source-example>
