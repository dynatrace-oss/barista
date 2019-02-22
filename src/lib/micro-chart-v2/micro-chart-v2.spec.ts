import { Component, Type, ViewChild} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtChartOptions, DtChartSeries, DtChartModule } from '@dynatrace/angular-components/chart';
import { getDtMicroChartUnsupportedChartTypeError } from './micro-chart-errors';
import { Colors, DtThemingModule, DtTheme } from '@dynatrace/angular-components/theming';
import objectContaining = jasmine.objectContaining;
import { AxisOptions, DataPoint } from 'highcharts';
import { BehaviorSubject } from 'rxjs';
import { DtMicroChartV2Module } from '@dynatrace/angular-components/micro-chart-v2';
import { merge } from 'lodash';

// tslint:disable:no-magic-numbers

describe('DtMicroChart', () => {

});
