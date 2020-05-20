# Migration guide

## Migrate from v6 to v7

### Highcharts

For the major version upgrade to 7.0.0 we bumped the version of the peer
dependency `highcharts` to use version `^7.0.0`. This version of highcharts is
the first version that comes with official typings for typescript. Previously we
had to use community typings that were outdated. This upgrade requires some
manual changes to be performed for those typings.

Most common typings from the previous version:

#### SeriesOptions

If you used `SeriesOptions` before, please use `Options` from highcharts or
`DtChartOptions` for the options part of the configuration.

#### IndividualSeriesOptions

If you used `IndividualSeriesOptions` before, please either use the
`DtChartSeries` type or use one of the types used in the union if you can be
more explicit, e.g. `SeriesBarOptions`, `SeriesColumnOptions`,
`SeriesLineOptions`, `SeriesAreaOptions`, `SeriesArearangeOptions`,
`SeriesPieOptions`. The `dt-chart` does not support other chart types.

#### DataPoint

If you used the `DataPoint` type before, in most cases the new type that fits in
highcharts 7 is `PointOptionsObject`.

### lodash -> lodash-es

We switched the peer dependency of `lodash` to `lodash-es` to enable treeshaking
and reduce our bundle size. Our advice would be to also switch to `lodash-es`
for your app. If you are using jest as a testrunner as we do and encounter
problems with `lodash-es` because it does not ship commonjs bundles, you can add
the following snippet to your `jest.config.js`.

```js
  moduleNameMapper: {
    // map lodash-es to lodash bundle since jest needs commonjs
    '^lodash-es$': 'node_modules/lodash/index.js',
  },
```

Note: You need to have `lodash` installed as a dev dependency as well, since
jest will take the lodash version for all `lodash-es` imports in your code.

### Filter field

We improved the typings for our `DtFilterFieldDefaultDatasource` class. The
class is not a generic class anymore. Please remove the generic type and verify
that your code is compatible with our default datasource implementation. If you
want to use your own types for the filter field please create your own
datasource.
