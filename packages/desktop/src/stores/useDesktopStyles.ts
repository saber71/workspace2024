import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import type { StyleValue } from "vue";
import { TASKBAR_INIT_HEIGHT } from "../constants";
import { rem, useDesktop } from "./useDesktop";

type Styles<Keys extends string> = Record<string | Keys, StyleValue>;

export const useDesktopStyles = defineStore("desktop.styles", () => {
  const desktop = useDesktop();

  const desktopStyles = useLocalStorage<Styles<"container" | "wrapper">>(
    "desktop.styles:" + desktop.id,
    {
      container: {
        width: "100%",
        height: "100%",
        overflow: "auto",
      },
      wrapper: {
        width: "100%",
        height: "100%",
        position: "relative",
      },
    },
  );

  const taskbarStyles = useLocalStorage<Styles<"container">>(
    "desktop.taskbarStyles:" + desktop.id,
    {
      container: {
        width: "100%",
        height: rem(TASKBAR_INIT_HEIGHT),
        display: "flex",
        flexDirection: "row",
      },
    },
  );

  return { desktopStyles, taskbarStyles };
});
