import { faker } from "@faker-js/faker";

type Element = {
  text: string;
  completed: boolean;
};
type ElementFactory = () => Element;

const createElement = () => ({
  text: faker.random.words(2),
  completed: false,
});

const repeat = (elementFactory: ElementFactory, times: number) => {
  return Array.from({ length: times }).map(elementFactory);
};

export default () => {
  const howMany = Math.floor(Math.random() * 10);
  return repeat(createElement, howMany);
};
