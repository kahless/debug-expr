// @flow

export function errUnknownOpt(name: string): string[] {
  return [`Unknown option ${name}`];
}

export function errInvalidTimer(): string[] {
  return ['Invalid "timer" option value'];
}

export function errInvalidLog(): string[] {
  return ['"log" option must be function'];
}

export function errInvalidWarn(): string[] {
  return ['"warn" option must be function'];
}

export function errInvalidClone(): string[] {
  return ['"clone" option must be boolean or "auto"'];
}

export function errInvalidErrorHandling(): string[] {
  return ['"errorHandling" option must be "warn" or "throw"'];
}

export function errInvalidDevTools(): string[] {
  return ['"devTools" option must be boolean or "auto"'];
}

export function errInvalidDev(): string[] {
  return ['"dev" option must be boolean'];
}

// StackTrace
// ----------

export function errInvalidStackTrace(): string[] {
  return ['Invalid "stackTrace" option value'];
}

export function errInvalidStackTraceAsync(): string[] {
  return ['"stackTraceAsync" option must be boolean or "auto"'];
}

export function errInvalidStackTraceShift(): string[] {
  return ['"stackTraceShift" option must be a number'];
}

// Formatting
// ----------

export function errInvalidFormat(): string[] {
  return ['"format" option must be boolean or "auto"'];
}

export function errInvalidFormatErrors(): string[] {
  return ['"formatErrors" option must be boolean or "auto"'];
}

export function errInvalidHighlight(): string[] {
  return ['"highlight" option must be boolean'];
}

export function errInvalidInspectOptions(): string[] {
  return ['"inspectOptions" option must be object'];
}

export function errInvalidPrecision(): string[] {
  return ['"precision" option must be number >=0'];
}

// In-Place Options
// ----------------

export function errInvalidGuard(): string[] {
  return ['"guard" option must be number'];
}

export function errInvalidRepeat(): string[] {
  return ['"repeat" option must be string or number >= 0'];
}
