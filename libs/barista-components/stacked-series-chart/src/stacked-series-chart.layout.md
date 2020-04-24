# Bar/Column + Label positioning

As it's currently done, and probably will be recovered in the future, here's the
proposed solution for all the cases:

```ts
/** Positioning of the label relative to the track */
export type DtStackedSeriesChartLabelPosition =
  | 'none'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left';
```

```scss
/** HOW TO of layout

For positioning the elements we have 2 variables:
chart direction and label position.
To avoid having a switch case in the template
we apply a display grid to the container.
For each pair this would work like this:

column + none
  label: -; track: col auto
column + top
  label: row 1; track: row 2
column + right
  label: col n+1; track: col n
column + bottom
  label: row 2; track: row 1
column + left
  label: col n; track: col n+1

bar + none
  label: -; track: row auto
bar + top
  label: row n; track: row n+1
bar + right
  label: col 2; track: col 1
bar + bottom
  label: row n+1; track: row n
bar + left
  label: col 1; track: col 2

The trick used is getting the index of the array
inside a css custom var and do the calculation in css.
Every layout will have a different 'drawer'
and every piece will fit in place.
This allows working with only one html
*/

/** Chart orientation */
.dt-stacked-series-chart-container {
  display: grid;
  grid-auto-flow: dense;
  align-self: stretch;
  gap: $gap;
}

.dt-stacked-series-chart-bar {
  align-items: center;

  .dt-stacked-series-chart-series-axis {
    display: none;
  }

  .dt-stacked-series-chart-track {
    min-height: 1px;
    height: var(--dt-stacked-series-chart-max-bar-size);
  }

  .dt-stacked-series-chart-slice {
    width: var(--dt-stacked-series-chart-length);
  }
}

.dt-stacked-series-chart-column {
  justify-items: center;
  .dt-stacked-series-chart-series-label {
    align-self: center;
  }

  .dt-stacked-series-chart-series-label,
  .dt-stacked-series-chart-track {
    grid-row: 1;
  }

  .dt-stacked-series-chart-track {
    flex-direction: column-reverse;
    max-width: var(--dt-stacked-series-chart-max-bar-size);
    width: 100%;
  }

  .dt-stacked-series-chart-slice {
    height: var(--dt-stacked-series-chart-length);
  }

  .dt-stacked-series-chart-series-axis {
    grid-column: 1/-1;
    border-bottom: 1px solid $axis-color;
    width: 100%;
    grid-row: 1;
  }
}

/** Bar */
.dt-stacked-series-chart-bar.dt-stacked-series-chart-label-none {
  gap: $gap;
  grid-template-columns: 1fr;
}

.dt-stacked-series-chart-bar.dt-stacked-series-chart-label-top {
  gap: 0;
  grid-template-columns: 1fr;
  @include gridPosition(
    'grid-row',
    calc(2 * var(--dt-stacked-series-chart-track-index) - 1),
    calc(2 * var(--dt-stacked-series-chart-track-index))
  );
  .dt-stacked-series-chart-track {
    margin-bottom: $gap;
  }
}

.dt-stacked-series-chart-bar.dt-stacked-series-chart-label-right {
  grid-template-columns: 1fr auto;
  @include gridPosition('grid-column', 2, 1);
}

.dt-stacked-series-chart-bar.dt-stacked-series-chart-label-bottom {
  gap: 0;
  grid-template-columns: 1fr;
  @include gridPosition(
    'grid-row',
    calc(2 * var(--dt-stacked-series-chart-track-index)),
    calc(2 * var(--dt-stacked-series-chart-track-index) - 1)
  );
  // all but last
  .dt-stacked-series-chart-series-label:nth-last-of-type(n + 2) {
    margin-bottom: $gap;
  }
}

.dt-stacked-series-chart-bar.dt-stacked-series-chart-label-left {
  grid-template-columns: auto 1fr;
  @include gridPosition('grid-column', 1, 2);
}

/** Column */
.dt-stacked-series-chart-column.dt-stacked-series-chart-label-none {
  gap: 0;
  grid-template-rows: 1fr;
  grid-template-columns: repeat(
    var(--dt-stacked-series-chart-track-amount),
    1fr
  );
}

.dt-stacked-series-chart-column.dt-stacked-series-chart-label-top {
  grid-template-rows: auto 1fr;
  @include gridPosition('grid-row', 1, 2);
  grid-template-columns: repeat(
    var(--dt-stacked-series-chart-track-amount),
    1fr
  );

  .dt-stacked-series-chart-series-axis {
    grid-row: 2;
  }

  .dt-stacked-series-chart-track {
    grid-column: var(--dt-stacked-series-chart-track-index);
  }
}

.dt-stacked-series-chart-column.dt-stacked-series-chart-label-right {
  @include gridPosition(
    'grid-column',
    calc(2 * var(--dt-stacked-series-chart-track-index)),
    calc(2 * var(--dt-stacked-series-chart-track-index) - 1)
  );
  grid-template-columns: repeat(
    calc(2 * var(--dt-stacked-series-chart-track-amount)),
    1fr
  );

  .dt-stacked-series-chart-series-label {
    justify-self: start;
  }
  .dt-stacked-series-chart-track {
    justify-self: end;
  }
}

.dt-stacked-series-chart-column.dt-stacked-series-chart-label-bottom {
  grid-template-rows: 1fr auto;
  @include gridPosition('grid-row', 2, 1);
  grid-template-columns: repeat(
    var(--dt-stacked-series-chart-track-amount),
    1fr
  );

  .dt-stacked-series-chart-track {
    grid-column: var(--dt-stacked-series-chart-track-index);
  }
}

.dt-stacked-series-chart-column.dt-stacked-series-chart-label-left {
  @include gridPosition(
    'grid-column',
    calc(2 * var(--dt-stacked-series-chart-track-index) - 1),
    calc(2 * var(--dt-stacked-series-chart-track-index))
  );
  grid-template-columns: repeat(
    calc(2 * var(--dt-stacked-series-chart-track-amount)),
    1fr
  );

  .dt-stacked-series-chart-series-label {
    justify-self: end;
  }
  .dt-stacked-series-chart-track {
    justify-self: start;
  }
}
```
