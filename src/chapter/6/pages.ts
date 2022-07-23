export type Component = () => void;

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

  return { home, list, notFound };
};
