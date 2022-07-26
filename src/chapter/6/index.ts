import createPages from "./pages";
import createFragmentRouter from "./fragmentRouter";
import createHistoryRouter from "./historyRouter";

const NAV_BTN_SELECTOR = "button[data-navigate]";

const container = document.querySelector("main")!;
const pages = createPages(container);
const fragmentRouter = createFragmentRouter();
const historyRouter = createHistoryRouter();

fragmentRouter
  .addRoutes("#/", pages.home)
  .addRoutes("#/list", pages.list)
  .addRoutes("#/list/:id", pages.detail)
  .addRoutes("#/list/:id/:anotherId", pages.anotherDetail)
  .setNotFound(pages.notFound)
  .start();

historyRouter
  .addRoutes("/", pages.home)
  .addRoutes("/list", pages.list)
  .addRoutes("/list/:id", pages.detail)
  .addRoutes("/list/:id/:anotherId", pages.anotherDetail)
  .setNotFound(pages.notFound)
  .start();

document.body.addEventListener("click", (e) => {
  const element = e.target as HTMLElement;
  const { navigate } = element.dataset;

  if (element.matches(NAV_BTN_SELECTOR) && navigate) {
    fragmentRouter.navigate(navigate);
  }
});
