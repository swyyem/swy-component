import type { ProSelectEnhanceProps } from './select.types';
type __VLS_Props = ProSelectEnhanceProps;
declare var __VLS_12: {}, __VLS_14: {}, __VLS_24: {
    label: string | number | boolean;
    value: any;
}, __VLS_44: {
    label: string | number | boolean;
    value: any;
}, __VLS_46: {
    label: string;
    value: any;
}, __VLS_89: {}, __VLS_111: {}, __VLS_113: {}, __VLS_115: {};
type __VLS_Slots = {} & {
    prefix?: (props: typeof __VLS_12) => any;
} & {
    tag?: (props: typeof __VLS_14) => any;
} & {
    label?: (props: typeof __VLS_24) => any;
} & {
    label?: (props: typeof __VLS_44) => any;
} & {
    label?: (props: typeof __VLS_46) => any;
} & {
    header?: (props: typeof __VLS_89) => any;
} & {
    loading?: (props: typeof __VLS_111) => any;
} & {
    empty?: (props: typeof __VLS_113) => any;
} & {
    footer?: (props: typeof __VLS_115) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {
    selectedLabel: import("vue").ComputedRef<string | string[]>;
    getText: (v: any) => any;
    focus: () => void;
    blur: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    disabled: boolean;
    tabindex: string | number;
    autocomplete: string;
    effect: import("element-plus").SelectProps["effect"];
    offset: number;
    placement: import("element-plus").SelectProps["placement"];
    popperClass: string;
    popperOptions: Partial<import("element-plus").Options>;
    showArrow: boolean;
    fallbackPlacements: import("element-plus").SelectProps["fallbackPlacements"];
    teleported: boolean;
    multiple: boolean;
    waterfall: boolean;
    validateEvent: boolean;
    persistent: boolean;
    manualRequest: boolean;
    valueKey: string;
    automaticDropdown: boolean;
    clearable: boolean;
    filterable: boolean;
    allowCreate: boolean;
    multipleLimit: number;
    defaultFirstOption: boolean;
    reserveKeyword: boolean;
    collapseTagsTooltip: boolean;
    maxCollapseTags: number;
    clearIcon: import("element-plus").SelectProps["clearIcon"];
    fitInputWidth: boolean;
    suffixIcon: import("element-plus").SelectProps["suffixIcon"];
    tagType: import("element-plus").SelectProps["tagType"];
    tagEffect: import("element-plus").SelectProps["tagEffect"];
    remoteShowSuffix: boolean;
    checkAll: boolean;
    checkAllText: string;
    contentHeight: number;
    keywordRequest: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
