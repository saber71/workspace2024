import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { type Ref, ref } from "vue";

export const useUser = defineStore("user", () => {
  const token = useLocalStorage("token", "");
  const info: Ref<UserModel> = ref<UserModel>({} as any);

  return { token, info };
});
