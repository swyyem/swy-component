import type { StoryObj } from '@storybook/vue3';
import { ProInputTag } from '../index';
declare const meta: {
    title: string;
    component: import("vue").DefineComponent<import("../proInputTag").ProInputTagProps, {
        focus: () => void;
        blur: () => void;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
        "update:modelValue": (val: any[]) => any;
        "remove-tag": (val: any) => any;
    }, string, import("vue").PublicProps, Readonly<import("../proInputTag").ProInputTagProps> & Readonly<{
        "onUpdate:modelValue"?: ((val: any[]) => any) | undefined;
        "onRemove-tag"?: ((val: any) => any) | undefined;
    }>, {
        effect: import("element-plus").SelectProps["effect"];
        popperClass: string;
        fitInputWidth: boolean;
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
    tags: string[];
    parameters: {
        docs: {
            description: {
                component: string;
            };
        };
    };
};
export default meta;
type Story = StoryObj<typeof ProInputTag>;
export declare const Basic: Story;
