import Fps from "./Fps";
import modelFactory, { State } from "./model/model";
import registry from "./registry";
import applyDiff from "./utils/applyDiff";

import appView from "./view/app";
import counterView from "./view/counter";
import filtersView from "./view/filters";
import todosView from "./view/todos";

Fps.init();

registry.add("app", appView);
registry.add("todos", todosView);
registry.add("counter", counterView);
registry.add("filters", filtersView);

const model = modelFactory();

const events = {
  deleteItem: (index: number) => {
    model.deleteItem(index);
    render(model.getState());
  },
  addItem: (text: string) => {
    model.addItem(text);
    render(model.getState());
  },
} as const;

export type Events = typeof events;

const render = (state: State) => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector("#root")! as HTMLElement;
    const newMain = registry.renderRoot(main, state, events);
    applyDiff(document.body, main, newMain);
  });
};

render(model.getState());
