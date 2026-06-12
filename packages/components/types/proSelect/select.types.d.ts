import type { ComponentPublicInstance, ComponentInternalInstance, ComputedRef, Ref, VNodeChild } from 'vue';
import type { SelectProps, Options } from 'element-plus';
import type { ProComponentObject } from '../common.types';
import type { ProTableProps } from '../proTable';
import type { ProSchemaValueEnumType } from '../proField';
type ProSelectValue = any;
export type ProOptionValue = ProSelectValue;
export type ProOptionProps = {
    value: ProSelectValue;
    label?: string | number | VNodeChild;
    created?: boolean;
    disabled?: boolean;
};
export interface ProOptionStates {
    index: number;
    groupDisabled: boolean;
    visible: boolean;
    hover: boolean;
}
export interface ProSelectContext {
    props: ProSelectDefaultProps;
    states: ProSelectStates;
    selectRef: Ref<HTMLElement | undefined>;
    optionsArray: ComputedRef<ProOptionPublicInstance[]>;
    setSelected(): void;
    onOptionCreate(vm: ProOptionPublicInstance): void;
    onOptionDestroy(key: ProSelectValue, vm: ProOptionPublicInstance): void;
    handleOptionSelect(vm: ProOptionPublicInstance): void;
}
export type ProOptionExposed = {
    ns: unknown;
    id: Ref<string>;
    containerKls: unknown;
    currentLabel: ComputedRef<string | number | boolean>;
    itemSelected: ComputedRef<boolean>;
    isDisabled: ComputedRef<boolean>;
    visible: Ref<boolean>;
    hover: Ref<boolean>;
    states: ProOptionStates;
    select: ProSelectContext;
    optionData: ProSchemaValueEnumType;
    hoverItem: () => void;
    updateOption: (query: string) => void;
    selectOptionClick: () => void;
};
export type ProOptionPublicInstance = ComponentPublicInstance<ProOptionProps, ProOptionExposed>;
export type ProOptionInternalInstance = ComponentInternalInstance & {
    proxy: ProOptionPublicInstance;
};
export type ProOptionBasic = {
    value: ProSelectValue;
    currentLabel: ProOptionPublicInstance['currentLabel'];
    isDisabled?: ProOptionPublicInstance['isDisabled'];
};
export type ProSelectStates = {
    inputValue: string;
    options: Map<ProSelectValue, ProOptionPublicInstance>;
    cachedOptions: Map<ProSelectValue, ProOptionPublicInstance>;
    optionValues: ProSelectValue[];
    selected: ProOptionBasic[];
    hoveringIndex: number;
    inputHovering: boolean;
    selectionWidth: number;
    collapseItemWidth: number;
    previousQuery: string | null;
    selectedLabel: string;
    menuVisibleOnFocus: boolean;
    isBeforeHide: boolean;
};
export type ProSelectEnhanceProps<T extends ProComponentObject = ProComponentObject> = {
    /** 绑定的值，可 v-model */
    modelValue?: ProSelectValue;
    /** 绑定的输入框的值，可 v-model:keyword */
    keyword?: string;
    /** 默认显示在文本框中的值，通常用于下拉数据是动态时 label 正常回显 */
    defaultLabel?: string | string[];
    /** 下拉面板宽度 */
    contentWidth?: number;
    /** 下拉面板的高度 */
    contentHeight?: number;
    /**  options 的默认数据，非受控 */
    defaultValueEnum?: ProSchemaValueEnumType[];
    /** options 的数据，受控模式，需要配合 onValueEnumChange */
    valueEnum?: ProSchemaValueEnumType[];
    /** valueEnum 受控回调方法 */
    handleValueEnumChange?: (valueEnum: ProSchemaValueEnumType[]) => void;
    /** 是都手动请求，默认 false */
    manualRequest?: boolean;
    /** 下拉加载数据，需要配合 remoteMethod 使用，如开启表格则同 tableProps 中的 waterfall */
    waterfall?: boolean;
    /** 表格属性，传入则开启表格模式，下拉内容渲染成表格，其他自定义的方式都失效 */
    tableProps?: Partial<ProTableProps<T>>;
    /** 表格模式下的 label 展示，表格模式下必填 */
    labelKey?: string | ((v: T) => string);
    /** input name */
    name?: string;
    /** input id */
    id?: string;
    /** input autocomplete */
    autocomplete?: string;
    /** 当 select 获得焦点，下拉内容展示 */
    automaticDropdown?: boolean;
    /** input 尺寸 */
    size?: SelectProps['size'];
    /** theme 配置 */
    effect?: SelectProps['effect'];
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否显示清除 icon */
    clearable?: boolean;
    /** 是否开启筛选 */
    filterable?: boolean;
    /** 是否可新增 */
    allowCreate?: boolean;
    /** loading 文案，默认 loading */
    loadingText?: string;
    /** 选择器下拉菜单的自定义类名 */
    popperClass?: string;
    /** popperjs 的参数 */
    popperOptions?: Partial<Options>;
    /** filter 没有匹配时展示的文案，默认 'No matching data' */
    noMatchText?: string;
    /** 无选项时显示的文字，默认 'No data' */
    noDataText?: string;
    /** 获取远程数据的方法，返回 promise。如开启表格则同 tableProps 中的 request */
    remoteMethod?: (v?: ProSelectValue) => Promise<any>;
    /**  */
    params?: Record<string, any>;
    /** 自定义 filter 规则 */
    filterMethod?: (v?: ProSelectValue) => void;
    /** 是否多选，如开启表格则同 tableProps 中的 multiple */
    multiple?: boolean;
    /** 当多选开启时，最大的选择数量 */
    multipleLimit?: number;
    /** 占位符，默认为'Select' */
    placeholder?: string;
    /** 是否在输入框按下回车时，选择第一个匹配项。 需配合 filterable 使用 */
    defaultFirstOption?: boolean;
    /** 当 multiple 和 filterable 被设置为 true 时，是否在选中一个选项后保留当前的搜索关键词 */
    reserveKeyword?: boolean;
    /** 作为 value 唯一标识的键名，绑定值为对象类型时必填 */
    valueKey?: string;
    /** 多选时是否将选中值按文字的形式展示 */
    collapseTags?: boolean;
    /** 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。 要使用此属性，collapse-tags属性必须设定为 true */
    collapseTagsTooltip?: boolean;
    /** 需要显示的 Tag 的最大数量 只有当 collapse-tags 设置为 true 时才会生效。 */
    maxCollapseTags?: number;
    /** 是否使用 teleport。设置成 true则会被追加到 append-to 的位置 */
    teleported?: boolean;
    /** 下拉框挂载到哪个 DOM 元素	 */
    appendTo?: SelectProps['appendTo'];
    /** 当下拉选择器未被激活并且persistent设置为false，选择器会被删除 */
    persistent?: boolean;
    /** 自定义清除图标 */
    clearIcon?: SelectProps['clearIcon'];
    /** 下拉框的宽度是否与输入框相同	 */
    fitInputWidth?: boolean;
    /** 自定义后缀图标组件 */
    suffixIcon?: SelectProps['suffixIcon'];
    /** 标签类型 */
    tagType?: SelectProps['tagType'];
    /** 标签效果 */
    tagEffect?: SelectProps['tagEffect'];
    /** 是否触发表单验证 */
    validateEvent?: boolean;
    /** 远程搜索方法显示后缀图标 */
    remoteShowSuffix?: boolean;
    /** 下拉面板偏移量 */
    offset?: number;
    /** 下拉框出现的位置 */
    placement?: SelectProps['placement'];
    /** dropdown 可用的 positions */
    fallbackPlacements?: SelectProps['fallbackPlacements'];
    /** input 的 tabindex */
    tabindex?: string | number;
    /** 是否展示内容附属的箭头  */
    showArrow?: boolean;
    /** 开启输入关键字后才请求 */
    keywordRequest?: boolean;
    /** 键盘事件 */
    handleKeyDown?: (e: KeyboardEvent) => boolean;
    /** 开启全选，开启时 multiple 必须为 true，否则失效 */
    checkAll?: boolean;
    /** 全选的文案，默认'全部' */
    checkAllText?: string;
};
export type ProSelectDefaultProps = ProSelectEnhanceProps & {
    multipleLimit: number;
    valueKey: string;
    /** 获取额外的value，类型 object，作用是在组件外使用 */
    extraValueKey?: ProSelectValue;
};
export type ProSelectInstance = {
    selectedLabel: ComputedRef<string | string[]>;
    getText: (v: any) => any;
    focus: () => void;
    blur: () => void;
};
export type ProSelectScrollParams = {
    scrollTop: number;
    scrollLeft: number;
    scrollHeight: number;
    scrollWidth: number;
    clientHeight: number;
    clientWidth: number;
};
export type ProSelectEmits = {
    (e: 'update:modelValue', val: ProSelectValue): void;
    (e: 'update:option', val?: ProSchemaValueEnumType | ProSchemaValueEnumType[]): void;
    (e: 'update:keyword', val?: string): void;
    (e: 'change', val: ProSelectValue): void;
    (e: 'popup-scroll', params: ProSelectScrollParams): void;
    (e: 'remove-tag', val: unknown): void;
    (e: 'visible-change', visible: boolean): void;
    (e: 'focus', v: FocusEvent): void;
    (e: 'blur', v: FocusEvent): void;
    (e: 'keydown:enter'): void;
    (e: 'clear'): void;
};
export {};
