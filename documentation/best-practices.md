---
title: 'Best practices and patterns'
postid: 'angular-components-best-practices'
order: 5
tags:
  - 'documentation'
  - 'angular'
  - 'best practice'
  - 'guideline'
  - 'patterns'
---

# Best practices and patterns

## RxJs

### Handling the unsubscribe

#### Subscriptions

The best way to work with subscription properties is to initialize it with an
empty subscription so you do not need to check for it when unsubscribing. Doing
this is useful if you only have a small amount of subscriptions to handle or if
you use the `replay` or `sharedReplay` operator. See the
[Destroy Subject pattern](#destroy-subject-pattern) on how to handle multiple
subscriptions/observables.

**Bad:**

```ts
export class MyComponent {
  private _someObservable: Observable<any>;
  private _someObservableSubscription: Subscription;

  ngAfterViewInit() {
    this._someObservableSubscription = this._someObservable.subscribe(() => /* some code */);
  }

  ngOnDestroy(): void {
    // We need to check if the subscription has been assigned.
    if (this._someObservableSubscription) {
      this._someObservableSubscription.unsubscribe();
    }
  }
}
```

**Good:**

```ts
export class MyComponent {
  private _someObservable: Observable<any>;
  // Initialize it with an empty subscription so there is no need to check whether
  // a subscription has been assigned, because there is always one.
  private _someObservableSubscription = Subscription.EMPTY;

  ngAfterViewInit() {
    this._someObservableSubscription = this._someObservable.subscribe(() => /* some code */);
  }

  ngOnDestroy(): void {
    // No check required
    this._someObservableSubscription.unsubscribe();
  }
}
```

#### Destroy subject pattern

When having a lot of subscription this pattern comes in handy as you do not need
to unsubscribe each observable manually. It takes advantage of a combination of
a subject called `destroy` that is "nexted" in the ngOnDestroy hook and the
operator `takeUntil`.

**Caution** when using this pattern with `replay` or `sharedReplay`. This may
lead to unwanted side effects.

_Example:_

```ts
export class MyComponent {
  // Create a new Subject called _destroy that will be "nexted" in the ngOnDestroy hook.
  private _destroy = new Subject<void>();

  private _someObservable: Observable<any>;
  private _anotherObservable: Observable<any>;

  constructor() {
    // When using takeUntil(this._destroy) there is no need to manually unsubscribe.
    this._someObservable.pipe(takeUntil(this._destroy)).subscribe(() => /* some code */);
    this._anotherObservable.pipe(takeUntil(this._destroy)).subscribe(() => /* some code */);
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
```
