import { DesktopConstants } from "@/components/desktop/constants.ts";
import { DesktopService } from "@/components/desktop/services/DesktopService.ts";
import type { DesktopTypes } from "@/components/desktop/types.ts";
import { ref, type Ref } from "vue";
import { Inject, Service, VueService } from "vue-class";

@Service()
export class DesktopSettingService extends VueService {
  constructor() {
    super();
    this.reset();
  }

  @Inject() readonly desktopService: DesktopService;
  readonly refMap: Record<keyof DesktopTypes.Setting, Ref<string>>;
  private readonly _initSetting: DesktopTypes.Setting = Object.assign(
    {},
    DesktopConstants.InitSetting,
  );

  get<Key extends keyof DesktopTypes.Setting>(
    key: Key,
  ): DesktopTypes.Setting[Key] {
    return this.refMap[key].value as any;
  }

  set<Key extends keyof DesktopTypes.Setting>(
    key: Key,
    value: DesktopTypes.Setting[Key],
    store: boolean = true,
  ) {
    this.refMap[key].value = value;
    if (key === "taskbar.small")
      this.desktopService.scale = value === "true" ? 0.75 : 1;
    if (store) this.desktopService.settingStore.set(key, value);
    return this;
  }

  setup() {
    this.desktopService.settingStore
      .batchGet(DesktopConstants.SettingKeys)
      .then((values) => {
        DesktopConstants.SettingKeys.forEach((key, i) => {
          this.set(key, values[i] as any, false);
        });
      });
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
