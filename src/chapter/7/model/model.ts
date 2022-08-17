import getTodos from "../utils/getTodos";

export type Todo = {
  text: string;
  completed: boolean;
};

export type State = {
  currentFilter: "All" | "Active" | "Completed";
  todos: Todo[];
};

const cloneDeep = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

const INITIAL_STATE: State = {
  todos: getTodos(),
  currentFilter: "All",
};

const modelFactory = (initialState = INITIAL_STATE) => {
  const state = cloneDeep(initialState);

  const getState = () => Object.freeze(cloneDeep(state));

  const addItem = (text: string) => {
    if (!text) {
      return;
    }

    state.todos.push({
      text,
      completed: false,
    });
  };

  const deleteItem = (index: number) => {
    state.todos.splice(index, 1);
  };

  return { addItem, deleteItem, getState };
};

export default modelFactory;
