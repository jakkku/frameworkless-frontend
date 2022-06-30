import Fps from "./Fps";
import registry from "./registry";
import getTodos from "./utils/getTodos";
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

registry.add("todos", todosView);
registry.add("counter", counterView);
registry.add("filters", filtersView);

const state: State = {
  todos: getTodos(),
  currentFilter: "All",
};

window.requestAnimationFrame(() => {
  const main = document.querySelector(".todoapp")!;
  const newMain = registry.renderRoot(main, state);
  main.replaceWith(newMain);
});
