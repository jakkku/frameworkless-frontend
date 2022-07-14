import { State } from "./App";

export const FOOTER_EVENTS = {
  CHANGE_FILTER: "CHANGE_FILTER",
  CLEAR_COMPLETED: "CLEAR_COMPLETED",
} as const;

export class Footer extends HTMLElement {
  private template: HTMLTemplateElement;
  private filters: HTMLAnchorElement[];
  private clearButton: HTMLButtonElement;

  constructor() {
    super();
    this.template = document.getElementById("footer")! as HTMLTemplateElement;

    const content = this.template.content.firstElementChild!.cloneNode(true);
    this.appendChild(content);

    this.filters = Array.from(this.querySelectorAll("li a"));
    this.clearButton = this.querySelector(".clear-completed")!;
  }

  static get observedAttributes() {
    return ["todos", "filter"];
  }

  get todos() {
    return JSON.parse(this.getAttribute("todos") ?? "[]");
  }

  set todos(todos: State["todos"]) {
    this.setAttribute("todos", JSON.stringify(todos));
  }

  get filter() {
    try {
      return JSON.parse(this.getAttribute("filter") ?? "");
    } catch (e) {
      return "All";
    }
  }

  set filter(filter: State["filter"]) {
    this.setAttribute("filter", JSON.stringify(filter));
  }

  updateFooter() {
    this.filters.forEach((a) => {
      a.textContent === this.filter
        ? a.classList.add("selected")
        : a.classList.remove("selected");
    });
  }

  connectedCallback() {
    this.filters.forEach((a) => {
      a.addEventListener("click", (e) => {
        if (e.target instanceof HTMLAnchorElement) {
          const event = new CustomEvent(FOOTER_EVENTS.CHANGE_FILTER, {
            detail: {
              filter: e.target.textContent,
            },
          });

          this.dispatchEvent(event);
        }
      });
    });

    this.clearButton.addEventListener("click", () => {
      const event = new CustomEvent(FOOTER_EVENTS.CLEAR_COMPLETED);
      this.dispatchEvent(event);
    });

    this.updateFooter();
  }

  attributeChangedCallback() {
    this.updateFooter();
  }
}

export default () => window.customElements.define("todomvc-footer", Footer);
