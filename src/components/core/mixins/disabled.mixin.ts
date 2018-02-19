/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { Constructor } from "../base/Constructor";

export interface CanDisable {
    disabled: boolean;
}

// tslint:disable no-any
export const mixinDisabled = <T extends Constructor<{}>>(base: T): Constructor<CanDisable> & T =>
    class extends base {

        // Not sure but tslint complains that this member is never reassigned
        // tslint:disable-next-line:prefer-readonly
        private _disabled = false;

        // noinspection JSUnusedGlobalSymbols
        public get disabled(): any {
            return this._disabled;
        }

        // noinspection JSUnusedGlobalSymbols
        public set disabled(value: any) {
            this._disabled = coerceBooleanProperty(value);
        }
    };
