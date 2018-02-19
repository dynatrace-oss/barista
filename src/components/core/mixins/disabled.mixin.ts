/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { Constructor } from "./constructor";

/** @docs-private */
export interface CanDisable {
    disabled: boolean;
}

// tslint:disable no-any
export const mixinDisabled = <T extends Constructor<{}>>(base: T): Constructor<CanDisable> & T =>
    class extends base {
        private _disabled = false;

        public get disabled(): any { return this._disabled; }
        public set disabled(value: any) { this._disabled = coerceBooleanProperty(value); }

        public constructor(...args: any[]) { super(...args); }
    };
