import { defineStore } from "pinia";
import { ref } from "vue";

const behaviors: BehaviorType[] = [];

export function wrapBehavior(
  callback: (...args: any[]) => void,
  ...behaviors: BehaviorType[]
) {
  if (behaviors.length === 0) behaviors.push("normal");
  return (...args: any[]) => {
    const curBehavior = useBehavior().curBehavior;
    if (behaviors.includes(curBehavior)) callback(...args);
  };
}

export const useBehavior = defineStore("desktop.behavior", () => {
  behaviors.length = 0;
  const curBehavior = ref<BehaviorType>("normal");

  return {
    curBehavior,
  };
});
