import { DesktopConstants } from "@/components/desktop/constants.ts";
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
    window.addEventListener("storage", this._onStorageChanged);
  }

  stopListen(): void {
    window.removeEventListener("storage", this._onStorageChanged);
  }

  @BindThis() private _onStorageChanged(e: StorageEvent) {
    for (let reg of DesktopConstants.LinkerKeyPrefix) {
      if (reg.test(e.key!)) {
        this._cb(e.key!, e.newValue);
        return;
      }
    }
  }
}
