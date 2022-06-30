import { State } from "..";

interface CloneRoot {
  (root: Element): Element;
}

interface View {
  (targetElement: Element, state: State): Element;
}

interface Registry {
  [key: string]: View;
}

const registry: Registry = {};

const add = (name: string, view: View) => {
  registry[name] = renderWrapper(view);
};

const renderWrapper = (view: View | CloneRoot) => {
  return (targetElement: Element, state: State) => {
    const element = view(targetElement, state);
    const childComponents = element.querySelectorAll("[data-component]");

    Array.from(childComponents).forEach((target) => {
      const name = (target as HTMLElement).dataset.component!;
      const child = registry[name];

      if (!child) return;

      target.replaceWith(child(target, state));
    });

    return element;
  };
};

const renderRoot = (root: Element, state: State) => {
  const clone = (root: Element) => {
    return root.cloneNode(true) as Element;
  };

  return renderWrapper(clone)(root, state);
};

export default { add, renderRoot };
