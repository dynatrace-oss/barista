import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { Input } from "@angular/core";
import { Constructor } from "../base/Constructor";

export interface CanBeChecked {
    checked: boolean;
}

// tslint:disable no-any
export const mixinChecked = <T extends Constructor<{}>> (baseClass: T): Constructor<CanBeChecked> & T => {
    class CheckedMixin extends baseClass {

        // Not sure but tslint complains that this member is never reassigned
        // tslint:disable-next-line:prefer-readonly
        private _checked = false;

        // noinspection JSUnusedGlobalSymbols
        public get checked(): boolean {
            return this._checked;
        }

        // noinspection JSUnusedGlobalSymbols
        @Input()
        public set checked(value: boolean) {
            // Although, we defined value type as a boolean (TS API), we need to be prepared to take any value
            // since it ca be set from HTML, which doesn't validate types
            this._checked = coerceBooleanProperty(value);
        }
    }

    return CheckedMixin;
};
