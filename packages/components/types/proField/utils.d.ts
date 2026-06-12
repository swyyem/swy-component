import type { Component, Ref, VNode } from 'vue';
import type { ProSchemaValueEnumType } from './index.type';
/**
 * 注册组件
 * @param param 组件名称（字符串）或组件对象（键值对）
 * @param component 组件实例（当 param 为字符串时必填）
 */
export declare const registerComponent: (param: string | Record<string, Component>, component?: Component) => void;
/**
 * 获取组件映射，包含内置的组件
 */
export declare const getComponentMap: () => Record<string, Component>;
export declare const handleValueEnum: (props: any) => ProSchemaValueEnumType[];
export declare const handleOnlyRequest: (props: any) => Promise<ProSchemaValueEnumType[]>;
export declare const handleRequest: (props: any) => Promise<any[]>;
export declare const isEqual: (value: any, other: any) => boolean;
export declare const buildValueLabelMap: (options: any[], map?: Map<string | number, string>) => Map<string | number, string>;
export declare const getLabelFromValue: (value: any, valueLabelMap: Ref<Map<string | number, string>>) => string;
export declare const renderRead: (options: any, props: any) => {
    renderChildH: VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[];
    text: string;
};
export declare const formatModelValue: (modelValue: any, text?: string, format?: string) => string;
export declare const isEmpty: (value: any) => boolean;
export declare const filterDisabledOptions: (options: any[]) => any[];
