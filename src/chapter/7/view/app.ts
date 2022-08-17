import { Events } from "..";
import { State } from "../model/model";

let template: HTMLTemplateElement;

const createAppElement = () => {
  if (!template) {
    template = document.getElementById("todo-app") as HTMLTemplateElement;
  }

  return (template.content.firstElementChild as HTMLElement).cloneNode(true);
};

const addEvents = (target: HTMLElement, events: Events) => {
  const newTodoInput = target.querySelector(".new-todo") as HTMLInputElement;

  newTodoInput?.addEventListener("keypress", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      events.addItem(newTodoInput.value);
      newTodoInput.value = "";
    }
  });
};

export default (target: HTMLElement, state: State, events?: Events) => {
  const newApp = target.cloneNode(true) as HTMLElement;

  newApp.innerHTML = "";
  newApp.appendChild(createAppElement());

  events && addEvents(newApp, events);

  return newApp;
};
