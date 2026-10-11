const listeners = {};
const element = () => ({
  addEventListener() {},
  classList: { add() {}, remove() {}, toggle() {} },
  content: { cloneNode: () => ({}) },
  dataset: {},
  focus() {},
  hidden: false,
  innerHTML: "",
  replaceChildren() {},
  showModal() {},
  style: {},
  textContent: ""
});

const elements = new Map();
const getElement = (selector) => {
  if (!elements.has(selector)) elements.set(selector, element());
  return elements.get(selector);
};

globalThis.window = globalThis;
globalThis.document = {
  querySelector: getElement,
  querySelectorAll: () => []
};
globalThis.location = { hash: "#/home" };
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.requestAnimationFrame = (callback) => callback();
globalThis.scrollTo = () => {};
globalThis.confirm = () => true;
globalThis.addEventListener = (type, callback) => { listeners[type] = callback; };

await import("./course-data.js");
await import("./mit-lecture-data.js");
await import("./app.js");

const view = getElement("#course-view");
assertIncludes(view.innerHTML, "Your seven-day operating plan", "home route");

for (const [hash, expected] of [
  ["#/day/3", "Break and build web applications"],
  ["#/lesson/d4-l1", "Practical cryptography and secrets"],
  ["#/quiz/5", "Day 5: Blue team operations"],
  ["#/mit", "The one-week lecture path"],
  ["#/mit/day/3", "Timestamped learning path"],
  ["#/final", "Final field assessment"],
  ["#/resources", "Field references and continued study"]
]) {
  location.hash = hash;
  listeners.hashchange();
  assertIncludes(view.innerHTML, expected, hash);
}

console.log("Rendered home, day, lesson, quiz, MIT studio, final, and resources routes without a runtime exception.");

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    console.error(`Smoke test failed for ${label}: expected “${expected}”.`);
    process.exit(1);
  }
}
