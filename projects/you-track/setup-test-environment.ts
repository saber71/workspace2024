import "./src/services/common.service";
import "./src/services/key-value.service";
import "./src/services/indexDB.service";
import "./src/services/user.service";
import { IoC } from "ioc";
import { createPinia, setActivePinia } from "pinia";
import { ModuleName } from "vue-class";

setActivePinia(createPinia());
IoC.load(ModuleName);
