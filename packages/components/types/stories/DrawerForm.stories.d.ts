import type { StoryObj } from '@storybook/vue3';
import { DrawerForm } from '../index';
declare const meta: {
    title: string;
    component: {
        new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("../form").DrawerFormProps> & Readonly<{
            "onUpdate:open"?: ((value: boolean) => any) | undefined;
        }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
            "update:open": (value: boolean) => any;
        }, import("vue").PublicProps, {
            open: boolean;
        }, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly<import("../form").DrawerFormProps> & Readonly<{
            "onUpdate:open"?: ((value: boolean) => any) | undefined;
        }>, {}, {}, {}, {}, {
            open: boolean;
        }>;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } & import("vue").ComponentOptionsBase<Readonly<import("../form").DrawerFormProps> & Readonly<{
        "onUpdate:open"?: ((value: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        "update:open": (value: boolean) => any;
    }, string, {
        open: boolean;
    }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
        $slots: {
            trigger?: (props: {
                onClick: () => void;
            }) => any;
        } & {
            default?: (props: {}) => any;
        };
    });
    tags: string[];
    parameters: {
        docs: {
            description: {
                component: string;
            };
            type: {
                showType: boolean;
                expandType: boolean;
            };
        };
    };
};
export default meta;
type Story = StoryObj<typeof DrawerForm>;
export declare const Basic: Story;
export declare const 受控模式: Story;
