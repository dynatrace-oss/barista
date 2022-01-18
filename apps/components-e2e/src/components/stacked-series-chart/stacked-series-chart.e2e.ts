/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { resetWindowSizeToDefault, waitForAngular } from '../../utils';
import { absoluteBtn, percentBtn } from '../sunburst-chart/sunburst-chart.po';
import {
  autoLabelAxisModeBtn,
  barBtn,
  barChart,
  body,
  chartContainer,
  chartWidth1200Btn,
  chartWidth400Btn,
  columnBtn,
  columnChart,
  continuousAxisFormat7f,
  continuousAxisFormatLong,
  continuousAxisIntervalFiveMin,
  continuousAxisIntervalHalfHour,
  continuousAxisIntervalHour,
  continuousAxisTypeDate,
  continuousAxisTypeLinear,
  fullTrackBtn,
  getHeatFieldArea,
  getHeatFieldTooltip,
  getHeatFieldItemByLevel,
  getHeatFieldLevel,
  getLabel,
  getLegendItem,
  getSlice,
  getTick,
  getTrack,
  heatFieldTypeNormal,
  labels,
  legend,
  legendItems,
  max10Btn,
  noMaxBtn,
  noneBtn,
  nonSelectableBtn,
  nonVisibleLabelBtn,
  nonVisibleLegendBtn,
  nonVisibleTrackBkgBtn,
  nonVisibleValueAxisBtn,
  overlay,
  resetBtn,
  selectableBtn,
  selectBtn,
  selectionModeNode,
  selectionModeStack,
  setLegendsBtn,
  singleTrackBtn,
  slices,
  ticks,
  tracks,
  unselectBtn,
  valueAxis,
  heatFieldTypeOverlap,
} from './stacked-series-chart.po';

// Reduced speed of hovering should get our e2e tests stable.
// We should think about removing the dtOverlay and using the cdk one,
// that is not flaky on other e2e tests #86
const hover: MouseActionOptions = {
  // Slowest possible speed should help as workaround til the issue is fixed.
  // The issue #646 is opened for this.
  speed: 0.6,
};

const selectableTrackClassname = 'dt-stacked-series-chart-track-selectable';
const selectableSliceClassname = 'dt-stacked-series-chart-slice-selectable';

const selectedSliceClassname = 'dt-stacked-series-chart-slice-selected';
const selectedHeatFieldClassname =
  'dt-stacked-series-chart-heat-field-selected';

const compactModeClassname = 'dt-stacked-series-chart-series-axis-compact-mode';

fixture('Stacked series chart')
  .page('http://localhost:4200/stacked-series-chart')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should have the defaults', async (testController) => {
  await testController
    .click(resetBtn)
    .expect(barChart.exists)
    .ok()
    .expect(tracks.count)
    .eql(5)
    .expect(labels.count)
    .eql(5)
    .expect(slices.count)
    .eql(10)
    .expect(legend.exists)
    .ok()
    .expect(valueAxis.exists)
    .ok()
    .expect(ticks.count)
    .eql(6)
    .expect(getLabel(0).textContent)
    .match(/Espresso/)
    .expect(getSlice(0, 0).clientWidth)
    .within(125, 140)
    .expect(getSlice(0, 0).clientHeight)
    .eql(16)
    .expect(getSlice(0, 0).getStyleProperty('background-color'))
    .eql('rgb(0, 158, 96)')
    .expect(legendItems.count)
    .eql(4);
});

test('should change the mode and fillMode', async (testController) => {
  await testController
    .click(resetBtn)
    // mode
    .click(columnBtn)
    .expect(columnChart.exists)
    .ok()
    .expect(tracks.count)
    .eql(5)
    .expect(labels.count)
    .eql(5)
    .expect(slices.count)
    .eql(10)
    .expect(ticks.count)
    .eql(6)
    .expect(getLabel(0).textContent)
    .match(/Espresso/)
    .expect(getSlice(0, 0).clientWidth)
    .eql(16)
    .expect(getSlice(0, 0).clientHeight)
    .within(57, 67)
    .expect(legendItems.count)
    .eql(4)
    // fillMode
    .click(fullTrackBtn)
    .expect(getSlice(0, 0).clientHeight)
    .within(295, 315)
    .click(barBtn)
    .expect(getSlice(0, 0).clientWidth)
    .within(635, 650);
});

