import { State, Todo } from "..";

const getTodoCount = (todos: Todo[]) => {
  const notCompleted = todos.filter((todo) => !todo.completed);
  const { length } = notCompleted;

  if (length === 1) {
    return "1 Item left";
  }

  return `${length} Items left`;
};

export default (targetElement: Element, { todos }: State) => {
  const newCount = targetElement.cloneNode(true) as Element;
  newCount.textContent = getTodoCount(todos);
  return newCount;
};
