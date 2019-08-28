---
draft: true
---

# Barista design system

All Markdown files (`README.md` files of components and documentation in this
repository's root directory) are part of the
[barista-content](***REMOVED***
i.e. the component documentation in our design system Barista. When adding new
components or features, please update readme-files accordingly. Stick to the
following best practices and structure guidelines when editing the
documentation.

## Front matter

Every Markdown file starts with a front matter that contains data for our static
site build. Some properties are required, others are nice-to-have.

- title (required): the name of the component, the title of the page
- description (required): a one-sentence summary of the component (shown in the
  page's header section)
- contributors (required): who provides dev/UX support?
  ```
  contributors:
    dev:
      - fabian.friedl
    ux:
      - raphaela.raudaschl
  ```
- postid (required): the page's id; is generated when missing in front matter
- draft: whether the page is in draft state; default: false
- public: whether the page is published on public Barista; default: true
- toc: whether a table of contents (TOC) should be rendered on the page;
  default: true
- themable: whether the component is themable; default: false
- wiki: a link to the UX wiki page of the component
- properties: to indicate a component-status (shown in the page's header
  section), possible values are "dev utility", "work in progress", "deprecated"
- tags: list of tags; used to group pages by topic and for search
- related: list of ids to related Barista-pages

### Additional properties

These properties are only needed for some special use cases.

- baristafilename: Set this property if the readme's filename is not what the
  path should be in Barista, e.g. add `baristafilename: 'contribute.md'` if the
  file is called `CONTRIBUTING.md` but the path should be
  `.../components/contribute/` in the end.

## Content

### Structure

The content of every page strongly depends on the component and its features.
Basically you should start with the component's basic features and move on to
more complex topics and exampes. Follow this structure when adding or updating a
readme-file for a component:

- **Introduction**: After the page title (h1, the component's name) add a short
  (2-3 sentences) introduction what the component is about and where is it
  commonly used. A basic/default component demo should always be part of the
  introduction.
- **Imports**: Add a note what angular-components module has to be imported to
  be able to use the component.
- **Initialization**: Describe how the component can be used in the code. What
  elements and properties/inputs are needed to get a basic running example?
- **Inputs, Outputs, Properties, Methods**: Add tables that describe the
  component's API.

Add the following sections depending on whether the component supports them or
not:

- **Variants**: Some components have different variants, e.g. a
  warning/error-variant, a primary/secondary-variant, etc. Describe them here.
- **Themes**: Some components are themable, i.e. they react to a page-theme
  (purple, blue, royalblue, turquoise) or/and have styles for light and dark
  background.
- **Accessibility**: If there is something to say about accessibliity (e.g.
  aria-labels, keyboard-support,...), put it into this section.
- **Behavior**: Is there special behavior that needs explanation?
- **Advanced usage**: Are there special features for this component (e.g. the
  chart selection area or the heatfield as part of the chart-page)?
- **Component in use**: Describe in detail where and why the component is used
  on screens.

### Examples (component demos)

Add examples where they are explained within the content. Do not add an
example-section at the end of the page where all examples are listed at once.

### Language and text

- Write "the button component" instead of "the Angular button" or "the Dynatrace
  button".
- Use sentence-case capitalization, i.e. write "Toggle button group" instead of
  "Toggle Button Group".
- Capitalize names like "Dynatrace" or "Angular".
- Uppercase abbreviations like "CDK" or "APM".
- Add periods at the end of sentences and property descriptions in tables.
- Strive for consistency (one spelling throughout the page/Barista).
