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
        public get disabled(): any {
            return this._disabled;
        }

        // noinspection JSUnusedGlobalSymbols
        public set disabled(value: any) {
            this._disabled = coerceBooleanProperty(value);
        }
    };
