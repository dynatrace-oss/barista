# Design Tokens Figma plugin

The Design Tokens Figma plugin allows switching between themes automatically. It
also allows importing
[design tokens](https://github.com/dynatrace-oss/barista/tree/master/libs/shared/design-tokens/generated)
into Figma team library documents.

## Build

Run `bazel build //apps/figma-plugin`

## Publishing

See
[the Figma documentation](https://help.figma.com/hc/en-us/articles/360042293394-Publish-a-plugin-to-the-Community).

## Installation

The plugin can be installed in the "Plugins" section of Figma's home page. The
Design Tokens team library should be imported into any documents where this
plugin will be used.

## Theme switching

You can switch themes by selecting one or more Figma frames or components and
running _Plugins - Design Tokens - Set theme to [theme name]_ in the context
menu (make sure that the right color styles starting with "abyss/" or "surface/"
are used).

After the theme of an object has been changed for the first time, the plugin
will add buttons for fast theme switching to this object. These buttons will
also be added to all object that are located directly in the root level of any
page.

The theme switching function downloads data when it's used for the first time in
a document. It works offline after this initial download.

If you're experiencing issues, try running _Plugins - Design Tokens - Advanced -
Clear cached styles_ in the context menu before using the theme switching
options while you're online.

## Administration

This section describes functionality for team library authors. Other users can
get access to design tokens by importing the "Design Tokens" team library.

### Importing design tokens to the team library

You can automatically import design tokens from the repository by running
_Plugins - Design Tokens - Admin - Import tokens and upload styles_ in the
context menu. You will need to confirm that you want to upload the styles from
the current document (due to a limitation in Figma's plugin API, plugins cannot
query which document they are executed in).

This should only be done by team library authors in the document that contains
the Design Tokens team library. Please read the instructions carefully.

You can run this command again later to add tokens that have been newly created
and update existing ones.

If tokens that were imported previously have been deleted in the repository, you
will get a notification message after the download. Deleted color tokens will
also be changed to a pink and yellow gradient and typography tokens will be
changed to bold Comic Sans MS to make finding usages of deleted tokens easier.

### Migration

Documents with the older non-compatible color naming convention can be migrated
for theme switching support with the following steps:

1. Make a backup copy of the document
2. Run _Plugins - Design Tokens - Admin - Migrate color names_
3. Check if the color styles have been renamed correctly
4. Run _Plugins - Design Tokens - Admin - Import tokens and upload styles_
5. Check if the color and and typography tokens have been imported correctly and
   make sure that theme switching works in the current document
6. If everything worked, publish the changes to the team library in the Figma UI

Typography tokens must be renamed according to the design tokens manually if
automatic synchronization is desired.

## Other features

The theme switching buttons in the "Plugin" section of the right bar won't show
up automatically after adding new objects due to a limitation in Figma's API.
They can be added manually to every top-level object by running _Plugins -
Design Tokens - Add plugin buttons_ (or any other option) in the context menu.
