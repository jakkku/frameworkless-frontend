import { Footer, FOOTER_EVENTS } from "./Footer";
import { LIST_EVENTS, List } from "./TodoList";

export type Todo = {
  text: string;
  completed: boolean;
};

export type State = {
  filter: "All" | "Active" | "Completed";
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
      filter: "All",
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

  toggleItem(targetIndex: number) {
    this.state.todos = this.state.todos.map((todo, index) => {
      if (targetIndex !== index) {
        return todo;
      }

      return { ...todo, completed: !todo.completed };
    });
    this.syncAttributes();
  }

  changeFilter(filter: State["filter"]) {
    this.state.filter = filter;
    this.syncAttributes();
  }

  clearCompleted() {
    this.state.todos = this.state.todos.filter(({ completed }) => !completed);
    this.syncAttributes();
  }

  syncAttributes() {
    this.list.todos = this.state.todos;
    this.footer.todos = this.state.todos;
    this.footer.filter = this.state.filter;
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
        const targetIndex = parseInt((e as CustomEvent).detail.index);
        this.deleteItem(targetIndex);
      });
      this.list.addEventListener(LIST_EVENTS.TOGGLE_ITEM, (e) => {
        const targetIndex = parseInt((e as CustomEvent).detail.index);
        this.toggleItem(targetIndex);
      });

      this.footer.addEventListener(FOOTER_EVENTS.CHANGE_FILTER, (e) => {
        this.changeFilter((e as CustomEvent).detail.filter);
      });
      this.footer.addEventListener(FOOTER_EVENTS.CLEAR_COMPLETED, () => {
        this.clearCompleted();
      });

      this.syncAttributes();
    });
  }
}

export default () => window.customElements.define("todomvc-app", App);
