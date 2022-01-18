/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
  ChangeDetectorRef,
  Directive,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  Optional,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { stringify } from '@dynatrace/barista-components/core';

import { DtContainerBreakpointObserver } from './container-breakpoint-observer';
import { getNoDtContainerBreakpointObserverError } from './container-breakpoint-observer-errors';

export class DtIfContainerBreakpointContext {
  // eslint-disable-next-line
  $implicit: boolean | null = null;
  // eslint-disable-next-line
  dtIfContainerBreakpoint: boolean | null = null;
}

/**
 * A structural directive much like Angulars `ngIf`,
 * that allows showing and hiding of elements based
 * on a provided container query.
 *
 * NOTE:
 * This directive works very similar to Angulars `ngIf` directive,
 * some code (e.g. the _updateView method) has been taken from there.
 * See: https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_if.ts
 */
@Directive({ selector: '[dtIfContainerBreakpoint]' })
export class DtIfContainerBreakpoint implements OnDestroy {
  /** The query to observe and evaluate as the condition for showing a template. */
  @Input()
  set dtIfContainerBreakpoint(query: string | string[]) {
    this._breakpointSubscription.unsubscribe();

    this._breakpointObserver.observe(query).subscribe((event) => {
      this._context.$implicit = this._context.dtIfContainerBreakpoint =
        event.matches;
      this._updateView();
    });

    this._updateView();
  }

  /** A template to show if the breakpoint does match. */
  @Input()
  set dtIfContainerBreakpointThen(
    templateRef: TemplateRef<DtIfContainerBreakpointContext> | null,
  ) {
    assertTemplate('dtIfContainerBreakpointThen', templateRef);
    this._thenTemplateRef = templateRef;
    this._thenViewRef = null; // clear previous view if any.
    this._updateView();
  }

  /** A template to show if the breakpoint does not match. */
  @Input()
  set dtIfContainerBreakpointElse(
    templateRef: TemplateRef<DtIfContainerBreakpointContext> | null,
  ) {
    assertTemplate('dtIfContainerBreakpointElse', templateRef);
    this._elseTemplateRef = templateRef;
    this._elseViewRef = null; // clear previous view if any.
    this._updateView();
  }

  private _context = new DtIfContainerBreakpointContext();
  /** TemplateRef that is rendered if  the query matches. */
  private _thenTemplateRef: TemplateRef<DtIfContainerBreakpointContext> | null =
    null;

  /** TemplateRef that is rendered if  the query does not match. */
  private _elseTemplateRef: TemplateRef<DtIfContainerBreakpointContext> | null =
    null;

  /** ViewRef of the rendered thenTemplateRef. */
  private _thenViewRef: EmbeddedViewRef<DtIfContainerBreakpointContext> | null =
    null;

  /** ViewRef of the rendered elseTemplateRef. */
  private _elseViewRef: EmbeddedViewRef<DtIfContainerBreakpointContext> | null =
    null;

  /** Subscription of the observed query on the container-breakpoint-observer. */
  private _breakpointSubscription = Subscription.EMPTY;

  constructor(
    @Optional() private _breakpointObserver: DtContainerBreakpointObserver,
    private _viewContainer: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef,
    templateRef: TemplateRef<DtIfContainerBreakpointContext>,
  ) {
    this._thenTemplateRef = templateRef;

    if (!this._breakpointObserver) {
      throw getNoDtContainerBreakpointObserverError();
    }
  }

  ngOnDestroy(): void {
    this._breakpointSubscription.unsubscribe();
  }

  private _updateView(): void {
    // eslint-disable-next-line no-extra-boolean-cast
    if (Boolean(this._context.$implicit)) {
      if (!this._thenViewRef) {
        this._viewContainer.clear();
        this._elseViewRef = null;
        if (this._thenTemplateRef) {
          this._thenViewRef = this._viewContainer.createEmbeddedView(
            this._thenTemplateRef,
            this._context,
          );
          this._changeDetectorRef.markForCheck();
        }
      }
    } else {
      if (!this._elseViewRef) {
        this._viewContainer.clear();
        this._thenViewRef = null;
        if (this._elseTemplateRef) {
          this._elseViewRef = this._viewContainer.createEmbeddedView(
            this._elseTemplateRef,
            this._context,
          );
          this._changeDetectorRef.markForCheck();
        }
      }
    }
  }
}

function assertTemplate(
  property: string,
  templateRef: TemplateRef<DtIfContainerBreakpointContext> | null,
): void {
  /* eslint-disable @typescript-eslint/unbound-method */
  const isTemplateRefOrNull = !!(
    !templateRef || templateRef.createEmbeddedView
  );
  /* eslint-enable @typescript-eslint/unbound-method */
  if (!isTemplateRefOrNull) {
    throw new Error(
      `${property} must be a TemplateRef, but received '${stringify(
        templateRef,
      )}'.`,
    );
  }
}
