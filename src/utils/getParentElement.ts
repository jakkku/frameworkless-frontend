const getParentElement = (
  element: HTMLElement,
  targetNodeType: string
): HTMLElement | null => {
  const parent = element.parentElement;

  if (!parent) {
    return null;
  }

  return parent.tagName === targetNodeType || parent.tagName === "BODY"
    ? parent
    : getParentElement(parent, targetNodeType);
};

export default getParentElement;
