<script lang="ts" setup>
import { useTheme } from "@/stores";
import { computed } from "vue";

const themeStore = useTheme();

const classes = computed(() => {
  const result = ["root-view"];
  if (themeStore.isDark) result.push("dark");
  else result.push("light");
  return result;
});
</script>

<template>
  <RouterView :class="classes"></RouterView>
</template>
