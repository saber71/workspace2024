import { userApi } from "@/api.ts";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import type { UserInfo } from "server-user";
import { ref } from "vue";

export enum UserData {
  IsDarkTheme = "isDarkTheme",
}

export const useUser = defineStore("user", () => {
  const rememberMe = useLocalStorage("rememberMe", false);
  const info = useLocalStorage("user-info", {
    userData: {},
  } as any as UserInfo);
  const token = useLocalStorage("token", "");
  const isAuth = ref(false);

  if (!rememberMe.value) token.value = info.value._id = "";

  function isDarkTheme(): boolean {
    return !!info.value.userData?.[UserData.IsDarkTheme];
  }

  function setDarkTheme(value: boolean): void {
    if (info.value.userData) {
      if (value) updateUserData(UserData.IsDarkTheme, value);
      else deleteUserData(UserData.IsDarkTheme);
    }
  }

  return { info, rememberMe, isAuth, token, isDarkTheme, setDarkTheme };

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
