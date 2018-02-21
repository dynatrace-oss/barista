import { Constructor } from "../base/Constructor";

export type ObjectConstructor = Constructor<{}>;
export type Mixin = (base: ObjectConstructor) => ObjectConstructor;

export class MixinComposer<T extends ObjectConstructor> {

    // noinspection JSUnusedGlobalSymbols
    public static fromScratch(): MixinComposer<ObjectConstructor> {
        // tslint:disable-next-line max-classes-per-file
        return new MixinComposer(class {}, []);
    }

    // noinspection JSUnusedGlobalSymbols
    public static fromBaseClass<T extends ObjectConstructor>(baseClass: T): MixinComposer<T> {
        return new MixinComposer(baseClass, []);
    }

    private constructor(private readonly baseClass: T, private readonly mixins: Mixin[]) {
    }

    public with<V extends ObjectConstructor>(mixin: (base: ObjectConstructor) => V): MixinComposer<T & V> {
        const mixins = [
            mixin,
            ...this.mixins,
        ];

        return new MixinComposer<T & V>(this.baseClass as T & V, mixins);
    }

    public build(): T {
        return this.mixins.reduce(
            (base: T, mixin: (base: T) => T): T => mixin(base),
            this.baseClass,
        );
    }
}
