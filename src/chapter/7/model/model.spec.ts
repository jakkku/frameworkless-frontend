import modelFactory from "./model";
import { describe, expect, test } from "vitest";

describe("external state", () => {
  test("should add an item", () => {
    const state = modelFactory();
    const { todos: prevTodos } = state.getState();

    state.addItem("dummy");

    const { todos } = state.getState();

    expect(todos.length).toBe(prevTodos.length + 1);
    expect(todos.at(-1)).toEqual({ text: "dummy", completed: false });
  });

  test("should not add an item when a falsy text is provided", () => {
    const state = modelFactory();
    const { todos: prevTodos } = state.getState();

    state.addItem("");

    const { todos } = state.getState();

    expect(todos.length).toBe(prevTodos.length);
  });
});
