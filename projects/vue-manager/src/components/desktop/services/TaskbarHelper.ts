import {
  TASKBAR_INIT_HEIGHT,
  TASKBAR_INIT_WIDTH,
} from "@/components/desktop/constants.ts";
import { DesktopSettingService } from "@/components/desktop/services/DesktopSettingService.ts";
import { rem } from "@/components/desktop/stores";
import { Computed, Inject, Service, VueService } from "vue-class";

@Service()
export class TaskbarHelper extends VueService {
  @Inject() desktopSettingService: DesktopSettingService;

  @Computed() get isHorizon() {
    const position = this.desktopSettingService.get("taskbar.position");
    return position === "left" || position === "right";
  }

  @Computed() get deputySizeValue() {
    const deputySize = this.desktopSettingService.get("taskbar.deputySize");
    const isHorizon = this.isHorizon;
    return (
      deputySize || rem(isHorizon ? TASKBAR_INIT_WIDTH : TASKBAR_INIT_HEIGHT)
    );
  }

  @Computed() get principalSizeProp(): "width" | "height" {
    return this.isHorizon ? "height" : "width";
  }

  @Computed() get deputySizeProp(): "width" | "height" {
    return this.isHorizon ? "width" : "height";
  }

  @Computed() get deputyMinSizeProp(): "minWidth" | "minHeight" {
    return this.isHorizon ? "minWidth" : "minHeight";
  }

  @Computed() get promptLinePositions(): [string, string] {
    const position = this.desktopSettingService.get("taskbar.position");
    const array: [string, string] = ["top", "left"];
    if (position === "top") array[0] = "bottom";
    else if (position === "left") array[1] = "right";
    else if (position === "right") array[1] = "left";
    return array;
  }
}
