import type { DesktopTypes } from "@/components/desktop/types";
import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { DesktopConstants } from "../constants";
import { rem, useDesktop } from "./useDesktop";

export const useTaskbarSetting = defineStore("desktop.taskbar.setting", () => {
  const value = ref<DesktopTypes.TaskbarSetting>({
    deputySize: "",
    autoHide: {
      enabled: false,
      forceShow: false,
    },
    position: "bottom",
    small: false,
    lock: false,
  });
  const isHorizon = computed(
    () => value.value.position === "left" || value.value.position === "right",
  );
  const deputySizeValue = computed(
    () =>
      value.value.deputySize ||
      rem(
        isHorizon.value
          ? DesktopConstants.TASKBAR_INIT_WIDTH
          : DesktopConstants.TASKBAR_INIT_HEIGHT,
      ),
  );
  const principalSizeProp = computed(() =>
    isHorizon.value ? "height" : "width",
  );
  const deputySizeProp = computed(() => (isHorizon.value ? "width" : "height"));
  const deputyMinSizeProp = computed(() =>
    isHorizon.value ? "minWidth" : "minHeight",
  );
  const promptLinePositions = ref(["top", "left"]);

  watchEffect(() => {
    useDesktop().scale = value.value.small ? 0.75 : 1;
    const array = ["top", "left"];
    if (value.value.position === "top") array[0] = "bottom";
    else if (value.value.position === "left") array[1] = "right";
    else if (value.value.position === "right") array[1] = "left";
    Object.assign(promptLinePositions.value, array);
  });

  return {
    value,
    deputySizeValue,
    isHorizon,
    principalSizeProp,
    deputySizeProp,
    deputyMinSizeProp,
    promptLinePositions,
  };
});
