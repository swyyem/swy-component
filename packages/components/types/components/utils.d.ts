import type { PropFormFieldProps } from '../form/form.types';
import type { ProFieldPropsType, ProFieldValueType, ProFieldValueTypeWithFieldProps } from '../proField/index.type';
import type { Component } from 'vue';
export declare function getProFormFieldInitProps(params?: any): any;
export declare const getProFormFieldProps: <T extends keyof ProFieldValueTypeWithFieldProps>(props: PropFormFieldProps, fieldProps?: Partial<ProFieldValueTypeWithFieldProps[T]>) => {
    name: string | string[];
    effects: import("..").EffectType[] | undefined;
    layout: boolean | undefined;
    label: string | undefined;
    labelWidth: string | number | undefined;
    labelPosition: "" | "right" | "top" | "left" | undefined;
    required: boolean | undefined;
    rules: import("element-plus/es/utils/typescript.mjs").Arrayable<import("element-plus").FormItemRule> | undefined;
    error: string | undefined;
    validateStatus: "" | "error" | "success" | "validating" | undefined;
    inlineMessage: boolean | undefined;
    showMessage: boolean | undefined;
    size: "" | "default" | "small" | "large" | undefined;
    for: "" | "default" | "small" | "large" | undefined;
    colon: boolean | undefined;
    hasLabelSpace: boolean | undefined;
    display: import("..").DisplayEnum | undefined;
    request: import("..").ProFieldRequestData | import("..").TableRequest<import("..").AnyObject> | undefined;
    mode: import("..").ProFieldFCMode | undefined;
    fieldProps: any;
    params: string | string[] | undefined;
    valueEnum: (string | import("..").ProSchemaValueEnumType)[] | undefined;
    onValueChange: ((value: any) => void) | undefined;
};
export declare const getProFieldProps: (props: ProFieldPropsType, valueType: ProFieldValueType, params?: any) => any;
export declare const defaultComponentMap: Record<string, Component>;
/**
 * 注册组件
 * @param param 组件名称（字符串）或组件对象（键值对）
 * @param component 组件实例（当 param 为字符串时必填）
 */
export declare const registerFieldComponent: (param: string | Record<string, Component>, component?: Component) => void;
/**
 * 获取组件映射，包含内置的组件
 */
export declare const getComponentMap: () => Record<string, Component>;
