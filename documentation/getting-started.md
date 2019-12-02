# Get started

## Installation

To install the Barista components use our ng-add schematic with:

<pre><code>ng add @dynatrace/barista-components</pre></code>

This will guide you through our installation process and will ask you some
questions.

1. The path to the NgModule where the imports will be registered.
2. If the Browser Animation Module should be enabled.
3. If you want our typography styles or only the base styles for the components.
4. If you want to install all our peer dependencies.

After everything is installed and set up you can start by importing the needed
module for each component you want to use:

```typescript
import { DtButtonModule } from '@dynatrace/barista-components';

@NgModule({
  ...
  imports: [DtButtonModule],
  ...
})
export class PizzaPartyAppModule { }
```

Alternatively, you can create a separate NgModule that imports all of the
Barista components that you will use in your application. You can then include
this module wherever you'd like to use the components.

**Note:** Whichever approach you use, be sure to import the Barista components
modules after Angular's BrowserModule, as the import order matters for
NgModules.
