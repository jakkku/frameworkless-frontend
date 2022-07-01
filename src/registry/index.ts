import { State } from "..";

interface CloneRoot {
  (root: HTMLElement): HTMLElement;
}

interface View {
  (targetElement: HTMLElement, state: State): HTMLElement;
}

interface Registry {
  [key: string]: View;
}

const registry: Registry = {};

const add = (name: string, view: View) => {
  registry[name] = renderWrapper(view);
};

const renderWrapper = (view: View | CloneRoot) => {
  return (targetElement: HTMLElement, state: State) => {
    const element = view(targetElement, state);
    const childComponents = element.querySelectorAll("[data-component]");

    (Array.from(childComponents) as HTMLElement[]).forEach((target) => {
      const name = (target as HTMLElement).dataset.component!;
      const child = registry[name];

      if (!child) return;

      target.replaceWith(child(target, state));
    });

    return element;
  };
};

const renderRoot = (root: HTMLElement, state: State) => {
  const clone = (root: HTMLElement) => {
    return root.cloneNode(true) as HTMLElement;
  };

  return renderWrapper(clone)(root, state);
};

export default { add, renderRoot };
