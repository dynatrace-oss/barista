# Web components

## References and comparison

| Name       | Homepage                                                                                          | SCM                                                | Build setup                          | Base-framework                     | Testing | Docs       | Output                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------ | ---------------------------------- | ------- | ---------- | ------------------------------------------------------------------------------------------------ |
| Weightless | [Home page](https://weightless.dev/)                                                              | [Github](https://github.com/andreasbm/weightless)  | Rollup                               | Lit-elements                       | Karma   | Custom     | Single bundle per component, containing `.js`, `.dts` and `.scss.js` files.                      |
| Lion       | [Home page](https://lion-web-components.netlify.com/?path=/story/intro-lion-web-components--page) | [Github](https://github.com/ing-bank/lion)         | Individual package build with lerna  | Lit elements                       | Karma   | Storybook  | One npm bundle per component, different versions per component.                                  |
| Bolt       | [Home page](https://boltdesignsystem.com/)                                                        | [Github](https://github.com/boltdesignsystem/bolt) | Individual packages built with lerna | Native with some parts of lit-html | Jest    | Patternlab | Privately published to npm. Based on Lerna config, single output package with connected version. |

<!-- Template for more rows... -->
<!-- | Name | [Home page]() |  [Github]() | Build | Base framwork | Testing | Docs | Output |  -->

## Inspiration

### Weightless css custom property usage and documentation

It is really amazing how the weightless system uses css custom properties and
how they document what is actually possible to style within the custom element.
They do annotate the css properties and capabilities of the custom element
within the code, with custom JSdoc comments ([Weightless button JSdoc]). They
output this information into the [readme][weightless button readme] file with a
[generation script][weightless button readme generate].

[weightless button jsdoc]:
  https://github.com/andreasbm/weightless/blob/6c7965981752e85206d9da459110b2dddeecf9ec/src/lib/button/button.ts#L23-L46
[weightless button readme generate]:
  https://github.com/andreasbm/weightless/blob/6c7965981752e85206d9da459110b2dddeecf9ec/package.json#L52
[weightless button readme]:
  https://github.com/andreasbm/weightless/blob/master/src/lib/button/README.md
