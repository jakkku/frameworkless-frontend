import { State, Todo } from "..";

let template: HTMLTemplateElement;

const createNewTodoNode = () => {
  if (!template) {
    template = document.getElementById("todo-item") as HTMLTemplateElement;
  }

  return template.content.firstElementChild!.cloneNode(true) as HTMLElement;
};

const getTodoElement = (todo: Todo) => {
  const { text, completed } = todo;

  const element = createNewTodoNode();

  (element.querySelector("input.edit") as HTMLInputElement).value = text;
  (element.querySelector("label") as HTMLLabelElement).textContent = text;

  if (completed) {
    element.classList.add("completed");
    (element.querySelector("input.toggle") as HTMLInputElement).checked = true;
  }

  return element;
};

export default (targetElement: HTMLElement, { todos }: State) => {
  const newTodoList = targetElement.cloneNode(true) as HTMLElement;

  newTodoList.innerHTML = "";

  todos.map(getTodoElement).forEach((element) => {
    newTodoList.appendChild(element);
  });

  return newTodoList;
};
