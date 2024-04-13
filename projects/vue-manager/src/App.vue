<script lang="ts" setup>
import { useUser } from "@/stores";
import { nextTick, ref, watch } from "vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";

const userStore = useUser();
const theme = ref({
  token: {
    colorBgBase: "white",
    colorTextBase: "black",
    colorBorder: "#d9d9d9",
  },
});

watch(
  userStore.isDarkTheme,
  () => {
    const isDark = userStore.isDarkTheme();
    document.body.className = isDark ? "dark" : "light";
    nextTick(() => {
      const docStyle = getComputedStyle(document.body);
      theme.value.token.colorBgBase = docStyle.getPropertyValue("--bg-base");
      theme.value.token.colorTextBase =
        docStyle.getPropertyValue("--text-base");
      theme.value.token.colorBorder =
        docStyle.getPropertyValue("--border-base");
    });
  },
  { immediate: true },
);
</script>

<template>
  <AConfigProvider :locale="zhCN" :theme="theme">
    <RouterView></RouterView>
  </AConfigProvider>
</template>

<style lang="scss">
body {
  scrollbar-color: #898989 transparent;
  scrollbar-width: thin;
}
</style>
