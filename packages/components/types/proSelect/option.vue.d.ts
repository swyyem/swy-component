import { type VNodeChild, type PropType } from 'vue';
import type { ProOptionExposed } from './select.types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    value: {
        type: (ObjectConstructor | BooleanConstructor | StringConstructor | NumberConstructor)[];
        required: true;
    };
    label: {
        type: PropType<VNodeChild>;
    };
    created: BooleanConstructor;
    disabled: BooleanConstructor;
    optionData: {
        type: ObjectConstructor;
        default: () => {};
    };
}>, ProOptionExposed, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    value: {
        type: (ObjectConstructor | BooleanConstructor | StringConstructor | NumberConstructor)[];
        required: true;
    };
    label: {
        type: PropType<VNodeChild>;
    };
    created: BooleanConstructor;
    disabled: BooleanConstructor;
    optionData: {
        type: ObjectConstructor;
        default: () => {};
    };
}>> & Readonly<{}>, {
    disabled: boolean;
    optionData: Record<string, any>;
    created: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
