/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  OnChanges,
  NgZone,
} from '@angular/core';
import { Subject, fromEvent, merge } from 'rxjs';
import { takeUntil, startWith, debounceTime, mapTo } from 'rxjs/operators';
import {
  easeWithOptions,
  DEFAULT_GENERATION_OPTIONS,
} from '../../../../utils/palette-generation';
import {
  remapRange,
  normalizeToRange,
  lerp,
  easeOut,
} from '../../../../utils/math';

@Component({
  selector: 'design-tokens-ui-contrast-distribution-curve',
  templateUrl: './contrast-distribution-curve.component.html',
  styleUrls: ['./contrast-distribution-curve.component.scss'],
})
export class ConstrastDistributionCurveComponent
  implements AfterViewInit, OnChanges, OnDestroy {
  /** Fired on ngChanges */
  private _stateChanges$ = new Subject<void>();

  private _destroy$ = new Subject<void>();

  @ViewChild('interpolationCanvas')
  private canvas: ElementRef<HTMLCanvasElement>;

  /** Palette generation settings */
  @Input()
  generationOptions = DEFAULT_GENERATION_OPTIONS;

  /** Number of colors that should be generated for the palette */
  @Input()
  distributionCount: number = 5;

  /** Animation duration in ms */
  @Input()
  animationDuration: number = 300;

  /** Fires on start and whenever  */
  @Output()
  distributionsChange = new EventEmitter<number[]>();

  /** Width and height of the canvas */
  private _canvasSize = 0;

  /** The previous generation options, used for the animation */
  private _previousGenerationOptions = {
    ...DEFAULT_GENERATION_OPTIONS,
    lowerExponent: 0,
    upperExponent: 0,
  };

  /** Current animation time in [0-1] range */
  private _currentNormalizedAnimationTime = 0;

  /** Start time of the animation in ms */
  private _animationStartTime = 0;

  /** End time of the animation in ms */
  private _animationEndTime = 0;

  constructor(private _zone: NgZone) {}

  ngAfterViewInit(): void {
    merge(
      this._stateChanges$.pipe(debounceTime(200), mapTo(true)),
      merge(
        fromEvent(window, 'resize').pipe(debounceTime(300)),
        fromEvent(document.body, 'themechange'),
      ).pipe(mapTo(false)),
    )
      .pipe(startWith(true), takeUntil(this._destroy$))
      .subscribe((animate: boolean) => {
        this._resizeCanvas();
        if (animate) {
          this._animateCanvas();
        } else {
          this._renderCanvas();
        }
      });

    this._stateChanges$
      .pipe(debounceTime(700))
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.distributionsChange.emit(this._calculateDistributions());
      });
  }

  ngOnChanges(): void {
    this._stateChanges$.next();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();

    this._stateChanges$.complete();
  }

  /** Resizes the canvas to appear sharp when zoomed in or displayed on high DPI displays */
  private _resizeCanvas(): void {
    let elemWidth = Math.floor(
      this.canvas.nativeElement.getBoundingClientRect().width,
    );

    // Get rid of some blurriness
    if (elemWidth % 2 != 0) {
      elemWidth++;
    }
    this.canvas.nativeElement.style.width = elemWidth + 'px';
    this.canvas.nativeElement.style.height = elemWidth + 'px';

    this._canvasSize = Math.floor(elemWidth * window.devicePixelRatio);

    this.canvas.nativeElement.width = this._canvasSize;
    this.canvas.nativeElement.height = this._canvasSize;
  }

  /** Calculates the output distribution values based on the input options */
  private _calculateDistributions(): number[] {
    const { baseContrast, minContrast, maxContrast } = this.generationOptions;
    return new Array(this.distributionCount)
      .fill(0)
      .map((_, index) => index / (this.distributionCount - 1)) // Normalized distribution
      .map((normDistribution) =>
        easeWithOptions(normDistribution, this.generationOptions),
      ) // Apply easing to distribution
      .map((distributionWithEasing) =>
        distributionWithEasing < 0.5
          ? remapRange(
              0,
              0.5,
              minContrast,
              baseContrast,
              distributionWithEasing,
            )
          : remapRange(
              0.5,
              1,
              baseContrast,
              maxContrast,
              distributionWithEasing,
            ),
      ) // Distribution value in [min, max] range. The base contrast is in the middle.
      .map((value) => Math.round(value * 100) / 100); // Round to two digits
  }

  /** Animates between the current and previous generation options */
  private _animateCanvas(): void {
    this._animationStartTime = new Date().getTime();
    this._animationEndTime = this._animationStartTime + this.animationDuration;
    this._currentNormalizedAnimationTime = 0;

    this._zone.runOutsideAngular(async () => {
      while (this._currentNormalizedAnimationTime < 1) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        this._currentNormalizedAnimationTime = normalizeToRange(
          this._animationStartTime,
          this._animationEndTime,
          new Date().getTime(),
        );
        this._renderCanvas();
      }

      this._previousGenerationOptions = { ...this.generationOptions };
      this._currentNormalizedAnimationTime = 1;
    });
  }

  /** Redraws the canvas with the current animation state */
  private _renderCanvas(): void {
    const context = this.canvas.nativeElement.getContext('2d')!;

    context.resetTransform();
    context.translate(0.5, 0.5); // Pixels must be straddled to appear sharp at 100% zoom https://stackoverflow.com/a/8696641
    context.scale(this._canvasSize, this._canvasSize); // Normalize coordinates from 0 to 1
    context.clearRect(0, 0, 1, 1);

    this._drawGrid(context);

    // Leave some space on the edges to avoid cutoff
    context.translate(0, 0.005);
    context.scale(1, 0.99);

    this._drawCurve(context);
  }

  /** Draws the background grid */
  private _drawGrid(context: CanvasRenderingContext2D): void {
    context.strokeStyle = getComputedStyle(context.canvas).getPropertyValue(
      '--color-neutral-100',
    );
    context.lineWidth = 0.0025;

    context.beginPath();
    context.moveTo(0, 0.5);
    context.lineTo(1, 0.5);
    context.moveTo(0.5, 0);
    context.lineTo(0.5, 1);
    context.stroke();
    context.closePath();
  }

  /** Draws the distribution curve line */
  private _drawCurve(context: CanvasRenderingContext2D): void {
    // Curve
    context.beginPath();

    context.strokeStyle = getComputedStyle(context.canvas).getPropertyValue(
      '--color-maxcontrast',
    );
    context.lineWidth = 0.0075;
    context.moveTo(0, this._interpolateAnimation(0));

    const resolution = 1 / this._canvasSize;
    for (let i = 0; i <= 1; i += resolution) {
      context.lineTo(i, this._interpolateAnimation(i));
    }
    context.stroke();
    context.closePath();
  }

  /** Interpolate between the two animated states with the given upper and lower easing functions and exponents */
  private _interpolateAnimation(t: number): number {
    return lerp(
      easeWithOptions(t, this._previousGenerationOptions),
      easeWithOptions(t, this.generationOptions),
      easeOut(this._currentNormalizedAnimationTime),
    );
  }
}
