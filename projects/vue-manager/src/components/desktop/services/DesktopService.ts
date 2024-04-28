import type { DesktopInst } from "@/components/desktop";
import { DesktopConstants } from "@/components/desktop/constants.ts";
import type { MainAreaInst } from "@/components/desktop/main-area.tsx";
import type { TaskbarInst } from "@/components/desktop/taskbar.tsx";
import { DesktopTypes } from "@/components/desktop/types.ts";
import EventEmitter from "eventemitter3";
import {
  BindThis,
  Mut,
  Service,
  VueClass,
  VueService,
  Watcher,
} from "vue-class";

@Service()
export class DesktopService extends VueService {
  @Mut(true) desktopInst: DesktopInst;
  @Mut(true) mainAreaInst: MainAreaInst;
  @Mut(true) taskbarInst: TaskbarInst;
  @Mut() cursor: string | "default" = "default";
  @Mut() scale: number = 1;
  @Mut(true) timestamp = new Date();
  @Mut() linkerOption: any = {
    type: "LocalStorageLinker",
  };
  @Mut() settingStoreOption: any = {
    type: "LocalStorageSettingStore",
  };
  readonly eventBus = new EventEmitter<DesktopTypes.Events>();
  private _raqHandler?: any;
  private _oldFontSize = document.documentElement.style.fontSize;

  get linker(): DesktopTypes.Linker {
    return VueClass.dependencyInjection.getValue(DesktopConstants.Label_Linker);
  }

  get settingStore(): DesktopTypes.SettingStore {
    return VueClass.dependencyInjection.getValue(
      DesktopConstants.Label_SettingStore,
    );
  }

  setup() {
    document.body.className = "";
    this._updateTimestamp();
    this.eventBus.on("close", () => {
      document.documentElement.style.fontSize = this._oldFontSize;
      cancelAnimationFrame(this._raqHandler);
      this.eventBus.removeAllListeners();
    });
  }

  @Watcher<DesktopService>({ source: "cursor" }) onCursorChange() {
    this.desktopInst.wrapperEl.style.cursor = this.cursor;
  }

  @Watcher() onScaleChange() {
    document.documentElement.style.fontSize =
      this.scale * DesktopConstants.BASE_FONT_SIZE + "px";
  }

  @Watcher() onLinkerOptionChange() {
    const container = VueClass.dependencyInjection;
    if (container.hasLabel(DesktopConstants.Label_Linker))
      this.linker.stopListen();
    const linker = VueClass.dependencyInjection.getValue<DesktopTypes.Linker>(
      this.linkerOption.type,
    );
    container.bindValue(DesktopConstants.Label_Linker, linker);
    linker.startListen(async (key, value) => {
      const desktopSettingPrefix = DesktopConstants.LinkerKeyPrefix[0];
      if (desktopSettingPrefix.test(key)) {
        await this.settingStore.set(
          key.replace(desktopSettingPrefix, "") as any,
          value,
        );
        return;
      }
    });
  }

  @Watcher() async onSettingStoreOptionChange() {
    const container = VueClass.dependencyInjection;
    if (container.hasLabel(DesktopConstants.Label_SettingStore))
      await this.settingStore.disconnect();
    const store =
      VueClass.dependencyInjection.getValue<DesktopTypes.SettingStore>(
        this.settingStoreOption.type,
      );
    container.bindValue(DesktopConstants.Label_SettingStore, store);
    await store.connect();
  }

  @BindThis() private _updateTimestamp() {
    this.timestamp = new Date();
    this._raqHandler = requestAnimationFrame(this._updateTimestamp);
  }
}
