import {
  defineComponent,
  getCurrentInstance,
  type VNodeChild,
  type EmitsOptions,
  type HTMLAttributes,
} from "vue";
import { applyMetadata } from "./metadata";
import type { ComponentProps, VueComponentClass, WithSlotTypes } from "./types";
import { VueClass } from "./vue-class";

export interface VueComponentBaseProps extends Partial<HTMLAttributes> {
  inst?: string;
}

export class VueComponent<
  Props extends VueComponentBaseProps = VueComponentBaseProps,
  Emit extends EmitsOptions = {},
> {
  static __test__ = false;
  static readonly defineProps: ComponentProps<VueComponentBaseProps & any> = [
    "inst",
  ];

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
  readonly childInstMap: Record<string, VueComponent> = {};

  get props(): Props {
    return this.vueInstance.props as Props;
  }

  render(): VNodeChild {}

  setup(): void {}
}

export function toNative<
  Props extends VueComponentBaseProps,
  Emit extends EmitsOptions = {},
>(componentClass: VueComponentClass<Props, Emit>) {
  return defineComponent<Props, Emit>(
    () => {
      const instance = VueClass.getInstance(componentClass);

      applyMetadata(componentClass, instance);

      instance.setup();

      return instance.render.bind(instance);
    },
    {
      name: componentClass.name,
      props: componentClass.defineProps as any,
      // emits: componentClass.defineEmits as any,
    },
  );
}
