import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettings = defineStore("desktop.settings", () => {
  const taskbar = ref<TaskbarSetting>({
    deputySize: "",
    autoHide: false,
    position: "bottom",
    small: false,
    lock: false,
  });

  return { taskbar };
});
