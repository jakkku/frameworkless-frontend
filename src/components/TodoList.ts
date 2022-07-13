import { Todo } from "./App";

const TEMPLATE = '<ul class="todo-list"></ul>';

export const LIST_EVENTS = {
  DELETE_ITEM: "DELETE_ITEM",
} as const;

export class List extends HTMLElement {
  private itemTemplate: HTMLTemplateElement;
  private list: HTMLElement;

  constructor() {
    super();
    this.innerHTML = TEMPLATE;
    this.itemTemplate = document.getElementById(
      "todo-item"
    )! as HTMLTemplateElement;
    this.list = this.querySelector("ul")!;
  }

  static get observedAttributes() {
    return ["todos"];
  }

  get todos() {
    return JSON.parse(this.getAttribute("todos") ?? "[]");
  }

  set todos(newTodos: Todo[]) {
    this.setAttribute("todos", JSON.stringify(newTodos));
  }

  onDeleteItem(index: string) {
    const event = new CustomEvent(LIST_EVENTS.DELETE_ITEM, {
      detail: { index },
    });
    this.dispatchEvent(event);
  }

  createNewTodoNode() {
    return this.itemTemplate.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
  }

  getTodoElement(todo: Todo, index: number): HTMLElement {
    const { text, completed } = todo;
    const todoElement = this.createNewTodoNode();

    (todoElement.querySelector("input.edit") as HTMLInputElement).value = text;
    (todoElement.querySelector("label") as HTMLLabelElement).textContent = text;

    if (completed) {
      todoElement.classList.add("completed");
      (todoElement.querySelector("input.toggle") as HTMLInputElement).checked =
        true;
    }

    (
      todoElement.querySelector("button.destroy") as HTMLButtonElement
    ).dataset.index = index.toString();

    return todoElement;
  }

  updateList() {
    this.list.innerHTML = "";
    this.todos
      .map(this.getTodoElement.bind(this))
      .forEach((el) => this.list.appendChild(el));
  }

  connectedCallback() {
    this.list.addEventListener("click", (e) => {
      const element = e.target as HTMLElement;

      if (element.matches("button.destroy") && element.dataset.index) {
        this.onDeleteItem(element.dataset.index);
      }
    });

    this.updateList();
  }

  attributeChangedCallback() {
    this.updateList();
  }
}

export default () => window.customElements.define("todomvc-list", List);