test('should change to single and multitrack with corresponding value display modes', async (testController) => {
  await testController
    .click(resetBtn)
    // multi
    .expect(getTick(0).textContent)
    .match(/0/)
    .expect(getLegendItem(0).textContent)
    .match(/Coffee/)

    .click(percentBtn)
    .expect(getTick(0).textContent)
    .match(/0 %/)
    .expect(getLegendItem(0).textContent)
    .match(/Coffee/)
    // single
    .click(singleTrackBtn)
    .click(noneBtn)
    .expect(getTick(0).textContent)
    .match(/0/)
    .expect(getLegendItem(0).textContent)
    .match(/Coffee/)

    .click(absoluteBtn)
    .expect(getTick(0).textContent)
    .match(/0/)
    .expect(getLegendItem(0).textContent)
    .match(/2  Coffee/)

    .click(percentBtn)
    .expect(getTick(0).textContent)
    .match(/0 %/)
    .expect(getLegendItem(0).textContent)
    .match(/66.7 %  Coffee/);
});

test('should enable selection and select by input', async (testController) => {
  await testController
    // by click
    .click(resetBtn)
    .click(selectableBtn)
    .click(getSlice(0, 0))
    .expect(getSlice(0, 0).classNames)
    .contains(selectedSliceClassname)
    .click(getSlice(0, 0))
    .expect(getSlice(0, 0).classNames)
    .notContains(selectedSliceClassname)

    // by input
    .click(resetBtn)
    .click(selectableBtn)
    .click(selectBtn)
    .expect(getSlice(0, 0).classNames)
    .contains(selectedSliceClassname)
    .click(unselectBtn)
    .expect(getSlice(0, 0).classNames)
    .notContains(selectedSliceClassname)

    // non selectable
    .click(resetBtn)
    .click(nonSelectableBtn)
    .click(getSlice(0, 0))
    .expect(getSlice(0, 0).classNames)
    .notContains(selectedSliceClassname)
    .click(selectBtn)
    .expect(getSlice(0, 0).classNames)
    .notContains(selectedSliceClassname);
});

test('should toggle legend and use an external one', async (testController) => {
  await testController
    .click(resetBtn)
    .click(setLegendsBtn)
    .expect(getSlice(0, 0).clientWidth)
    .eql(0)
    .click(nonVisibleLegendBtn)
    .expect(legend.count)
    .eql(0);
});

test('should toggle valueAxis and label', async (testController) => {
  await testController
    .click(resetBtn)
    .click(nonVisibleValueAxisBtn)
    .expect(valueAxis.count)
    .eql(0)
    .click(nonVisibleLabelBtn)
    .expect(labels.count)
    .eql(0);
});

test('should accept a max and toggle track background', async (testController) => {
  await testController
    .click(resetBtn)
    // max
    .click(max10Btn)
    .expect(getSlice(0, 0).clientWidth)
    .within(60, 71)
    .click(noMaxBtn)
    .expect(getSlice(0, 0).clientWidth)
    .within(125, 140)

    // track background
    .expect(getTrack(0).getStyleProperty('background-color'))
    .eql('rgb(230, 230, 230)')
    .click(nonVisibleTrackBkgBtn)
    .expect(getTrack(0).getStyleProperty('background-color'))
    .eql('rgba(0, 0, 0, 0)');
});

test('should show overlay on hover', async (testController: TestController) => {
  await testController
    .click(resetBtn)
    .hover(getSlice(0, 0), hover)
    .expect(overlay.exists)
    .ok()
    .expect(overlay.textContent)
    .match(/EspressoCoffee: 1/)
    .hover(body, { ...hover, offsetX: 10, offsetY: 10 })
    .expect(overlay.exists)
    .notOk();
});

test('should switch from full to compact on labelAxisMode auto', async (testController: TestController) => {
  await testController
    .click(resetBtn)
    .click(columnBtn)
    .expect(chartContainer.classNames)
    .notContains(compactModeClassname)
    .click(autoLabelAxisModeBtn)
    .click(chartWidth400Btn)
    .resizeWindowToFitDevice('ipad')
    .wait(250) // Wait for the DtViewportResizer event to trigger
    .expect(chartContainer.classNames)
    .contains(compactModeClassname);
});

