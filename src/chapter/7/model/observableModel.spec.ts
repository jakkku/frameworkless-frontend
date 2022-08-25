import { beforeEach, describe, expect, test } from "vitest";

import observableModelFactory from "./observableModel";

describe("observable model", () => {
  let model: ReturnType<typeof observableModelFactory>;

  beforeEach(() => {
    model = observableModelFactory();
  });

  test("listeners should be invoked immediatly", () => {
    let counter = 0;

    model.addChangeListener((_data) => {
      counter++;
    });

    expect(counter).toBe(1);
  });

  test("listeners should be invoked when changing data", () => {
    let counter = 0;

    model.addChangeListener((_data) => {
      counter++;
    });
    model.addItem("dummy");

    expect(counter).toBe(2);
  });

  test("listeners should be removed when unsubscribing", () => {
    let counter = 0;
    const unsubscribe = model.addChangeListener((_data) => {
      counter++;
    });

    unsubscribe();
    model.addItem("dummy");

    expect(counter).toBe(1);
  });
});
