const simulateMouseEvent = (selector, type) => {
  document
    .querySelector(selector)
    .dispatchEvent(new MouseEvent(type, { bubbles: true }));
};

export const simulateMouseOver = (selector) =>
  simulateMouseEvent(selector, "mouseover");

export const simulateMouseOut = (selector) =>
  simulateMouseEvent(selector, "mouseout");
