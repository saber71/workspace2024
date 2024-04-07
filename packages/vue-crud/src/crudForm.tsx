import { reactive, ref, watch } from "vue";
import crudComponent from "./crudComponent.tsx";

export function crudForm<T = any>(option: CrudFormOption): CrudForm<T> {
  const forceUpdateCount = ref(0);
  const forceUpdate = () => forceUpdateCount.value++;
  let model: any = reactive(option.model ?? {});
  let renderForm = createRenderForm();
  option = reactive(option) as any;
  const componentArg: ComponentArg<T> = {
    index: -1,
    record: model,
  };
  watch(option, () => {
    model = reactive(option.model ?? model);
    renderForm = createRenderForm();
    forceUpdate();
  });
  return {
    get model() {
      return model;
    },
    render: () => (
      <div {...option.attr}>
        {renderForm(componentArg)}
        {/*不知为何，往表单新增FormItem即使触发重绘了，新增内容也不会出现页面上，所以加了这个，就一切正常了*/}
        <span style={{ display: "none" }}>{forceUpdateCount.value}</span>
      </div>
    ),
    option,
    forceUpdate,
  };

  function createRenderForm(): Component {
    const columns = option.columns
      .filter((col) => col.show !== false)
      .map((col) => {
        if (col.name) {
          if (!(col.name in model)) model[col.name] = col.defaultValue;
        }
        const render = () =>
          col.component!({
            index: -1,
            record: model,
            value: col.name ? model[col.name] : undefined,
            "onUpdate:value": (val) => {
              if (col.name) model[col.name] = val;
            },
          });
        if (col.wrapFormItem !== false) {
          const formItem = crudComponent.formItem(col, [render]);
          return () => formItem({ index: -1, record: model });
        }
        return render;
      });
    return crudComponent.form(option.form, columns);
  }
}
