import { Component, Params } from "./pages";

type Route = {
  testRegExp: RegExp;
  component: Component;
  paramNames: ParamNames;
};
type ParamNames = string[];

const ROUTE_PARAMETER_REGEX = /:(\w+)/g;
const URL_FRAGMENT_REGEX = "([^\\/]+)";
const TICKTIME = 250;
const NAV_A_SELECTOR = "a[data-navigation]";

const extractUrlParams = (route: Route, windowHash: string) => {
  if (!route.paramNames.length) {
    return {};
  }

  const params: Params = {};
  const matchs = windowHash.match(route.testRegExp);

  matchs?.shift();
  matchs?.forEach((paramValue, index) => {
    const paramName = route.paramNames[index];
    params[paramName] = paramValue;
  });

  return params;
};

export default () => {
  const routes: Route[] = [];
  let notFound: Component = () => {};
  let lastParamName: string;

  const checkRoutes = () => {
    const { pathname } = window.location;

    if (lastParamName === pathname) return;

    lastParamName = pathname;

    const currentRoute = routes.find(({ testRegExp }) => {
      return testRegExp.test(pathname);
    });

    if (!currentRoute) {
      notFound();
      return;
    }

    const urlParams = extractUrlParams(currentRoute, pathname);
    currentRoute.component(urlParams);
  };

  const router = {
    addRoutes: (path: string, component: Component) => {
      const paramNames: ParamNames = [];

      const parsedPath = path
        .replace(ROUTE_PARAMETER_REGEX, (_, paramName: string) => {
          paramNames.push(paramName);
          return URL_FRAGMENT_REGEX;
        })
        .replace(/\//g, "\\/");

      routes.push({
        testRegExp: new RegExp(`^${parsedPath}$`),
        component,
        paramNames,
      });

      return router;
    },
    setNotFound: (component: Component) => {
      notFound = component;
      return router;
    },
    start: () => {
      checkRoutes();
      window.setInterval(checkRoutes, TICKTIME);

      const navAnchorEls = document.querySelectorAll(NAV_A_SELECTOR);

      Array.from(navAnchorEls).forEach((navAnchor) => {
        navAnchor.addEventListener("click", (e) => {
          const anchor = e.target as HTMLAnchorElement;

          e.preventDefault();
          router.navigate(anchor.href);
        });
      });
    },
    navigate: (path: string) => {
      window.history.pushState(null, "", path);
    },
  };

  return router;
};
