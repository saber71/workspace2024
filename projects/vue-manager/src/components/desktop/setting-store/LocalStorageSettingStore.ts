import type { DesktopTypes } from "@/components/desktop/types.ts";
import { Service, VueService } from "vue-class";

const keyPrefix = "desktop:";

@Service()
export class LocalStorageSettingStore
  extends VueService
  implements DesktopTypes.SettingStore
{
  batchGet(keys: ReadonlyArray<keyof DesktopTypes.Setting>): Promise<string[]> {
    return Promise.all(keys.map((key) => this.get(key)));
  }

  get<Key extends keyof DesktopTypes.Setting>(
    key: Key,
  ): Promise<DesktopTypes.Setting[Key]> {
    return Promise.resolve(localStorage.getItem(keyPrefix + key) as any);
  }

  set<Key extends keyof DesktopTypes.Setting>(
    key: Key,
    value: DesktopTypes.Setting[Key],
  ): Promise<void> {
    localStorage.setItem(keyPrefix + key, value);
    return Promise.resolve();
  }

  connect(): Promise<void> {
    return Promise.resolve();
  }

  disconnect(): Promise<void> {
    return Promise.resolve();
  }
}
