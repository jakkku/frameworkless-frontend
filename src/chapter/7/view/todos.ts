import { Events } from "..";
import { State, Todo } from "../model/model";

let template: HTMLTemplateElement;

const createNewTodoNode = () => {
  if (!template) {
    template = document.getElementById("todo-item") as HTMLTemplateElement;
  }

  return template.content.firstElementChild!.cloneNode(true) as HTMLElement;
};

const getTodoElement = (todo: Todo, index: number) => {
  const { text, completed } = todo;

  const element = createNewTodoNode();

  (element.querySelector("input.edit") as HTMLInputElement).value = text;
  (element.querySelector("label") as HTMLLabelElement).textContent = text;

  if (completed) {
    element.classList.add("completed");
    (element.querySelector("input.toggle") as HTMLInputElement).checked = true;
  }

  (element.querySelector(
    "button.destroy"
  ) as HTMLButtonElement)!.dataset.index = index.toString();

  return element;
};

export default (
  targetElement: HTMLElement,
  { todos }: State,
  events?: Events
) => {
  const newTodoList = targetElement.cloneNode(true) as HTMLElement;

  newTodoList.innerHTML = "";

  todos
    .map((todo, index) => getTodoElement(todo, index))
    .forEach((element) => {
      newTodoList.appendChild(element);
    });

  events?.deleteItem &&
    newTodoList.addEventListener("click", (e) => {
      const button = e.target as HTMLButtonElement;
      const todoIndex = button.dataset.index;

      if (button.matches("button.destroy") && todoIndex) {
        events.deleteItem(parseInt(todoIndex));
      }
    });

  return newTodoList;
};
