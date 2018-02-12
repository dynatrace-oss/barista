export class Arrays {
  public static from<T>(value: T | T[]): T[] {
    if (Array.isArray(value)) {
      return value;
    }

    if (value === undefined || value === null) {
      return [];
    }

    return [value];
  }

  public static isEmpty<T>(value: T[]): boolean {
    return value.length === 0;
  }
}
