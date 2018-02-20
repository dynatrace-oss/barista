import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { Constructor } from "../base/Constructor";

export interface CanBeDisabled {
    disabled: boolean;
}

// tslint:disable no-any
export const mixinDisabled = <T extends Constructor<{}>> (baseClass: T): Constructor<CanBeDisabled> & T =>
    class extends baseClass {

        // Not sure but tslint complains that this member is never reassigned
        // tslint:disable-next-line:prefer-readonly
        private _disabled = false;

        // noinspection JSUnusedGlobalSymbols
        public get disabled(): boolean {
            return this._disabled;
        }

        // noinspection JSUnusedGlobalSymbols
        public set disabled(value: boolean) {
            // Although, we defined value type as a boolean (TS API), we need to be prepared to take any value
            // since it ca be set from HTML, which doesn't validate types
            this._disabled = coerceBooleanProperty(value);
        }
    };
