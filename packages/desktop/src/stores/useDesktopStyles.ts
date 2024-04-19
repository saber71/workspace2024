import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import type { CSSProperties } from "vue";
import { TASKBAR_INIT_HEIGHT } from "../constants";
import { rem, useDesktop } from "./useDesktop";

type Styles<Keys extends string> = Record<Keys, CSSProperties>;

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

  const mainAreaStyles = useLocalStorage<Styles<"container">>(
    "desktop.mainAreaStyles",
    {
      container: {
        position: "absolute",
        left: "0",
        top: 0,
        width: "100%",
        height: `cal(100% - ${rem(TASKBAR_INIT_HEIGHT)})`,
        overflow: "hidden",
      },
    },
  );

  return { desktopStyles, mainAreaStyles };
});
