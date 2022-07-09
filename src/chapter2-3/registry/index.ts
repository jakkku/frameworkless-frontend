import { Events, State } from "..";

interface CloneRoot {
  (root: HTMLElement): HTMLElement;
}

interface View {
  (targetElement: HTMLElement, state: State, events?: Events): HTMLElement;
}

interface Registry {
  [key: string]: View;
}

const registry: Registry = {};

const add = (name: string, view: View) => {
  registry[name] = renderWrapper(view);
};

const renderWrapper = (view: View | CloneRoot) => {
  return (targetElement: HTMLElement, state: State, events?: Events) => {
    const element = view(targetElement, state, events);
    const childComponents = element.querySelectorAll("[data-component]");

    (Array.from(childComponents) as HTMLElement[]).forEach((target) => {
      const name = (target as HTMLElement).dataset.component!;
      const child = registry[name];

      if (!child) return;

      target.replaceWith(child(target, state, events));
    });

    return element;
  };
};

const renderRoot = (root: HTMLElement, state: State, events: Events) => {
  const clone = (root: HTMLElement) => {
    return root.cloneNode(true) as HTMLElement;
  };

  return renderWrapper(clone)(root, state, events);
};

export default { add, renderRoot };
