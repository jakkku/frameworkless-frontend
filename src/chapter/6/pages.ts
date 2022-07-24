export type Component = (params?: Params) => void;
export type Params = { [paramKey: string]: string | number };

export default (container: HTMLElement) => {
  const home: Component = () => {
    container.textContent = "This is Home Page";
  };

  const list: Component = () => {
    container.textContent = "This is List Page";
  };

  const notFound: Component = () => {
    container.textContent = "Page Not Found!";
  };

  const detail: Component = (params: Params = {}) => {
    const { id } = params;
    container.textContent = `This is Detail with id ${id}`;
  };

  const anotherDetail: Component = (params: Params = {}) => {
    const { id, anotherId } = params;
    container.textContent = `This is another Detail with id ${id} and anotherId ${anotherId}`;
  };

  return { home, list, notFound, detail, anotherDetail };
};
