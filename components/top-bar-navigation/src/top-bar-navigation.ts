import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
  ViewEncapsulation,
} from '@angular/core';

/**
 * A navigation bar for first level navigation on the pages top area.
 *
 * ```html
 * <dt-top-bar-navigation aria-label="Main">
 *   <dt-top-bar-navigation-item align="start">
 *     <a routerLink="" dt-top-bar-action><dt-icon name="agent"></dt-icon></a>
 *   </dt-top-bar-navigation-item>
 *   <dt-top-bar-navigation-item align="end">
 *     <a dt-top-bar-action hasProblem>61</a>
 *   </dt-top-bar-navigation-item>
 *   <dt-top-bar-navigation-item align="end" >
 *     <button dt-top-bar-action><dt-icon name="user-uem"></dt-icon></button>
 *   </dt-top-bar-navigation-item>
 * </dt-top-bar-navigation>
 * ```
 */
@Component({
  selector: 'dt-top-bar-navigation',
  exportAs: 'dtTopBarNavigation',
  templateUrl: 'top-bar-navigation.html',
  styleUrls: ['top-bar-navigation.scss'],
  host: {
    class: 'dt-top-bar-navigation',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DtTopBarNavigation {
  /** The aria label of the navigation element */
  @Input('aria-label') ariaLabel = 'Main';
}

/**
 * A Directive to align a navigation item weather left or right.
 */
@Directive({
  selector: 'dt-top-bar-navigation-item, [dtTopBarNavigationItem]',
  exportAs: 'dtTopBarNavigationItem',
  host: {
    class: 'dt-top-bar-navigation-item',
  },
})
export class DtTopBarNavigationItem {
  /** If the item is placed on the left side or right side of the top navigation bar */
  @Input() align: 'start' | 'end' = 'start';
}

/**
 * A Directive to apply the hover styles to a navigation item.
 */
@Directive({
  selector: '[dtTopBarAction]',
  exportAs: 'dtTopBarAction',
  host: {
    class: 'dt-top-bar-action',
    '[class.dt-top-bar-action-has-problem]': 'hasProblem',
  },
})
export class DtTopBarAction {
  /** Indicates if the item has a problem state */
  @Input()
  get hasProblem(): boolean {
    return this._hasProblem;
  }
  set hasProblem(active: boolean) {
    this._hasProblem = coerceBooleanProperty(active);
  }
  /** The current state if an item has a problem */
  private _hasProblem = false;
}
