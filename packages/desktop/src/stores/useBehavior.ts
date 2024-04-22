import { defineStore } from "pinia";
import { ref } from "vue";

export const useBehavior = defineStore("desktop.behavior", () => {
  const curBehavior = ref<BehaviorType>("");
  const eventTargetMap = new WeakMap<EventTarget, Behavior>();

  return {
    curBehavior,
    wrapEventTarget,
  };

  function wrapEventTarget(eventTarget: EventTarget) {
    let behavior = eventTargetMap.get(eventTarget);
    if (!behavior) {
      behavior = {
        listenerMapKeyBehaviorTypes: new Map(),
        addEventListener<EventName extends keyof EventMap>(
          event: EventName,
          listener: (e: EventMap[EventName]) => any,
          options?:
            | boolean
            | (AddEventListenerOptions & ExtraEventListenerOption),
        ) {
          let behaviorTypes: BehaviorType[], key: any, firedOnLeave: boolean;
          if (typeof options === "object") {
            key = options.key;
            behaviorTypes = toBehaviorTypes(options.behaviorTypes, "");
            firedOnLeave = options.firedOnLeave ?? false;
          } else {
            behaviorTypes = toBehaviorTypes(undefined, "");
            firedOnLeave = false;
          }
          const behaviorListener = (...args: any[]) => {
            if (behaviorTypes.includes(curBehavior.value))
              return (listener as any)(...args);
          };
          eventTarget.addEventListener(event, behaviorListener, options);
          this.listenerMapKeyBehaviorTypes.set(listener, {
            key,
            behaviorListener,
            behaviorTypes,
            event,
          });
          if (firedOnLeave)
            this.addEventListener("mouseleave", listener as any, {
              ...(typeof options === "boolean" ? {} : options),
              firedOnLeave: false,
            });
          return this;
        },
        removeEventListener<EventName extends keyof EventMap>(
          event: EventName,
          listenerOrOption:
            | ((e: EventMap[EventName]) => any)
            | (EventListenerOptions & ExtraEventListenerOption),
          options?: boolean | (EventListenerOptions & ExtraEventListenerOption),
        ) {
          if (typeof listenerOrOption === "function") {
            const data = this.listenerMapKeyBehaviorTypes.get(listenerOrOption);
            if (data) {
              this.listenerMapKeyBehaviorTypes.delete(listenerOrOption);
              eventTarget.removeEventListener(
                event,
                data.behaviorListener as any,
                options as any,
              );
            } else {
              eventTarget.removeEventListener(
                event,
                listenerOrOption as any,
                options as any,
              );
            }
          } else {
            const key = listenerOrOption.key;
            const behaviorTypes = toBehaviorTypes(
              listenerOrOption.behaviorTypes,
            );
            for (let [
              listener,
              data,
            ] of this.listenerMapKeyBehaviorTypes.entries()) {
              if (
                key === data.key &&
                (!behaviorTypes.length ||
                  behaviorTypes.some((value) =>
                    data.behaviorTypes.includes(value),
                  ))
              ) {
                this.listenerMapKeyBehaviorTypes.delete(listener);
                eventTarget.removeEventListener(
                  event,
                  data.behaviorListener as any,
                  options as any,
                );
              }
            }
          }
          return this;
        },
        dispose(options) {
          if (options) {
            const behaviorTypes = toBehaviorTypes(options.behaviorTypes);
            const array = Array.from(this.listenerMapKeyBehaviorTypes);
            for (let entry of array) {
              if (
                entry[1] === options.key &&
                (!behaviorTypes.length ||
                  behaviorTypes.some((value) =>
                    entry[1].behaviorTypes.includes(value),
                  ))
              )
                this.removeEventListener(
                  entry[1].event as any,
                  entry[0] as any,
                  entry[1],
                );
            }
          } else {
            const array = Array.from(this.listenerMapKeyBehaviorTypes);
            for (let entry of array) {
              this.removeEventListener(
                entry[1].event as any,
                entry[0] as any,
                entry[1],
              );
            }
            this.listenerMapKeyBehaviorTypes.clear();
            eventTargetMap.delete(eventTarget);
          }
        },
      };
      eventTargetMap.set(eventTarget, behavior);
    }
    return behavior;
  }
});

function toBehaviorTypes(
  types?: BehaviorType | BehaviorType[],
  defaultType?: BehaviorType,
): BehaviorType[] {
  if (!types) {
    if (typeof defaultType === "string") return [defaultType];
    else return [];
  }
  if (!(types instanceof Array)) return [types];
  return types;
}
