import type { VNodeChild, VNode, ExtractPropTypes, Component, StyleValue } from 'vue';
import type { AutocompleteProps, InputProps, InputNumberProps, SelectProps, CheckboxGroupProps, CheckboxProps, RadioGroupProps, RateProps, SwitchProps, SliderProps, AvatarProps, ImageProps, ColorPickerProps, SegmentedProps, DividerProps, InputTagProps, MentionProps, SelectV2Props, TimePickerDefaultProps, TimeSelectProps, TransferProps, UploadProps, ButtonProps, DatePickerProps, OptionV2Props } from 'element-plus';
import type { cascaderProps } from 'element-plus';
import type { ProSelectEnhanceProps } from '../proSelect';
import type { TextSpecifiledProps } from './components/text/type';
import type { TableRequest, AnyObject } from '../proTable/table.types';
import type { ProTableProps } from '../proTable/proTable.types';
interface unloadProp extends UploadProps {
    'file-list'?: unknown[];
}
/**
 * 字段值类型与 ProFieldProps 的映射关系
 */
type NumberFormatOptionsType = {
    /** 本地化，如 zh-CN、en-US */
    locale?: string;
    /** "decimal", "currency", "percent" */
    typeStyle?: string;
    /** 如 "USD", "CNY"（需配合 style: "currency"） */
    currency?: string;
    /** 小数位数，默认 2 */
    decimalPlaces?: number;
    /** 是否启用千分位分隔，默认 true */
    useGrouping?: boolean;
    /** 是否靠右 */
    textRight?: boolean;
    onInput?: (val: string) => void;
};
export type ProInputPriceProps = InputProps & NumberFormatOptionsType;
export type ProInputNumberProps = InputNumberProps & NumberFormatOptionsType;
type ProCheckboxBaseProps = {
    multiple?: boolean;
    readContinue?: boolean;
    checkAll?: boolean;
    checkAllText?: string;
    gap?: number;
    style?: Partial<CSSStyleDeclaration>;
    'onUpdate:modelValue'?: (val: ProSchemaValueEnumValue[] | ProSchemaValueEnumValue) => void;
    onKeydown?: (e: KeyboardEvent) => void;
};
export type ProCheckboxProps = (CheckboxGroupProps | CheckboxProps) & ProCheckboxBaseProps;
export type ProSingleCheckboxProps = CheckboxProps & ProCheckboxBaseProps;
export type ProRadioGroupProps = RadioGroupProps & {
    onKeydown?: (e: KeyboardEvent) => void;
};
export type ProSelectProps = SelectProps & {
    checkAll?: boolean;
    checkAllText?: string;
    style?: StyleValue;
    'onUpdate:modelValue'?: (val: ProSchemaValueEnumValue[] | ProSchemaValueEnumValue) => void;
};
export type ProFieldControlInstance = {
    getText: (val: any) => any;
    getChild: () => any;
    childRef: any;
};
export type ProFieldInstance = {
    getText: (val: any) => any;
    getControlRef: () => any;
    childRef: any;
};
export type ProFieldValueTypeWithFieldProps = {
    text: InputProps;
    autocomplete: AutocompleteProps;
    inputNumber: InputNumberProps;
    select: ProSelectProps;
    checkbox: ProCheckboxProps;
    price: ProInputPriceProps;
    radio: ProRadioGroupProps;
    rate: RateProps;
    slider: SliderProps;
    switch: SwitchProps;
    avatar: AvatarProps;
    image: ImageProps;
    cascader: ExtractPropTypes<typeof cascaderProps>;
    colorPicker: ColorPickerProps;
    segmented: SegmentedProps;
    divider: DividerProps;
    inputTag: InputTagProps;
    mention: MentionProps;
    selectV2: SelectV2Props;
    timePicker: TimePickerDefaultProps;
    timeSelect: TimeSelectProps;
    transfer: TransferProps;
    treeSelect: any;
    upload: unloadProp;
    button: ButtonProps;
    datePicker: DatePickerProps;
    selectEnhance: ProSelectEnhanceProps;
    datePickerV2: DatePickerProps;
    option: OptionV2Props;
    table: ProTableProps;
};
/**
 * ProField 的值类型
 */
export type ProFieldValueType = Extract<keyof ProFieldValueTypeWithFieldProps, unknown> | (string & {});
/**
 * ProField 的mode
 */
export type ProFieldFCMode = 'read' | 'edit';
export type ProFieldRequestData = (data?: any) => Promise<Array<ProSchemaValueEnumType | string>>;
export type ProSchemaValueEnumValue = any;
/**
 * 用于配置 ValueEnum 的通用配置
 */
export type ProSchemaValueEnumType = {
    /** @name 演示的文案 */
    label: VNodeChild;
    /** @name 保存的值 */
    value: ProSchemaValueEnumValue;
    /** @name 预定的颜色 */
    status?: string;
    /** @name 自定义的颜色 */
    color?: string;
    /** @name 是否禁用 */
    disabled?: boolean;
    /** @name 其他自定义属性。 */
    [key: string]: any;
};
export type ProFieldPropsType<T extends ProFieldValueType = ProFieldValueType> = {
    /**
     * 组件的模式，只读与编辑
     */
    mode?: ProFieldFCMode;
    /**
     * 空态显示的内容
     */
    emptyText?: string;
    /**
     * 渲染的组件类型
     */
    valueType?: T;
    /**
     * 放到valueType组件上的属性
     */
    fieldProps?: T extends keyof ProFieldValueTypeWithFieldProps ? ProFieldValueTypeWithFieldProps[T] : any;
    textProps?: Omit<TextSpecifiledProps, 'copyText'>;
    /**
     * v-model 绑定的值
     * */
    modelValue?: any;
    /** selectEnhance 的 option 选项 */
    optionData?: any;
    /**
     * 字段的 label
     */
    /**
     * 编辑模式下自定义渲染组件,text(组件双向绑定的值), props(组件绑定的props), dom(组件的类型),参数可以选择使用
     */
    renderFormItem?: ((text: any, props: any, dom: VNode) => VNode) | undefined;
    /**
     * 只读模式下自定义渲染组件,text(组件双向绑定的值), props(组件绑定的props),
     */
    render?: ((text: any, props: any) => VNode) | undefined;
    /**
     * 枚举,处理有子项组件的子组件渲染所需的数据，支持单选，多选，下拉等
     */
    valueEnum?: Array<ProSchemaValueEnumType | string>;
    /**
     * 远程处理有子项组件的子组件渲染所需的数据，支持单选，多选，下拉等
     */
    request?: ProFieldRequestData | TableRequest<AnyObject>;
    /**
     * 作为参数，会传递给request
     */
    params?: any;
    debounceTime?: number;
    /**
     * valueType是button时使用，作为按钮的文案|作为Dragger的文案
     */
    title?: string;
    /**
     * valueType是button时使用，作为按钮的图标|作为Dragger的图标
     */
    icon?: Component;
    /**
     * valueType是button时使用，作为Dragger 的描述
     */
    description?: string;
};
export {};