test('should be selectable depending on the selection mode', async (testController: TestController) => {
  await testController
    // non selectable
    .click(resetBtn)
    .expect(getTrack(0).classNames)
    .notContains(selectableTrackClassname)
    .expect(getSlice(0, 0).classNames)
    .notContains(selectableSliceClassname)
    // selectable slice
    .click(selectableBtn)
    .click(selectionModeNode)
    .expect(getTrack(0).classNames)
    .notContains(selectableTrackClassname)
    .expect(getSlice(0, 0).classNames)
    .contains(selectableSliceClassname)
    // selectable stack
    .click(selectionModeStack)
    .expect(getTrack(0).classNames)
    .contains(selectableTrackClassname)
    .expect(getSlice(0, 0).classNames)
    .contains(selectableSliceClassname);
});

test('should render linear chart with format and auto-fitting ticks', async (testController: TestController) => {
  await testController
    // Select date type
    .click(resetBtn)
    .click(continuousAxisTypeLinear)

    // Check format to two decimals
    .expect(labels.count)
    .eql(5)
    .expect(getLabel(0).textContent)
    .match(/\$0.00/)
    .expect(getLabel(1).textContent)
    .match(/\$0.50/)
    .expect(getLabel(2).textContent)
    .match(/\$1.00/)

    // select column so that auto fit can be applied
    .click(autoLabelAxisModeBtn)
    .click(columnBtn)
    .click(chartWidth400Btn)
    .click(continuousAxisFormat7f)

    // Check auto fitting ticks
    .expect(chartContainer.classNames)
    .contains(compactModeClassname)
    .click(chartWidth1200Btn)
    .click(continuousAxisTypeLinear)
    .expect(chartContainer.classNames)
    .notContains(compactModeClassname)

    // Check format to seven decimals
    .expect(labels.count)
    .eql(5)
    .expect(getLabel(0).textContent)
    .match(/\$0.0000000/)
    .expect(getLabel(1).textContent)
    .match(/\$0.5000000/)
    .expect(getLabel(2).textContent)
    .match(/\$1.0000000/);
});

test('should render date chart with format and auto-fitting ticks', async (testController: TestController) => {
  await testController
    // Select date type
    .click(resetBtn)
    .click(continuousAxisTypeDate)

    // Check track ticks
    .expect(labels.count)
    .eql(28)
    .expect(getLabel(0).textContent)
    .match(/11:35/)
    .expect(getLabel(1).textContent)
    .match(/11:40/)
    .expect(getLabel(2).textContent)
    .match(/11:45/)

    // select column so that auto fit can be applied
    .click(autoLabelAxisModeBtn)
    .click(columnBtn)
    .expect(chartContainer.classNames)
    .contains(compactModeClassname)

    // Check track ticks again
    .expect(labels.count)
    .eql(28)
    .expect(getLabel(0).textContent)
    .match(/11:35/)
    .expect(getLabel(1).textContent)
    .match(/11:40/)
    .expect(getLabel(2).textContent)
    .match(/11:45/)

    // Check auto fitting ticks with long time format
    .click(continuousAxisFormatLong)
    .expect(chartContainer.classNames)
    .contains(compactModeClassname)

    // Check track ticks
    .expect(labels.count)
    .eql(9)
    .expect(getLabel(0).textContent)
    .match(/11:45:00:000AM/)
    .expect(getLabel(1).textContent)
    .match(/12:00:00:000PM/)
    .expect(getLabel(2).textContent)
    .match(/12:15:00:000PM/)

    // Check no compact mode with long width
    .click(chartWidth1200Btn)
    .click(continuousAxisTypeDate)
    .expect(chartContainer.classNames)
    .notContains(compactModeClassname);
});

