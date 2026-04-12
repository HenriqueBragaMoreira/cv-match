import "@testing-library/jest-dom/vitest";

// Radix UI relies on ResizeObserver and scrollIntoView which jsdom doesn't provide
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

Element.prototype.scrollIntoView = () => {};

// Radix Select uses hasPointerCapture/setPointerCapture/releasePointerCapture
Element.prototype.hasPointerCapture = () => false;
Element.prototype.setPointerCapture = () => {};
Element.prototype.releasePointerCapture = () => {};
