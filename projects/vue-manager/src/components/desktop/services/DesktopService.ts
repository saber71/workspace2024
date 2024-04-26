import type { DesktopInst } from "@/components/desktop";
import { BASE_FONT_SIZE } from "@/components/desktop/constants.ts";
import type { MainAreaInst } from "@/components/desktop/main-area.tsx";
import type { TaskbarInst } from "@/components/desktop/taskbar.tsx";
import { DesktopTypes } from "@/components/desktop/types.ts";
import EventEmitter from "eventemitter3";
import { BindThis, Mut, Service, VueService, Watcher } from "vue-class";

@Service()
export class DesktopService extends VueService {
  @Mut(true) desktopInst: DesktopInst;
  @Mut(true) mainAreaInst: MainAreaInst;
  @Mut(true) taskbarInst: TaskbarInst;
  @Mut() cursor: string | "default" = "default";
  @Mut() scale: number = 1;
  @Mut(false) timestamp = new Date();
  readonly eventBus = new EventEmitter<DesktopTypes.Events>();
  private _raqHandler?: any;
  private _oldFontSize = document.documentElement.style.fontSize;

  setup() {
    document.body.className = "";
    this._updateTimestamp();
    this.eventBus.on("close", () => {
      document.documentElement.style.fontSize = this._oldFontSize;
      cancelAnimationFrame(this._raqHandler);
    });
  }

  @Watcher<DesktopService>({ source: "cursor" }) onCursorChange() {
    this.desktopInst.wrapperEl.style.cursor = this.cursor;
  }

  @Watcher() onScaleChange() {
    document.documentElement.style.fontSize =
      this.scale * BASE_FONT_SIZE + "px";
  }

  @BindThis() private _updateTimestamp() {
    this.timestamp = new Date();
    this._raqHandler = requestAnimationFrame(this._updateTimestamp);
  }
}
