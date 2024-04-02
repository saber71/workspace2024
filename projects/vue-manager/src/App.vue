<script lang="ts" setup>
import { useUser } from "@/stores";
import { computed } from "vue";

const userStore = useUser();

const classes = computed(() => {
  const result = ["root-view"];
  if (userStore.isDarkTheme()) result.push("dark");
  else result.push("light");
  return result;
});
</script>

<template>
  <RouterView :class="classes"></RouterView>
</template>
