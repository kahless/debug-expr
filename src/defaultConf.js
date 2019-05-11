// @flow

import type { Conf, Print } from "./types/conf";

export const nativeLog: Print = (...xs) => console.log(...xs);
export const nativeWarn: Print = (...xs) => console.warn(...xs);

export const defaultConf: Conf = {
  timer: "auto",
  log: nativeLog,
  warn: nativeWarn,
  clone: "auto",
  errorHandling: "warn",
  devTools: "auto",
  dev: false,

  // formatting
  format: "auto",
  formatErrors: "auto",
  highlight: "auto",
  inspectOptions: "auto",
  precision: 2,

  // stacktrace
  stackTrace: "auto",
  stackTraceAsync: "auto",
  stackTraceShift: "auto",

  // in-place options
  id: undefined,
  guard: Infinity,
  repeat: 1
};