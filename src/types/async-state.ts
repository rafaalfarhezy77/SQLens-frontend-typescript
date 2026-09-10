/**
 * Discriminated union representing the lifecycle of an asynchronous operation.
 * Eliminates impossible states and separates loading, success, and error data cleanly.
 */
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string }
