import type { DesktopTypes } from "@/components/desktop/types.ts";
import { ref, type Ref } from "vue";
import { Service, VueService } from "vue-class";

@Service()
export class DesktopSettingService extends VueService {
  constructor() {
    super();
    this.reset();
  }

  readonly refMap: Record<keyof DesktopTypes.Setting, Ref<string>>;
  private readonly _initSetting: DesktopTypes.Setting = {
    "taskbar.position": "bottom",
    "taskbar.small": "false",
    "taskbar.lock": "false",
    "taskbar.autoHide.forceShow": "false",
    "taskbar.autoHide.enabled": "false",
    "taskbar.deputySize": "",
  };

  get<Key extends keyof DesktopTypes.Setting>(
    key: Key,
  ): DesktopTypes.Setting[Key] {
    return this.refMap[key].value as any;
  }

  set<Key extends keyof DesktopTypes.Setting>(
    key: Key,
    value: DesktopTypes.Setting[Key],
  ) {
    this.refMap[key].value = value;
    return this;
  }

  reset(initSetting?: DesktopTypes.Setting) {
    if (initSetting) Object.assign(this._initSetting, initSetting);
    for (let key in this._initSetting) {
      const value = (this._initSetting as any)[key];
      let ref$ = (this.refMap as any)[key];
      if (!ref$) ref$ = (this.refMap as any)[key] = ref(value);
      ref$.value = value;
    }
  }
}
