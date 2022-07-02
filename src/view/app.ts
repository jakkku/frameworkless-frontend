let template: HTMLTemplateElement;

const createAppElement = () => {
  if (!template) {
    template = document.getElementById("todo-app") as HTMLTemplateElement;
  }

  return (template.content.firstElementChild as HTMLElement).cloneNode(true);
};

export default (target: HTMLElement) => {
  const newApp = target.cloneNode(true) as HTMLElement;

  newApp.innerHTML = "";
  newApp.appendChild(createAppElement());

  return newApp;
};
