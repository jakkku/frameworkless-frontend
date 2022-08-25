import getTodos from "../utils/getTodos";

export type Todo = {
  text: string;
  completed: boolean;
};

export type State = {
  currentFilter: "All" | "Active" | "Completed";
  todos: Todo[];
};

export type Listener = (state: State) => void;

const cloneDeep = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

const INITIAL_STATE: State = {
  todos: getTodos(),
  currentFilter: "All",
};

const observableModelFactory = (initialState = INITIAL_STATE) => {
  const state = cloneDeep(initialState);
  let listeners: any[] = [];

  const addChangeListener = (listener: Listener) => {
    listeners.push(listener);
    listener(Object.freeze(state));

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  const invokeListeners = () => {
    const data = Object.freeze(state);
    listeners.forEach((l) => l(data));
  };

  const getState = () => Object.freeze(cloneDeep(state));

  const addItem = (text: string) => {
    if (!text) {
      return;
    }

    state.todos.push({
      text,
      completed: false,
    });

    invokeListeners();
  };

  const toggleItemCompleted = (index: number) => {
    if (index < 0 || !state.todos[index]) {
      return;
    }

    state.todos[index].completed = !state.todos[index].completed;

    invokeListeners();
  };

  const deleteItem = (index: number) => {
    if (index < 0 || !state.todos[index]) {
      return;
    }

    state.todos.splice(index, 1);

    invokeListeners();
  };

  return {
    addItem,
    deleteItem,
    toggleItemCompleted,
    getState,
    addChangeListener,
  };
};

export default observableModelFactory;
