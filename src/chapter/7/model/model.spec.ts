import modelFactory from "./model";
import { beforeEach, describe, expect, test } from "vitest";

describe("external state", () => {
  let model: ReturnType<typeof modelFactory>;

  beforeEach(() => {
    model = modelFactory();
  });

  test("should add an item", () => {
    const { todos: prevTodos } = model.getState();

    model.addItem("dummy");

    const { todos } = model.getState();

    expect(todos.length).toBe(prevTodos.length + 1);
    expect(todos.at(-1)).toEqual({ text: "dummy", completed: false });
  });

  test("should not add an item when a falsy text is provided", () => {
    const { todos: prevTodos } = model.getState();

    model.addItem("");

    const { todos } = model.getState();

    expect(todos.length).toBe(prevTodos.length);
  });
});
