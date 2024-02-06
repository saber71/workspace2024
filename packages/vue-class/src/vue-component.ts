import { IoC } from "ioc";
import {
  defineComponent,
  getCurrentInstance,
  type VNodeChild,
  type EmitsOptions,
} from "vue";
import { applyMetadata } from "./decorators";
import type {
  ComponentProps,
  ComponentPropsObject,
  DefineEmits,
  VueComponentClass,
  WithSlotTypes,
} from "./types";

export class VueComponent<
  Props extends {} = {},
  Emit extends EmitsOptions = {},
> {
  static defineProps: ComponentProps<any> = [];
  static defineEmits: DefineEmits<any> = [];

  constructor() {
    const curInstance = getCurrentInstance();
    if (!curInstance)
      throw new Error("Cannot directly create VueComponent instance");
    this.vueInstance = curInstance;
    this.context = curInstance.appContext as any;
  }

  readonly vueInstance: NonNullable<ReturnType<typeof getCurrentInstance>>;
  readonly context: WithSlotTypes<Emit, Props>;

  get props(): Props {
    return this.vueInstance.props as Props;
  }

  render(): VNodeChild {}
}

export function toNative<Props extends {}, Emit extends EmitsOptions>(
  componentClass: VueComponentClass<Props, Emit>,
) {
  return defineComponent<ComponentPropsObject<Props>, Emit>(
    () => {
      const instance = IoC.getInstance(componentClass);

      applyMetadata(componentClass, instance);

      return instance.render.bind(instance);
    },
    {
      name: componentClass.name,
      props: componentClass.defineProps as any,
      emits: componentClass.defineEmits as any,
    },
  );
}
