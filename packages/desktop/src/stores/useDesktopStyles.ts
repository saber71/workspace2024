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

  const taskbarStyles = useLocalStorage<
    Styles<
      | "container"
      | "promptLine"
      | "startButton"
      | "contentArea"
      | "infoArea"
      | "time"
    >
  >("desktop.taskbarStyles:" + desktop.id, {
    container: {
      width: "100%",
      height: rem(TASKBAR_INIT_HEIGHT),
      display: "flex",
      flexDirection: "row",
      position: "absolute",
      left: "0",
      bottom: 0,
      background: "rgba(255, 255, 255, 0.5)",
      backdropFilter: "blur(10px)",
    },
    promptLine: {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "3px",
      transform: "translateX(-50%)",
      cursor: "col-resize",
    },
    startButton: {
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: rem(40),
      height: "100%",
      fontSize: rem(24),
    },
    contentArea: {
      flexGrow: 1,
      height: "100%",
    },
    infoArea: {
      flexShrink: 0,
      width: "100px",
      height: "100%",
      display: "flex",
      alignItems: "center",
    },
    time: {
      textAlign: "center",
      fontSize: "0.75rem",
    },
  });

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

  return { desktopStyles, taskbarStyles, mainAreaStyles };
});
