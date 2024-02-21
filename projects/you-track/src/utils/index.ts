export function getErrorMessage(e: Error | unknown) {
  if (e instanceof Error) return e.message;
  else if (typeof e === "string") return e;
  return "";
}

export * from "./form-rules.ts";
