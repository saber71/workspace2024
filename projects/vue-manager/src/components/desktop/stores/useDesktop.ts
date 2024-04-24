import { useLocalStorage } from "@vueuse/core";
import { remove } from "common";
import EventEmitter from "eventemitter3";
import { defineStore } from "pinia";
import { ref, shallowRef, watch } from "vue";
import { BASE_FONT_SIZE } from "../constants";
import type { DesktopInst } from "../index.tsx";
import type { MainAreaInst } from "../main-area";
import type { TaskbarInst } from "../taskbar";

interface DesktopEvents {
  close: () => void;
}

export const useDesktop = defineStore("desktop", () => {
  const initCursor = "default";
  const cursor = ref(initCursor);
  const opened = useLocalStorage<number[]>("desktop.opened", []);
  const desktopInst = shallowRef<DesktopInst>(0 as any);
  const mainAreaInst = shallowRef<MainAreaInst>(0 as any);
  const taskbarInst = shallowRef<TaskbarInst>(0 as any);
  const id =
    opened.value.reduce(
      (previousValue, currentValue) => Math.max(previousValue, currentValue),
      -1,
    ) + 1;
  const scale = ref(1);
  const timestamp = shallowRef(new Date());
  let raqHandler = requestAnimationFrame(updateTimestamp);
  const eventBus = new EventEmitter<DesktopEvents>().on("close", () => {
    remove(opened.value, id);
    document.documentElement.style.fontSize = oldFontSize;
    cancelAnimationFrame(raqHandler);
  });

  opened.value.push(id);

  let oldFontSize = document.documentElement.style.fontSize;
  watch(
    scale,
    () => {
      document.documentElement.style.fontSize =
        scale.value * BASE_FONT_SIZE + "px";
    },
    { immediate: true },
  );

  watch(cursor, () => {
    desktopInst.value.wrapperEl.style.cursor = cursor.value;
  });

  return {
    opened,
    id,
    scale,
    eventBus,
    desktopInst,
    mainAreaInst,
    taskbarInst,
    timestamp,
    cursor,
    resetCursor,
  };

  function resetCursor() {
    cursor.value = initCursor;
  }

  function updateTimestamp() {
    timestamp.value = new Date();
    raqHandler = requestAnimationFrame(updateTimestamp);
  }
});

export function rem(px: number) {
  return px / BASE_FONT_SIZE + "rem";
}
