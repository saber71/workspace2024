import { reactive, ref } from "vue";
import crudComponent from "./crudComponent.tsx";

export function crudTable(option: CrudTableOption): CrudTable {
  const forceUpdateCount = ref(0);
  const forceUpdate = () => forceUpdateCount.value++;
  let dataSource = setDataSource();
  const componentArg: ComponentArg = {
    index: -1,
    record: dataSource,
  };
  let renderTable = createRenderTable();
  return {
    option,
    render: () => (
      <div {...option.attr}>
        {renderTable(componentArg)}
        <span style={{ display: "none" }}>{forceUpdateCount.value}</span>
      </div>
    ),
    update() {
      dataSource = setDataSource();
      renderTable = createRenderTable();
      forceUpdate();
    },
    get dataSource() {
      return dataSource;
    },
  };

  function setDataSource() {
    let dataSource;
    if (option.dataSource instanceof Array) dataSource = option.dataSource;
    else dataSource = option.dataSource.data;
    return reactive(dataSource);
  }

  function createRenderTable() {
    const columns = option.columns
      .map((col) => {
        const result = Object.assign({}, col);
        if (result.show === undefined) result.show = true;
        if (result.ellipsis === undefined) result.ellipsis = true;
        if (result.align === undefined) result.align = "center";
        if (!result.customRender) {
          if (!result.component)
            result.component = crudComponent.renderPlaceholder();
          result.customRender = (data) => result.component!(data);
        }
        return result;
      })
      .filter((col) => col.show);
    return crudComponent.table({
      ...option.table,
      columns,
      dataSource,
    });
  }
}
