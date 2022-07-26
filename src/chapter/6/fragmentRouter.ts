import { Component, Params } from "./pages";

type Route = {
  testRegExp: RegExp;
  component: Component;
  paramNames: ParamNames;
};
type ParamNames = string[];

const ROUTE_PARAMETER_REGEX = /:(\w+)/g;
const URL_FRAGMENT_REGEX = "([^\\/]+)";

export default () => {
  const routes: Route[] = [];
  let notFound: Component = () => {};

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

  const checkRoutes = () => {
    const { hash } = window.location;

    const currentRoute = routes.find(({ testRegExp }) => {
      return testRegExp.test(hash);
    });

    if (!currentRoute) {
      notFound();
      return;
    }

    const urlParams = extractUrlParams(currentRoute, hash);
    currentRoute.component(urlParams);
  };

  const router = {
    addRoutes: (fragment: string, component: Component) => {
      const paramNames: ParamNames = [];

      const parsedFragment = fragment
        .replace(ROUTE_PARAMETER_REGEX, (_, paramName: string) => {
          paramNames.push(paramName);
          return URL_FRAGMENT_REGEX;
        })
        .replace(/\//g, "\\/");

      routes.push({
        testRegExp: new RegExp(`^${parsedFragment}$`),
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
      window.addEventListener("hashchange", checkRoutes);

      if (!window.location.hash) {
        window.location.hash = "#/";
      }

      checkRoutes();

      return router;
    },
    navigate: (fragment: string) => {
      window.location.hash = fragment;
    },
  };

  return router;
};
