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
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  OnChanges,
  NgZone,
  SimpleChanges,
} from '@angular/core';
import { Subject, fromEvent, merge, of } from 'rxjs';
import { takeUntil, debounceTime, mapTo, skip } from 'rxjs/operators';
import {
  normalizeToRange,
  lerp,
  easeOut,
  easeWithOptions,
  DEFAULT_GENERATION_OPTIONS,
} from '@dynatrace/design-tokens-ui/shared';
import { FluidPaletteGenerationOptions } from '@dynatrace/shared/barista-definitions';

@Component({
  selector: 'design-tokens-ui-distribution-curve',
  templateUrl: './distribution-curve.component.html',
  styleUrls: ['./distribution-curve.component.scss'],
})
export class DistributionCurveComponent
  implements AfterViewInit, OnChanges, OnDestroy {
  /** Fired on ngChanges */
  private _stateChanges$ = new Subject<FluidPaletteGenerationOptions>();

  private _destroy$ = new Subject<void>();

  @ViewChild('interpolationCanvas')
  private canvas: ElementRef<HTMLCanvasElement>;

  /** Palette generation settings */
  @Input() generationOptions = { ...DEFAULT_GENERATION_OPTIONS };

  /** Animation duration in ms */
  @Input() animationDuration: number = 300;

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
      of(this.generationOptions, mapTo(false)), // First draw immediately after view init
      this._stateChanges$.pipe(debounceTime(200), skip(1), mapTo(true)), // Animate on state changes (skip initial event)
      fromEvent(window, 'resize').pipe(debounceTime(300)).pipe(mapTo(false)),
    )
      .pipe(takeUntil(this._destroy$))
      .subscribe((animate: boolean) => {
        this._resizeCanvas();
        if (animate) {
          this._animateCanvas();
        } else {
          this._renderCanvas();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._stateChanges$.next(changes.generationOptions.currentValue);
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
