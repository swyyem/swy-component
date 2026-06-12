import type { StoryObj } from '@storybook/vue3';
import ProDialog from '../proDialog';
declare const meta: {
    title: string;
    component: {
        new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("../proDialog").hisDialogProps> & Readonly<{
            "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
        }>, {
            onBeforeClose: (fn: (doneFn?: import("../proDialog").DoneFn) => void) => Promise<void>;
            closeMessage: (fn?: (doneFn?: import("../proDialog").DoneFn) => void) => void;
        }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
            "update:modelValue": (...args: any[]) => void;
        }, import("vue").PublicProps, {
            type: import("../proDialog").Type;
            footer: boolean;
            modelValue: boolean;
            width: string | number;
            appendTo: string | HTMLElement;
            draggable: boolean;
            showClose: boolean;
            destroyOnClose: boolean;
            closeOnClickModal: boolean;
            closeOnPressEscape: boolean;
            lockScroll: boolean;
            modal: boolean;
            hasPadding: boolean;
            dialogType: import("../proDialog").DialogType;
            inTableRolling: boolean;
            okText: string;
            cancelText: string;
        }, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly<import("../proDialog").hisDialogProps> & Readonly<{
            "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
        }>, {
            onBeforeClose: (fn: (doneFn?: import("../proDialog").DoneFn) => void) => Promise<void>;
            closeMessage: (fn?: (doneFn?: import("../proDialog").DoneFn) => void) => void;
        }, {}, {}, {}, {
            type: import("../proDialog").Type;
            footer: boolean;
            modelValue: boolean;
            width: string | number;
            appendTo: string | HTMLElement;
            draggable: boolean;
            showClose: boolean;
            destroyOnClose: boolean;
            closeOnClickModal: boolean;
            closeOnPressEscape: boolean;
            lockScroll: boolean;
            modal: boolean;
            hasPadding: boolean;
            dialogType: import("../proDialog").DialogType;
            inTableRolling: boolean;
            okText: string;
            cancelText: string;
        }>;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } & import("vue").ComponentOptionsBase<Readonly<import("../proDialog").hisDialogProps> & Readonly<{
        "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    }>, {
        onBeforeClose: (fn: (doneFn?: import("../proDialog").DoneFn) => void) => Promise<void>;
        closeMessage: (fn?: (doneFn?: import("../proDialog").DoneFn) => void) => void;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        "update:modelValue": (...args: any[]) => void;
    }, string, {
        type: import("../proDialog").Type;
        footer: boolean;
        modelValue: boolean;
        width: string | number;
        appendTo: string | HTMLElement;
        draggable: boolean;
        showClose: boolean;
        destroyOnClose: boolean;
        closeOnClickModal: boolean;
        closeOnPressEscape: boolean;
        lockScroll: boolean;
        modal: boolean;
        hasPadding: boolean;
        dialogType: import("../proDialog").DialogType;
        inTableRolling: boolean;
        okText: string;
        cancelText: string;
    }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
        $slots: {
            'dialog-footer'?: (props: {}) => any;
        } & {
            footer?: (props: {}) => any;
        };
    });
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
type Story = StoryObj<typeof ProDialog>;
export declare const Basic: Story;
export declare const Form: Story;
