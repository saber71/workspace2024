/// <reference types="../types.d.ts" />

import { ButtonProps } from 'ant-design-vue';
import { CheckboxProps } from 'ant-design-vue';
import { FormItemProps } from 'ant-design-vue';
import { FormProps } from 'ant-design-vue';
import { HTMLAttributes } from 'vue';
import { InputNumberProps } from 'ant-design-vue';
import { InputProps } from 'ant-design-vue';
import { SelectProps } from 'ant-design-vue';
import { TableProps } from 'ant-design-vue';

export declare const crudComponent: {
    crudForm(option: Omit<CrudFormOption, "model">, recordAsModel?: boolean): Component;
    crudTable(option: Omit<CrudTableOption, "dataSource">): Component;
    form(prop?: FormProps & HTMLAttributes, children?: VNodeArray, recordAsModel?: boolean): Component;
    formItem(prop?: FormItemProps & HTMLAttributes, children?: VNodeArray): Component;
    input(prop?: InputProps & HTMLAttributes): Component;
    inputNumber(prop?: InputNumberProps & HTMLAttributes): Component;
    inputPassword(prop?: InputProps & HTMLAttributes): Component;
    checkbox(prop?: CheckboxProps & HTMLAttributes, children?: VNodeArray): Component;
    button(prop?: ButtonProps & HTMLAttributes, children?: VNodeArray): Component;
    submitButton(prop?: ButtonProps & HTMLAttributes, children?: VNodeArray): Component;
    select(prop?: SelectProps & HTMLAttributes, options?: Array<SelectOptionData>): Component;
    table(prop?: TableProps & HTMLAttributes, recordAsDataSource?: boolean): Component;
    renderPlaceholder(attr?: HTMLAttributes, placeholder?: string): Component;
};

export declare function crudForm<T = any>(option: CrudFormOption): CrudForm<T>;

export declare function crudTable(option: CrudTableOption): CrudTable;

export { }
