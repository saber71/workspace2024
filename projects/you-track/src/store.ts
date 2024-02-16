import type { Tables } from "@/services/indexDB.service.ts";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useGlobalStore = defineStore("global", () => {
  /* 标记当前用户是否已获得授权并取得用户数据 */
  const auth = ref(false);

  /* 当前正在登陆的用户数据 */
  const userInfo = ref<Tables.User>({} as any);

  /* 是否在下次打开时记住登陆状态 */
  const rememberLoginStatus = useStorage("rememberLoginStatus", false);

  /* 用来记录在网页退出时登陆的用户id */
  const lastLoginUserId = useStorage("lastLoginUserId", "");

  return {
    userInfo,
    rememberLoginStatus,
    lastLoginUserId,
    auth,
  };
});
