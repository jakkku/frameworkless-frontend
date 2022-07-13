import { State } from "./App";

export const FOOTER_EVENTS = {
  CHANGE_FILTER: "CHANGE_FILTER",
} as const;

export class Footer extends HTMLElement {
  private template: HTMLTemplateElement;
  private filters: HTMLAnchorElement[];

  constructor() {
    super();
    this.template = document.getElementById("footer")! as HTMLTemplateElement;

    const content = this.template.content.firstElementChild!.cloneNode(true);
    this.appendChild(content);

    this.filters = Array.from(this.querySelectorAll("li a"));
  }

  static get observedAttributes() {
    return ["todos", "currentFilter"];
  }

  get todos() {
    return JSON.parse(this.getAttribute("todos") ?? "[]");
  }

  set todos(todos: State["todos"]) {
    this.setAttribute("todos", JSON.stringify(todos));
  }

  get currentFilter() {
    try {
      return JSON.parse(this.getAttribute("currentFilter") ?? "");
    } catch (e) {
      return "All";
    }
  }

  set currentFilter(filter: State["currentFilter"]) {
    this.setAttribute("currentFilter", JSON.stringify(filter));
  }

  updateFooter() {
    this.filters.forEach((a) => {
      a.textContent === this.currentFilter
        ? a.classList.add("selected")
        : a.classList.remove("selected");
    });
  }

  connectedCallback() {
    this.updateFooter();
  }

  attributesChangedCallback() {
    this.updateFooter();
  }
}

export default () => window.customElements.define("todomvc-footer", Footer);
