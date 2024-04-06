import { reactive } from "vue";
import crudComponent from "./crudComponent.tsx";

export function crudForm<T = any>(option: CrudFormOption): CrudForm<T> {
  const model: any = reactive({});
  const renderForm = crudComponent.form(
    option.form,
    option.columns
      .filter((col) => col.show !== false)
      .map((col) => {
        if (col.prop) {
          col.name = col.prop;
          if (!(col.prop in model)) model[col.prop] = col.defaultValue;
        }
        const render = () =>
          col.component!({
            index: -1,
            record: model,
            value: col.prop ? model[col.prop] : undefined,
            "onUpdate:value": (val) => {
              if (col.prop) model[col.prop] = val;
            },
          });
        if (col.wrapFormItem !== false) {
          const formItem = crudComponent.formItem(col, [render]);
          return () => formItem({ index: -1, record: model });
        }
        return render;
      }),
  );
  return {
    model,
    render: () => renderForm({ index: -1, record: model }),
  };
}
