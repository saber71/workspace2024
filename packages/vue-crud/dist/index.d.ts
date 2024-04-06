/// <reference types="../types.d.ts" />

import { ButtonProps } from 'ant-design-vue';
import { CheckboxProps } from 'ant-design-vue';
import { FormItemProps } from 'ant-design-vue';
import { FormProps } from 'ant-design-vue';
import { HTMLAttributes } from 'vue';
import { InputNumberProps } from 'ant-design-vue';
import { InputProps } from 'ant-design-vue';

export declare const crudComponent: {
    form(prop?: FormProps & HTMLAttributes, children?: VNodeArray): Component;
    formItem(prop?: FormItemProps & HTMLAttributes, children?: VNodeArray): Component;
    input(prop?: InputProps & HTMLAttributes): Component;
    inputNumber(prop?: InputNumberProps & HTMLAttributes): Component;
    inputPassword(prop?: InputProps & HTMLAttributes): Component;
    checkbox(prop?: CheckboxProps & HTMLAttributes, children?: VNodeArray): Component;
    button(prop?: ButtonProps & HTMLAttributes, children?: VNodeArray): Component;
    submitButton(prop?: ButtonProps & HTMLAttributes, children?: VNodeArray): Component;
};

export declare function crudForm<T = any>(option: CrudFormOption): CrudForm<T>;

export { }
