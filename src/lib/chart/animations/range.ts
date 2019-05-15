import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Directive,
  Renderer2,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewContainerRef,
  OnDestroy,
  SkipSelf,
  Optional,
} from '@angular/core';
import { MousePosition, Range, createRange, updateRange } from './utils';
import { Observable, combineLatest, EMPTY, Subject, ReplaySubject } from 'rxjs';
import { share, takeUntil, tap, map, withLatestFrom } from 'rxjs/operators';
import { addCssClass, removeCssClass } from '@dynatrace/angular-components/core';
import { DtChart } from '../chart';

const DT_RANGE_RELEASED_CLASS = 'dt-chart-range-released';

@Component({
  selector: 'dt-chart-range',
  templateUrl: 'range.html',
  styleUrls: ['range.scss'],
  host: {
    'class': 'dt-chart-range',
    'attr.cdkTrapFocus': 'true',
    'attr.tabIndex': '0',
    'attr.aria-role': 'slider',
    '[attr.aria-label]': '_ariaLabelSelectedArea',
  },
})
export class DtChartRange implements OnDestroy {
  /** @internal Event that emits when a handle receives a mousedown event */
  @Output() readonly _handleDragStarted = new EventEmitter<MouseEvent>();

  _destroy$ = new Subject<void>();
  position$ = new ReplaySubject<Range>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngOnInit(): void {
    // this._chart._mousedown$.subscribe(() => {
    //   this._addOrRemoveReleasedClass(false);
    // });
  }

  // _addListeners(
  //   host: HTMLElement,
  //   mousedown$: Observable<MouseEvent>,
  //   drag$: Observable<MouseEvent>,
  // ): void {

  // }

  _drag(
    host: HTMLElement,
    drag$: Observable<MouseEvent>,
    mouseup$: Observable<MousePosition>
  ): void {

    // Stream that emits if the currently dragged handle is the left or right
    const leftOrRightHandle$ = this._handleDragStarted.pipe(
      map((event) =>
        (event.target as HTMLElement).className.includes('right')
          ? 'right'
          : 'left'
      ));

    // Stream that holds the updated Range on drag
    const updatedRange$ = combineLatest(
      this.position$,
      drag$,
      leftOrRightHandle$
    ).pipe(
      updateRange(host),
      share()
    );

    mouseup$.pipe(
      withLatestFrom(updatedRange$),
      map((data) => data[1])
    ).subscribe((range) => {
      this.position$.next(range);
    });

    updatedRange$.subscribe((range) => {
      this._reflectStyleToElement(range);
    });
  }

  _createRange(
    host: HTMLElement,
    drag$: Observable<MousePosition>,
    currentMousePosition$: Observable<MousePosition>,
    mouseup$: Observable<MousePosition>
  ): void {

    combineLatest(drag$, currentMousePosition$).pipe(
      createRange(host),
      takeUntil(this._destroy$)
    ).subscribe((range: Range) => {
      this._reflectStyleToElement(range);
      this.position$.next(range);
    });

    mouseup$.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._addOrRemoveReleasedClass(true);
    });
  }

  /** @internal */
  _dragHandle(event: MouseEvent): void {
    event.stopImmediatePropagation();
    this._handleDragStarted.emit(event);
  }

  _addOrRemoveReleasedClass(add: boolean): void {
    if (add) {
      addCssClass(this._elementRef.nativeElement, DT_RANGE_RELEASED_CLASS);
    } else {
      removeCssClass(this._elementRef.nativeElement, DT_RANGE_RELEASED_CLASS);
    }
  }

  private _reflectStyleToElement(range: Range): void {
    this._elementRef.nativeElement.style.opacity = '1';
    this._elementRef.nativeElement.style.left = `${range.left}px`;
    this._elementRef.nativeElement.style.width = `${range.width}px`;
  }
}
