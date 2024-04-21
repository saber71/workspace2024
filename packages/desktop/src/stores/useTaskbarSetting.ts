import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { TASKBAR_INIT_HEIGHT } from "../constants";
import { rem } from "./useDesktop";

export const useTaskbarSetting = defineStore("desktop.taskbar.setting", () => {
  const value = ref<TaskbarSetting>({
    deputySize: "",
    autoHide: {
      enabled: true,
      forceShow: false,
    },
    position: "bottom",
    small: false,
    lock: false,
  });
  const deputySizeValue = computed(
    () => value.value.deputySize || rem(TASKBAR_INIT_HEIGHT),
  );
  const isHorizon = computed(
    () => value.value.position === "left" || value.value.position === "right",
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
