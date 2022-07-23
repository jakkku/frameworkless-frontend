import createPages from "./pages";
import createRouter from "./router";

const container = document.querySelector("main")!;
const pages = createPages(container);
const router = createRouter();

router
  .addRoutes("#/", pages.home)
  .addRoutes("#/list", pages.list)
  .setNotFound(pages.notFound)
  .start();
