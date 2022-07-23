import { Component } from "./pages";

type Routes = { fragment: string; component: Component }[];

export default () => {
  const routes: Routes = [];
  let notFound = () => {};

  const checkRoutes = () => {
    const currentRoute = routes.find((route) => {
      return route.fragment === window.location.hash;
    });

    if (!currentRoute) {
      notFound();
      return;
    }

    currentRoute.component();
  };

  const router = {
    addRoutes: (fragment: string, component: Component) => {
      routes.push({ fragment, component });
      return router;
    },
    setNotFound: (component: Component) => {
      notFound = component;
      return router;
    },
    start: () => {
      window.addEventListener("hashchange", checkRoutes);

      if (!window.location.hash) {
        window.location.hash = "#/";
      }

      checkRoutes();

      return router;
    },
  };

  return router;
};
