import { useLocalStorage } from "@vueuse/core";
import { remove } from "common";
import EventEmitter from "eventemitter3";
import { defineStore } from "pinia";
import { shallowRef, watch } from "vue";
import { BASE_FONT_SIZE } from "../constants";
import type { DesktopInst } from "../desktop";
import type { MainAreaInst } from "../main-area";
import type { TaskbarInst } from "../taskbar";

interface DesktopEvents {
  close: () => void;
}

export const useDesktop = defineStore("desktop", () => {
  const opened = useLocalStorage<number[]>("desktop.opened", []);
  const desktopInst = shallowRef<DesktopInst>(0 as any);
  const mainAreaInst = shallowRef<MainAreaInst>(0 as any);
  const taskbarInst = shallowRef<TaskbarInst>(0 as any);

  const id =
    opened.value.reduce(
      (previousValue, currentValue) => Math.max(previousValue, currentValue),
      -1,
    ) + 1;
  opened.value.push(id);

  const scale = useLocalStorage("desktop.scale", 1);
  let oldFontSize = document.body.style.fontSize;
  watch(
    scale,
    () => {
      document.body.style.fontSize = scale.value * BASE_FONT_SIZE + "px";
    },
    { immediate: true },
  );

  const eventBus = new EventEmitter<DesktopEvents>().on("close", () => {
    remove(opened.value, id);
    document.body.style.fontSize = oldFontSize;
  });

  return { opened, id, eventBus, desktopInst, mainAreaInst, taskbarInst };
});

export function rem(px: number) {
  return px / BASE_FONT_SIZE + "rem";
}
