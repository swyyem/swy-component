import type { Responsive } from './grid.types';
type __VLS_Props = {
    inline?: boolean;
    colStyle?: any;
    isCol?: boolean;
    offset?: number;
    span?: number;
    suffix?: boolean;
    xs?: Responsive;
    sm?: Responsive;
    md?: Responsive;
    lg?: Responsive;
    xl?: Responsive;
};
declare var __VLS_6: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_6) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    offset: number;
    suffix: boolean;
    isCol: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
