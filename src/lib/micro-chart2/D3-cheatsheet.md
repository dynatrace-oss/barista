## Plan

We plan to split the chart in seperated parts

public api

e.g.

<dt-microchart-line-series> (public api) -> BusinessLogic (Core) -> rendering agnostic x,y values (Renderer) -> <internal svg series> (internal svg series components)

Daniel and Szymons Feedback:

- Maybe have a different wrapper or component for micro charts in tables
- Investigate if we can use the microchart within infographics
- Limit the amount of configuration
