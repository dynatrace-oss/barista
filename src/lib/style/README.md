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

`.example {` <br> &nbsp;&nbsp;`@include dt-main-font();` <br> `}`

##### Default values

`$monospace-font-family: 'VeraMonoWeb'`<br>
`$default-font-family: 'BerninaSansWeb'`<br>
`$default-font-color: #454646`<br>
`$default-font-weight: normal`<br>
`$default-font-size: 14px`<br>
`$default-line-height: 1.6`

##### Mixins for defined cases

| Name | Arguments | Description | Values |
| --- | --- | --- | --- |
| `dt-main-font()` | line-height (optional) | default, most basic font style | `font-family: $default-font-family;` <br> `font-size: $default-font-size;` <br>  `font-weight: $default-font-weight;` <br> `line-height: $default-line-height;` (default value) <br> `color: $default-font-color;` |
| `dt-h1-font()` | line-height (optional) | style for headings 1 | `font-family: $default-font-family;` <br> `font-size: fluid` <br> - screen size 360px: `24px;` <br> - screen size 1280px: `26.4px;` <br> - screen size 1920px: `28px;`  <br>  `font-weight: 300;` <br> `line-height: $default-line-height;` (default value) <br> `color: $default-font-color;` |
| `dt-h2-font()` | line-height (optional) | style for headings 2 | `font-family: $default-font-family;` <br> `font-size: 20px;` <br>  `font-weight: 600;` <br> `line-height: $default-line-height;` (default value) <br> `color: $default-font-color;` |
| `dt-h3-font()` | line-height (optional) | style for headings 3 | `font-family: $default-font-family;` <br> `font-size: 18px;` <br>  `font-weight: $default-font-weight;` <br> `line-height: $default-line-height;` (default value) <br> `color: $default-font-color;` |
| `dt-label-font()` | line-height (optional) | style for labels | `font-family: $default-font-family;` <br> `font-size: 12px;` <br>  `font-weight: $default-font-weight;` <br> `line-height: $default-line-height;` (default value) <br> `color: $default-font-color;` |
| `dt-code-font()` | - | style for code snippets | `font-family: $monospace-font-family;` <br> `font-size: $default-font-size;` <br>  `font-weight: $default-font-weight;` <br> `line-height: $default-line-height;` <br> `color: $default-font-color;` |


##### Mixins for custom styling (not recommended)

 | Name | Arguments | Purpose | Examples of use |
 | --- | --- | --- | --- |
 | `dt-custom-font-styles(...)` | color* <br> font-weight* <br> font-size* <br> line-height*  | changing style-and-size-related properties | `dt-custom-font-styles(#facade, 700);` <br> `dt-custom-font-styles(#c0ffee, 700, 14px, 32px)` <br> `dt-custom-font-styles(false, 300)` <br> `dt-custom-font-styles($custom-font-weight: 300)` <br> |
 
 
 \* - optional argument; **NOTE:** if not used but not last in order should be replaced by **false**; you can also use explicitly specified arguments not to worry about the order of arguments (see last example in the table above)  

## Link

<docs-source-example example="LinkSimpleExample"></docs-source-example>

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

<docs-source-example example="LinkExternalExample"></docs-source-example>

#### Dark theme

<docs-source-example example="LinkDarkExample" themedark="true"></docs-source-example>

#### Notification

The link can be used in any context and inherits the font size.

<docs-source-example example="LinkNotificationExample"></docs-source-example>
