<script lang="ts" setup>
import { useUser } from "@/stores";
import { watch } from "vue";

const userStore = useUser();

watch(
  userStore.isDarkTheme,
  () => {
    const isDark = userStore.isDarkTheme();
    document.body.className = isDark ? "dark" : "light";
  },
  { immediate: true },
);
</script>

<template>
  <AConfigProvider>
    <RouterView></RouterView>
  </AConfigProvider>
</template>
