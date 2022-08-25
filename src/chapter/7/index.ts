import Fps from "./Fps";
import modelFactory, { State } from "./model/model";
import observableModelFactory from "./model/observableModel";
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

const observableModel = observableModelFactory();
const { addChangeListener, getState: _getState, ...obEvents } = observableModel;

const obRender = (state: State) => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector("#root")! as HTMLElement;
    const newMain = registry.renderRoot(main, state, obEvents);

    applyDiff(document.body, main, newMain);
  });
};

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
  toggleItemCompleted: (index: number) => {
    model.toggleItemCompleted(index);
    render(model.getState());
  },
} as const;

const render = (state: State) => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector("#root")! as HTMLElement;
    const newMain = registry.renderRoot(main, state, events);
    applyDiff(document.body, main, newMain);
  });
};

const USE_OBSERVAL_MODEL = true;

if (USE_OBSERVAL_MODEL) {
  addChangeListener(obRender);
  addChangeListener((state) => {
    console.log(`Current State (${new Date().getTime()})`, state);
  });
  addChangeListener((state) => {
    Promise.resolve().then(() => {
      window.localStorage.setItem("state", JSON.stringify(state));
    });
  });
} else {
  render(model.getState());
}

export type Events = typeof events;
export type ObEvents = typeof obEvents;
