---
type: "service"
---

# ViewportResizer

The `ViewportResizer` is an abstract class that specifies a `change` function that returns a stream that fires every time a window resize event is triggered or `emit` is called. 
The Angular Component Library provides a `DefaultViewportResizer` implementing `ViewportResizer` and a provider `DEFAULT_VIEWPORT_RESIZER_PROVIDER` to use within the application. The `DEFAULT_VIEWPORT_RESIZER_PROVIDER` ensures that there is only one instance of the `ViewportResizer` implementation. 

## Dependencies:

The `ViewportResizer` depends on`ViewportRuler` from `@angular/cdk/scrolling'` and `Platform` from `'@angular/cdk/platform'`