import { Arrays } from "./Arrays";

describe("Arrays", () => {
  describe("from", () => {
    it("when array given, should return the same object", () => {
      const value = ["a", "b", "c"];

      const result = Arrays.from(value);

      expect(result).toBe(value);
    });

    it("when simple value given, should return array with 1 element", () => {
      const value = "banana";

      const result = Arrays.from(value);

      expect(result).toEqual([value]);
    });

    it("when object given, should return array with object", () => {
      const value = {
        a: 1,
        b: 2,
      };

      const result = Arrays.from(value);

      expect(result).toEqual([value]);
    });

    it("when undefined given, should return empty array", () => {
      const result = Arrays.from(undefined);

      expect(result).toEqual([]);
    });

    it("when null given, should return empty array", () => {
      // tslint:disable-next-line:no-null-keyword
      const result = Arrays.from(null);

      expect(result).toEqual([]);
    });

    it("when empty string given, should return array with string", () => {
      // tslint:disable-next-line:no-null-keyword
      const result = Arrays.from("");

      expect(result).toEqual([""]);
    });

    it("when 0 given, should return array with 0", () => {
      // tslint:disable-next-line:no-null-keyword
      const result = Arrays.from(0);

      expect(result).toEqual([0]);
    });
  });

  describe("isEmpty", () => {
    it("when empty array given, should return true", () => {
      const result = Arrays.isEmpty([]);

      expect(result).toBeTruthy();
    });

    it("when non-empty array given, should return false", () => {
      const result = Arrays.isEmpty(["a", "b"]);

      expect(result).toBeFalsy();
    });

    it("when array with undefined given, should return false", () => {
      const result = Arrays.isEmpty([undefined]);

      expect(result).toBeFalsy();
    });

    it("when array with null given, should return false", () => {
      // tslint:disable-next-line:no-null-keyword
      const result = Arrays.isEmpty([null]);

      expect(result).toBeFalsy();
    });
  });
});
