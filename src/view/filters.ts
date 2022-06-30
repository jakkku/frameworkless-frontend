import { State } from "..";

export default (targetElement: Element, { currentFilter }: State) => {
  const newFilters = targetElement.cloneNode(true) as Element;

  Array.from(newFilters.querySelectorAll("li a")).forEach((a) => {
    if (a.textContent === currentFilter) {
      a.classList.add("selected");
    } else {
      a.classList.remove("selected");
    }
  });

  return newFilters;
};
