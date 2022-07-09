import Fps from "./Fps";
import registry from "./registry";
import applyDiff from "./utils/applyDiff";
import getTodos from "./utils/getTodos";

import appView from "./view/app";
import counterView from "./view/counter";
import filtersView from "./view/filters";
import todosView from "./view/todos";

export type Todo = {
  text: string;
  completed: boolean;
};

export type State = {
  currentFilter: "All" | "Active" | "Completed";
  todos: Todo[];
};

Fps.init();

registry.add("app", appView);
registry.add("todos", todosView);
registry.add("counter", counterView);
registry.add("filters", filtersView);

const state: State = {
  todos: getTodos(),
  currentFilter: "All",
};

const events = {
  deleteItem: (index: number) => {
    state.todos.splice(index, 1);
    render();
  },
  addItem: (text: string) => {
    state.todos.push({
      text,
      completed: false,
    });
    render();
  },
} as const;
export type Events = typeof events;

const render = () => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector("#root")! as HTMLElement;
    const newMain = registry.renderRoot(main, state, events);
    applyDiff(document.body, main, newMain);
  });
};

render();
