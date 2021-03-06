// @flow

import { dissoc, once } from "ramda";

import { warning } from "../../../errors/util";
import { type _Conf } from "../../../types/_conf";
import { type Conf } from "../../../types/conf";

import {
  normalizeClone,
  normalizeDevTools,
  normalizeFormat,
  normalizeFormatErrors,
  normalizeHighlight,
  normalizeId,
  normalizeInspectOptions,
  normalizeRepeat,
  normalizeStackTrace,
  normalizeStackTraceAsync,
  normalizeStackTraceShift,
  normalizeTimer,
} from "./options";

export function normalizeConf(conf: Conf, task?: string): _Conf {
  const getDevTools = once(() => normalizeDevTools(conf.devTools));

  const [timer, timerE] = normalizeTimer(conf.timer);
  const clone = normalizeClone(conf.clone, getDevTools);

  // formatting
  const [format, formatE] = normalizeFormat(conf.format, getDevTools);
  const [formatErrors, formatErrorsE] = normalizeFormatErrors(
    conf.formatErrors,
    getDevTools
  );
  const highlight = normalizeHighlight(conf.highlight);
  const inspectOptions = normalizeInspectOptions(conf.inspectOptions);

  // stacktrace
  const stackTrace = normalizeStackTrace(conf.stackTrace);
  const [stackTraceAsync, stackTraceAsyncE] = normalizeStackTraceAsync(
    conf.stackTraceAsync,
    timer
  );
  const stackTraceShift = normalizeStackTraceShift(conf.stackTraceShift);

  // in-place options
  const id = normalizeId(conf.id, timer, task);
  const [repeat, repeatE] = normalizeRepeat(conf.repeat, timer);

  [timerE, repeatE, stackTraceAsyncE, formatE, formatErrorsE].forEach(x => {
    if (x !== null) warning(conf, x);
  });

  return (dissoc("devTools", {
    ...conf,
    timer,
    clone,

    // stacktrace
    stackTrace,
    stackTraceAsync,
    stackTraceShift,

    // formatting
    format,
    formatErrors,
    highlight,
    inspectOptions,

    // in-place options
    id,
    repeat,
  }): any);
}