test('should render date chart with format and auto-fitting ticks', async (testController: TestController) => {
  await testController
    // Select date type and ticks per 5 mins
    .click(resetBtn)
    .click(continuousAxisTypeDate)
    .click(continuousAxisIntervalFiveMin)

    // select column so that auto fit can be applied
    .click(autoLabelAxisModeBtn)
    .click(columnBtn)
    .expect(chartContainer.classNames)
    .contains(compactModeClassname)

    // Check track ticks
    .expect(labels.count)
    .eql(28)
    .expect(getLabel(0).textContent)
    .match(/11:35/)
    .expect(getLabel(1).textContent)
    .match(/11:40/)
    .expect(getLabel(2).textContent)
    .match(/11:45/)

    // Check auto fitting ticks per half hour
    .click(continuousAxisIntervalHalfHour)
    .expect(chartContainer.classNames)
    .notContains(compactModeClassname)

    // Check track ticks
    .expect(labels.count)
    .eql(4)
    .expect(getLabel(0).textContent)
    .match(/12:00/)
    .expect(getLabel(1).textContent)
    .match(/12:30/)
    .expect(getLabel(2).textContent)
    .match(/13:00/)

    // Check auto fitting ticks per hour
    .click(continuousAxisIntervalHour)
    .expect(chartContainer.classNames)
    .notContains(compactModeClassname)

    // Check track ticks
    .expect(labels.count)
    .eql(2)
    .expect(getLabel(0).textContent)
    .match(/12:00/)
    .expect(getLabel(1).textContent)
    .match(/13:00/);
});

test('should render Heat Fields, even with overlaps, and show tooltip', async (testController: TestController) => {
  const checkHeatFieldWrapper = async (
    selectedHeatField: Selector,
    isColumn: boolean,
    heatFieldsByLevel: number[],
    heatFieldTooltipText: RegExp,
  ) => {
    const getLineWidth = () =>
      isColumn ? selectedHeatField.clientHeight : selectedHeatField.clientWidth;
    const getAreaSize = (selector) =>
      isColumn ? selector.clientWidth : selector.clientHeight;

    await testController
      .expect(getHeatFieldLevel(0).count)
      .eql(heatFieldsByLevel[0])
      .expect(getHeatFieldLevel(1).count)
      .eql(heatFieldsByLevel[1])
      .expect(getHeatFieldLevel(2).count)
      .eql(heatFieldsByLevel[2])
      .expect(getLineWidth())
      .eql(8)
      .expect(selectedHeatField.classNames)
      .notContains(selectedHeatFieldClassname)

      // Select first heat field and check tooltip
      .click(selectedHeatField)
      .expect(selectedHeatField.classNames)
      .contains(selectedHeatFieldClassname)
      .expect(getLineWidth())
      .eql(12)

      // Check expected text in tooltip
      .expect(getHeatFieldTooltip.textContent)
      .match(heatFieldTooltipText);

    await testController
      .expect(getAreaSize(selectedHeatField))
      .eql(await getAreaSize(getHeatFieldArea));

    await testController
      .click(selectedHeatField)
      .expect(getLineWidth())
      .eql(8)
      .expect(getHeatFieldTooltip.count)
      .eql(0);
  };

  await testController
    // maximize window so that overlay is not closed due to scroll
    .maximizeWindow()
    // Select heat fields
    .click(resetBtn)
    .click(heatFieldTypeNormal);

  await checkHeatFieldWrapper(
    getHeatFieldItemByLevel(0, 0),
    false,
    [2, 0, 0],
    /HeatField 1/,
  );

  // Try overlap
  await testController.click(heatFieldTypeOverlap);

  await checkHeatFieldWrapper(
    getHeatFieldItemByLevel(1, 1),
    false,
    [1, 3, 1],
    /HeatField 4/,
  );

  // Check that everything works in column mode as well
  await testController.click(columnBtn);

  await checkHeatFieldWrapper(
    getHeatFieldItemByLevel(1, 1),
    true,
    [1, 3, 1],
    /HeatField 4/,
  );

  // Try the same for date data
  await testController.click(continuousAxisTypeDate).click(heatFieldTypeNormal);

  await checkHeatFieldWrapper(
    getHeatFieldItemByLevel(0, 0),
    true,
    [2, 0, 0],
    /HeatField 1/,
  );

  // Try overlap for date data
  await testController.click(heatFieldTypeOverlap);

  await checkHeatFieldWrapper(
    getHeatFieldItemByLevel(1, 0),
    true,
    [1, 1, 0],
    /HeatField 2/,
  );
});
