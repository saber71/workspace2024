import { IoC } from "ioc";
import {
  defineComponent,
  getCurrentInstance,
  type VNodeChild,
  type EmitsOptions,
  type HTMLAttributes,
} from "vue";
import { ModuleName } from "./constants";
import { applyMetadata } from "./metadata";
import type { ComponentProps, VueComponentClass, WithSlotTypes } from "./types";

export class VueComponent<
  Props extends Partial<HTMLAttributes> = Partial<HTMLAttributes>,
  Emit extends EmitsOptions = {},
> {
  static __test__ = false;
  static readonly defineProps: ComponentProps<Partial<HTMLAttributes> & any> =
    [];

  constructor() {
    let curInstance = getCurrentInstance()!;

    if (!curInstance) {
      if (VueComponent.__test__) curInstance = { appContext: {} } as any;
      else throw new Error("Cannot directly create VueComponent instance");
    }

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

export function toNative<
  Props extends Partial<HTMLAttributes>,
  Emit extends EmitsOptions = {},
>(componentClass: VueComponentClass<Props, Emit>) {
  return defineComponent<Props, Emit>(
    () => {
      const instance = IoC.getInstance(componentClass, ModuleName);

      applyMetadata(componentClass, instance);

      return instance.render.bind(instance);
    },
    {
      name: componentClass.name,
      props: componentClass.defineProps as any,
      // emits: componentClass.defineEmits as any,
    },
  );
}
