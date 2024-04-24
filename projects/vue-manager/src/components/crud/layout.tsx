import { Flex } from "ant-design-vue";
import type { StyleValue, VNodeChild } from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
} from "vue-class";

export interface LayoutProps extends VueComponentBaseProps {
  searchForm?: () => VNodeChild;
  form?: () => VNodeChild;
  toolButtons?: () => VNodeChild;
  table?: () => VNodeChild;
  pagination?: () => VNodeChild;
  modal?: () => VNodeChild;
}

const styles = {
  layoutContainer: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    gap: "8px",
  } as StyleValue,
  topArea: {
    flexShrink: 0,
    width: "100%",
  } as StyleValue,
  tableContainer: {
    position: "relative",
    width: "100%",
    flexGrow: 1,
  } as StyleValue,
  wrapTable: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
  } as StyleValue,
  paginationContainer: {
    flexShrink: 0,
    width: "100%",
  } as StyleValue,
  modal: {
    position: "absolute",
  } as StyleValue,
  form: {
    width: "100%",
    height: "100%",
  } as StyleValue,
};

@Component()
export class LayoutInst extends VueComponent<LayoutProps> {
  static readonly defineProps: ComponentProps<LayoutProps> = [
    "inst",
    "searchForm",
    "toolButtons",
    "table",
    "pagination",
    "modal",
    "form",
  ];

  render(): VNodeChild {
    const { searchForm, form, modal, toolButtons, table, pagination } =
      this.props;
    return (
      <div style={styles.layoutContainer}>
        {searchForm || toolButtons ? (
          <Flex justify={"space-between"} style={styles.topArea}>
            <div class={"search-form"}>{searchForm?.()}</div>
            <div>{toolButtons?.()}</div>
          </Flex>
        ) : null}
        {table ? (
          <div style={styles.tableContainer} class={"table-container"}>
            <div style={styles.wrapTable}>{table()}</div>
          </div>
        ) : null}
        {pagination ? (
          <Flex justify={"flex-end"} style={styles.paginationContainer}>
            {pagination()}
          </Flex>
        ) : null}
        {modal ? <div style={styles.modal}>{modal()}</div> : null}
        {form ? <div style={styles.form}>{form()}</div> : null}
      </div>
    );
  }
}

export default toNative<LayoutProps>(LayoutInst);
