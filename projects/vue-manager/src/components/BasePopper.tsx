import { useBehavior } from "@/stores";
import { createPopper, type Instance } from "@popperjs/core";
import { nextTick } from "vue";
import {
  type ComponentProps,
  type VueComponentBaseProps,
  VueComponent,
  Hook,
} from "vue-class";

export interface BasePopperProps extends VueComponentBaseProps {
  reference: HTMLElement;
  show: boolean;
  onUpdateShow: (val: boolean) => void;
  popperRef?: string | "popperEl";
  blurEl?: Element | Window;
  popperOption?: Parameters<typeof createPopper>[2];
}

export abstract class BasePopperInst<
  Props extends BasePopperProps,
> extends VueComponent<Props> {
  static readonly defineProps: ComponentProps<BasePopperProps> = [
    "inst",
    "reference",
    "show",
    "popperRef",
    "onUpdateShow",
    "blurEl",
    "popperOption",
  ];

  popperInstance?: Instance;

  @Hook("onMounted") setupPopper() {
    console.log(this);
    if (this.props.show) {
      if (this.popperInstance) return;
      const popperRef = this._getPopperRef();
      nextTick(() => {
        this.popperInstance = createPopper(
          this.props.reference,
          popperRef,
          Object.assign(
            {
              placement: "auto",
              strategy: "absolute",
            },
            this.props.popperOption,
          ),
        );
        this.popperInstance.update();
        setTimeout(() => (enabled = true), 100);
      });
      let enabled = false;
      useBehavior()
        .wrapEventTarget(this.props.blurEl ?? window)
        .addEventListener(
          "click",
          () => {
            if (enabled) this.props.onUpdateShow(false);
          },
          {
            key: this,
          },
        );
      useBehavior()
        .wrapEventTarget(popperRef)
        .addEventListener("click", (e) => e.stopPropagation(), { key: this });
    } else {
      this.hidePopper();
    }
  }

  @Hook("onBeforeUnmount") hidePopper() {
    this.popperInstance?.destroy();
    this.popperInstance = undefined;
    useBehavior()
      .wrapEventTarget(this.props.blurEl ?? window)
      .removeEventListener("click", { key: this });
    useBehavior()
      .wrapEventTarget(this._getPopperRef())
      .removeEventListener("click", { key: this });
  }

  private _getPopperRef() {
    return this.getLinkElement(this.props.popperRef || "popperEl");
  }
}
