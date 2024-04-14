import { DeleteFilled, EditFilled } from "@ant-design/icons-vue";
import {
  Button,
  Flex,
  InputSearch,
  Space,
  Table,
  type TablePaginationConfig,
} from "ant-design-vue";
import type { ColumnsType } from "ant-design-vue/es/table";
import type { TableRowSelection } from "ant-design-vue/es/table/interface";
import type { VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  Mut,
  Watcher,
  Computed,
} from "vue-class";

export interface TableComponentProps extends VueComponentBaseProps {
  columns: ColumnsType;
  pagination?: boolean;
  pageSizeOptions?: number[];
  dataSource?: PaginationResult<any>;
  onSearch?: (
    curPage: number,
    curPageSize: number,
    searchText: string,
  ) => Promise<PaginationResult<any>>;
  rowSelections?: TableRowSelection;
  onAdd?: () => void | Promise<void>;
  onEdit?: (record: any) => void | Promise<void>;
  onDelete?: (selectedRow: any[]) => void | Promise<void>;
  rowOperation?: boolean;
}

@Component()
export class TableComponentInst extends VueComponent<TableComponentProps> {
  static readonly defineProps: ComponentProps<TableComponentProps> = [
    "inst",
    "columns",
    "pagination",
    "pageSizeOptions",
    "dataSource",
    "onSearch",
    "rowSelections",
    "onAdd",
    "onEdit",
    "onDelete",
    "rowOperation",
  ];

  @Mut() curPage: number = 1;
  @Mut() curPageSize: number = 10;
  @Mut() loading: boolean = false;
  @Mut() dataSource: PaginationResult<any> = {
    data: [],
    total: 0,
    curPage: 1,
    pageSize: 10,
  };
  @Mut() rowSelections: TableRowSelection = {
    selectedRowKeys: [],
  };
  @Mut() paginationOption?: TablePaginationConfig;
  @Mut() searchText: string = "";
  @Mut() selectedRows: any[] = [];

  @Computed() get columns(): ColumnsType {
    const result = this.props.columns.map((column) => {
      const result = Object.assign({}, column);
      if (!result.customRender)
        result.customRender = (item) => {
          const value = item.value;
          if (value === undefined || value === null || value === "") return "-";
          return value;
        };
      if (!result.align) result.align = "center";
      if (result.ellipsis === undefined) result.ellipsis = true;
      return result;
    });
    if (this.props.rowOperation ?? true)
      result.push({
        title: "操作",
        key: "operation",
        customRender: (opt) => (
          <Space>
            <Button
              icon={<EditFilled />}
              type={"primary"}
              onClick={() => this.props.onEdit?.(opt.record)}
            ></Button>
            <Button
              icon={<DeleteFilled />}
              danger
              onClick={() => this.props.onDelete?.([opt.record])}
            ></Button>
          </Space>
        ),
      });
    return result;
  }

  setup() {
    if (this.props.dataSource) this.dataSource = this.props.dataSource;
    if (!this.props.rowSelections) {
      Object.assign(this.rowSelections, this.props.rowSelections);
      this.rowSelections.onChange = (selectedRowKeys, selectedRows) => {
        this.selectedRows = selectedRows;
        this.rowSelections.selectedRowKeys = selectedRowKeys;
        console.log(selectedRowKeys, selectedRows);
        this.props.rowSelections?.onChange?.(selectedRowKeys, selectedRows);
      };
    }
    if (this.props.pagination ?? true) {
      this.paginationOption = {
        showSizeChanger: true,
        pageSizeOptions: this.props.pageSizeOptions,
        current: this.curPage,
        "onUpdate:current": (val) => (this.curPage = val),
        pageSize: this.curPageSize,
        "onUpdate:pageSize": (val) => (this.curPageSize = val),
        showTotal: (total) => "共 " + total + " 项",
        total: this.dataSource.total,
        position: ["bottomRight"],
      };
    }
    this.toSearch();
  }

  @Watcher({
    source: ["curPage", "curPageSize", "searchText"],
  })
  async toSearch() {
    if (!this.props.onSearch) return;
    if (this.loading) return;
    this.loading = true;
    this.dataSource = await this.props.onSearch(
      this.curPage,
      this.curPageSize,
      this.searchText,
    );
    this.loading = false;
  }

  render(): VNodeChild {
    return (
      <Space class={"h-full"} direction={"vertical"}>
        <Flex>
          <InputSearch
            onChange={this.toSearch}
            placeholder={"请输入"}
            value={this.searchText}
            onUpdate:value={(val) => (this.searchText = val)}
          />
          <Space>
            <Button
              danger
              disabled={!this.selectedRows.length}
              onClick={() => this.props.onDelete?.(this.selectedRows)}
            >
              批量删除
            </Button>
            <Button type={"primary"} onClick={this.props.onAdd}>
              新增
            </Button>
          </Space>
        </Flex>
        <Table
          dataSource={this.dataSource.data}
          columns={this.columns}
          class={"flex-grow"}
          loading={this.loading}
          rowSelection={this.rowSelections}
          pagination={this.paginationOption}
          rowKey={"_id"}
        ></Table>
      </Space>
    );
  }
}

export default toNative<TableComponentProps>(TableComponentInst);
