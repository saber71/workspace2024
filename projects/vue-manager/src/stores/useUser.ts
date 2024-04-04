import { userApi } from "@/api.ts";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";

enum UserData {
  IsDarkTheme = "isDarkTheme",
}

export const useUser = defineStore("user", () => {
  const rememberMe = useLocalStorage("rememberMe", false);
  const info = useLocalStorage("user-info", {
    userData: {},
  } as any as UserInfo);
  const isAuth = ref(false);

  if (!rememberMe.value) info.value._id = "";

  function isDarkTheme(): boolean {
    return !!info.value.userData?.[UserData.IsDarkTheme];
  }

  function setDarkTheme(value: boolean): void {
    if (info.value.userData) {
      if (value) updateUserData(UserData.IsDarkTheme, value);
      else deleteUserData(UserData.IsDarkTheme);
    }
  }

  return { info, rememberMe, isAuth, isDarkTheme, setDarkTheme };

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
