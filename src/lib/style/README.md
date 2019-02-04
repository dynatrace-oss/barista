---
type: "other"
---

# Styling

## Fonts

### API

#### Importing

`font-mixins.scss` - set of mixins that can be used to apply defined font styles or introduce custom changes; import it to your stylesheet to be able to style your enclosed component or apply custom font styles (`@import "~@dynatrace/angular-components/style/font-mixins";`).

`font-styles.scss` - stylesheet with rule-sets for all predefined use cases of font styles; import it to your stylesheet to have basic html tags styled automatically (`@import "~@dynatrace/angular-components/style/font-styles";`).


#### Usage 

To use certain mixin simply include it in your rule-set:

`.example {` <br> `@include main-font();` <br> `}`

##### Default values

`$monospace-font-family: 'VeraMonoWeb'`
`$default-font-family: 'BerninaSansWeb'`
`$default-font-color: #454646`
`$default-font-weight: normal`
`$default-font-size: 14px`
`$default-line-height: 1.6`

##### Mixins for defined cases

| Name | Arguments | Description | Values |
| --- | --- | --- | --- |
| `main-font()` | line-height (optional) | default, most basic font style | `font-family: $default-font-family;` <br> `font-size: $default-font-size;` <br>  `font-weight: $default-font-weight;` <br> `line-height: $default-line-height;` (default value) <br> `color: $default-font-color;` |
| `h1-font()` | line-height (optional) | style for headings 1 | `font-family: $default-font-family;` <br> `font-size: fluid` <br> - screen size 360px: `24px;` <br> - screen size 1280px: `26.4px;` <br> - screen size 1920px: `28px;`  <br>  `font-weight: 300;` <br> `line-height: $default-line-height;` (default value) <br> `color: $default-font-color;` |
| `h2-font()` | line-height (optional) | style for headings 2 | `font-family: $default-font-family;` <br> `font-size: 20px;` <br>  `font-weight: 600;` <br> `line-height: $default-line-height;` (default value) <br> `color: $default-font-color;` |
| `h3-font()` | line-height (optional) | style for headings 3 | `font-family: $default-font-family;` <br> `font-size: 18px;` <br>  `font-weight: $default-font-weight;` <br> `line-height: $default-line-height;` (default value) <br> `color: $default-font-color;` |
| `label-font()` | line-height (optional) | style for labels | `font-family: $default-font-family;` <br> `font-size: 12px;` <br>  `font-weight: $default-font-weight;` <br> `line-height: $default-line-height;` (default value) <br> `color: $default-font-color;` |
| `code-font()` | - | style for code snippets | `font-family: $monospace-font-family;` <br> `font-size: $default-font-size;` <br>  `font-weight: $default-font-weight;` <br> `line-height: $default-line-height;` <br> `color: $default-font-color;` |


##### Mixins for custom styling (not recommended)

 | Name | Arguments | Purpose | Examples of use |
 | --- | --- | --- | --- |
 | `custom-font-size(...)` | font-size* <br> line-height*  | changing size-related properties | `custom-font-size(16px);` <br> `custom-font-size(false, 29px); ` <br> |
 | `custom-font-styles(...)` | color* <br> font-weight* <br> font-size* <br> line-height*  | changing style-and-size-related properties | `custom-font-styles(#facade, 700);` <br> `custom-font-styles(#c0ffee, 700, 14px, 32px)` <br> `custom-font-styles(false, 300)` <br> |
 
 
 \* - optional argument; **NOTE:** if not used but not last in order should be replaced by **false**.

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

<docs-source-example example="LinkDarkExampleComponent" themedark="true"></docs-source-example>

#### Notification

The link can be used in any context and inherits the font size.

<docs-source-example example="LinkNotificationExampleComponent"></docs-source-example>
