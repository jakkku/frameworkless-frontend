import { Footer } from "./Footer";
import { LIST_EVENTS, List } from "./TodoList";

export type Todo = {
  text: string;
  completed: boolean;
};

export type State = {
  currentFilter: "All" | "Active" | "Completed";
  todos: Todo[];
};

class App extends HTMLElement {
  private state: State;
  private template: HTMLTemplateElement;
  private newTodo: HTMLInputElement;
  private list: List;
  private footer: Footer;

  constructor() {
    super();
    this.state = {
      todos: [],
      currentFilter: "All",
    };
    this.template = document.getElementById("todo-app")! as HTMLTemplateElement;

    const content = this.template.content.firstElementChild!.cloneNode(true);
    this.appendChild(content);

    this.newTodo = this.querySelector(".new-todo")!;
    this.list = document.querySelector("todomvc-list")!;
    this.footer = document.querySelector("todomvc-footer")!;
  }

  addItem(text: string) {
    this.state.todos.push({ text, completed: false });
    this.syncAttributes();
  }

  deleteItem(index: number) {
    this.state.todos.splice(index, 1);
    this.syncAttributes();
  }

  changeFilter(filter: State["currentFilter"]) {
    this.state.currentFilter = filter;
    this.syncAttributes();
  }

  syncAttributes() {
    this.list.todos = this.state.todos;
    this.footer.todos = this.state.todos;
    this.footer.currentFilter = this.state.currentFilter;
  }

  connectedCallback() {
    window.requestAnimationFrame(() => {
      this.newTodo.addEventListener("keypress", (e) => {
        if (
          (e as KeyboardEvent).key === "Enter" &&
          e.target instanceof HTMLInputElement
        ) {
          const inputElement = e.target;

          this.addItem(inputElement.value);
          inputElement.value = "";
        }
      });

      this.list.addEventListener(LIST_EVENTS.DELETE_ITEM, (e) => {
        this.deleteItem((e as CustomEvent).detail.index);
      });

      this.syncAttributes();
    });
  }
}

export default () => window.customElements.define("todomvc-app", App);
