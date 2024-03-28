import { Injectable } from "dependency-injection";
import { CONTEXT_LABEL, MODULE_NAME } from "../constant";

export function Logger() {
  return Injectable({
    moduleName: MODULE_NAME,
    singleton: true,
    paramtypes: [CONTEXT_LABEL],
  });
}
