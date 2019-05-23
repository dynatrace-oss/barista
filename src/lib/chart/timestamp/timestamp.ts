import {
  Component,
  ChangeDetectorRef,
  Renderer2,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  ViewChildren,
  QueryList,
  OnDestroy,
} from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'dt-chart-timestamp',
  templateUrl: 'timestamp.html',
  styleUrls: ['timestamp.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dt-chart-timestamp',
  },
})
export class DtChartTimestamp implements OnDestroy {

  private _hidden = true;
  private _destroy$ = new Subject<void>();

  @ViewChildren('selector')
  private _selector: QueryList<ElementRef<HTMLDivElement>>;

  @Input()
  get hidden(): boolean { return this._hidden; }
  set hidden(hidden: boolean) {
    this._hidden = hidden;
    this._changeDetectorRef.markForCheck();
  }

  constructor(
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal */
  _setPosition(x: number): void {

    this._selector.changes.pipe(
      take(1),
      takeUntil(this._destroy$)
    ).subscribe(() => {
      this._renderer.setStyle(
        this._selector.first.nativeElement,
        'transform',
        `translateX(${x}px)`
      );
    });
  }
}
