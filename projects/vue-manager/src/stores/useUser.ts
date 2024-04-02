import { userApi } from "@/api.ts";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { type Ref, ref } from "vue";

enum UserData {
  IsDarkTheme = "isDarkTheme",
}

export const useUser = defineStore("user", () => {
  const token = useLocalStorage("token", "");
  const info: Ref<UserInfo> = ref({} as any);

  function isDarkTheme(): boolean {
    return !!info.value.userData?.[UserData.IsDarkTheme];
  }

  function setDarkTheme(value: boolean): void {
    if (info.value.userData) {
      if (value) updateUserData(UserData.IsDarkTheme, value);
      else deleteUserData(UserData.IsDarkTheme);
    }
  }

  return { token, info, isDarkTheme, setDarkTheme };

  function updateUserData(key: string, value: any): void {
    info.value.userData[key] = value;
    userApi("updateUserData", [
      {
        id: info.value._id,
        appendUserData: { [key]: value },
      },
    ]);
  }

  function deleteUserData(...key: string[]): void {
    key.forEach((item) => delete info.value.userData[item]);
    userApi("updateUserData", [
      {
        id: info.value._id,
        deleteUserData: key,
      },
    ]);
  }
});
