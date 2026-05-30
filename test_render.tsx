// @ts-ignore
if (!import.meta.env) {
  // @ts-ignore
  import.meta.env = {};
}
import React from "react";
import { renderToString } from "react-dom/server";
import App from "./src/App";

const consoleError = console.error;
const errors: string[] = [];
console.error = (...args) => {
  errors.push(args.join(" "));
  consoleError(...args);
};

try {
  renderToString(<App />);
  console.log("RENDER SUCCESS. ERRORS:", errors);
} catch (e) {
  console.log("RENDER FAIL:", e);
}
