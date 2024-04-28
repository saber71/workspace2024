import type { DesktopTypes } from "@/components/desktop/types.ts";
import { BindThis, Service, VueService } from "vue-class";

@Service()
export class LocalStorageLinker
  extends VueService
  implements DesktopTypes.Linker
{
  private _cb: Function;

  dispatch(key: DesktopTypes.LinkerKey, value: string): Promise<void> {
    localStorage.setItem(key, value);
    return Promise.resolve();
  }

  startListen(cb: (key: DesktopTypes.LinkerKey, value: string) => void): void {
    this._cb = cb;
    window.addEventListener("storage", this._onSessionChanged);
  }

  stopListen(): void {
    window.removeEventListener("storage", this._onSessionChanged);
  }

  @BindThis() private _onSessionChanged(e: StorageEvent) {
    this._cb(e.key, e.newValue);
  }
}
