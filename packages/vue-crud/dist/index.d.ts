/// <reference types="../types.d.ts" />

import { Component } from 'vue';
import { ComponentProps } from 'vue-class';
import { DefineSetupFnComponent } from 'vue';
import { PaginationProps } from 'ant-design-vue';
import { PublicProps } from 'vue';
import { TableColumnProps } from 'ant-design-vue';
import { VNodeChild } from 'vue';
import { VueComponent } from 'vue-class';
import { VueComponentBaseProps } from 'vue-class';

export declare class CrudInst extends VueComponent<CrudProps> {
    static readonly defineProps: ComponentProps<CrudProps>;
    layout: Component;
    formModel: any;
    searchFormModel: any;
    addFormModel: any;
    editFormModel: any;
    dataSource: any[];
    tableColumnOptions: TableColumnProps[];
    curPage: number;
    pageSize: number;
    total: number;
    paginationOption?: PaginationProps;
    renderDefault?: RenderElement;
    renderButtons?: RenderElement;
    renderFormElements: Array<RenderElement>;
    renderSearchFormElements: Array<RenderElement>;
    renderAddFormElements: Array<RenderElement>;
    renderEditFormElements: Array<RenderElement>;
    visibleAddForm: boolean;
    visibleEditForm: boolean;
    get renderPagination(): RenderElement | undefined;
    get renderTable(): RenderElement | undefined;
    get renderForm(): RenderElement | undefined;
    get renderAddForm(): RenderElement | undefined;
    get renderEditForm(): RenderElement | undefined;
    get renderSearchForm(): RenderElement | undefined;
    get showPagination(): boolean;
    get showForm(): boolean;
    get showAddForm(): boolean;
    get showEditForm(): boolean;
    get showSearchForm(): boolean;
    get showTable(): boolean;
    buildPagination(): void;
    buildTableColumnOptions(): void;
    buildFormModel(): void;
    buildAddFormModel(): void;
    buildEditFormModel(): void;
    buildSearchFormModel(): void;
    setDataSource(): void;
    setLayout(): void;
    render(): VNodeChild;
}

export declare interface CrudProps extends VueComponentBaseProps {
    option: CrudOptions;
    dataSource?: any[] | PaginationResult;
}

declare const _default: DefineSetupFnComponent<CrudProps, {}, {}, CrudProps & {}, PublicProps>;
export default _default;

export declare const DefaultComponentProps: Partial<AntComponentPropsMap>;

export declare class LayoutInst extends VueComponent<LayoutProps> {
    static readonly defineProps: ComponentProps<LayoutProps>;
    render(): VNodeChild;
}

export declare interface LayoutProps extends VueComponentBaseProps {
    searchForm?: () => VNodeChild;
    buttons?: () => VNodeChild;
    table?: () => VNodeChild;
    pagination?: () => VNodeChild;
    default?: () => VNodeChild;
}

export declare function mergeDefaultComponentProps(componentName: string | undefined, ...props: Array<any | undefined>): any;

declare type RenderElement = () => VNodeChild;

export { }
