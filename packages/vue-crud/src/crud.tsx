import { reactive, ref } from "vue";
import crudComponent from "./crudComponent.tsx";

export function crud(option: CrudOption): Crud {
  let layoutComponentArg: LayoutComponentArg;
  const searchFormModel = ref({});
  const dataSource = ref([]);
  const pagination = reactive({
    curPage: 1,
    pageSize: 10,
    total: 0,
    "onUpdate:pageSize": () => crud.notifySearch(),
  });
  const crud: Crud = {
    option,
    update() {
      if (!option.layout) option.layout = crudComponent.commonLayout();
      layoutComponentArg = {};
      createButtons();
      createSearchForm();
      createTable();
      createPagination();
    },
    render: () => option.layout!(layoutComponentArg!),
    notifySearch() {},
  };
  crud.update();
  return crud;

  function createPagination() {
    if (option.pagination?.show !== false) {
      const componentArg: ComponentArg = {
        index: -1,
        record: pagination,
      };
      const renderPagination = crudComponent.pagination(option.pagination);
      layoutComponentArg.pagination = () => renderPagination(componentArg);
    }
  }

  function createTable() {
    const columns: TableColumnOption[] = option.columns
      .map((col) => {
        const result: TableColumnOption = Object.assign<
          TableColumnOption,
          TableColumnOption | undefined
        >(
          {
            title: col.title,
            dataIndex: col.prop,
            show: true,
          },
          col.table,
        );
        return result;
      })
      .filter((col) => col.show);
    if (columns.length && option.table?.show !== false) {
      if (option.tableOperation !== false) {
        const operationColumn = Object.assign<
          TableColumnOption,
          TableOperation | undefined
        >(
          {
            title: "操作",
          },
          option.tableOperation,
        );
        columns.push(operationColumn);
      }
      const renderTable = crudComponent.crudTable({
        columns,
        table: {
          ...option.table,
          pagination: false,
        },
      });
      const componentArg: ComponentArg = {
        index: -1,
        record: null,
        get value() {
          return dataSource;
        },
      };
      layoutComponentArg.table = () => renderTable(componentArg);
    }
  }

  function createSearchForm() {
    const formColumns = option.columns
      .map((col, index) => {
        const searchForm: FormColumnOption = Object.assign<
          FormColumnOption,
          FormItemOption | undefined,
          FormItemOption | undefined
        >(
          {
            name: col.prop,
            show: true,
            component: crudComponent.input(),
          },
          option.columns[index].form,
          col.searchForm,
        );
        return searchForm;
      })
      .filter((col) => col.show);
    if (formColumns.length) {
      const renderForm = crudComponent.crudForm(
        {
          columns: formColumns,
          form: {
            layout: "inline",
            ...option.form,
            ...option.searchForm,
          },
        },
        true,
      );
      const componentArg: ComponentArg = {
        index: -1,
        get record() {
          return searchFormModel.value;
        },
      };
      layoutComponentArg.searchForm = () => renderForm(componentArg);
    }
  }

  function createButtons() {
    const addButtonOption: ButtonOption = Object.assign<
      ButtonOption,
      ButtonOption | undefined
    >(
      {
        show: true,
        text: "新增",
        type: "primary",
      },
      option.buttons?.add,
    );
    const deleteButtonOption: ButtonOption = Object.assign<
      ButtonOption,
      ButtonOption | undefined
    >(
      {
        show: true,
        text: "批量删除",
        danger: true,
      },
      option.buttons?.delete,
    );
    if (addButtonOption.show || deleteButtonOption.show) {
      const renderButtons: Component[] = [];
      if (addButtonOption.show)
        renderButtons.push(
          crudComponent.button(addButtonOption, addButtonOption.text),
        );
      if (deleteButtonOption.show)
        renderButtons.push(
          crudComponent.button(deleteButtonOption, deleteButtonOption.text),
        );
      const componentArg: ComponentArg = {
        record: null,
        index: -1,
      };
      layoutComponentArg.buttons = () => (
        <div>{renderButtons.map((component) => component(componentArg))}</div>
      );
    }
  }
}
