import type { StoryObj } from '@storybook/vue3';
import { QueryFilter } from '../index';
declare const meta: {
    title: string;
    component: import("vue").DefineComponent<import("../queryFilter/queryFilter.types").QueryFilterProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("../queryFilter/queryFilter.types").QueryFilterProps> & Readonly<{}>, {
        grid: boolean;
        searchBtn: boolean;
        gutter: number;
        collapsed: boolean;
        showCollapse: boolean;
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
    tags: string[];
    argTypes: {
        submitter: {
            control: "object";
            description: string;
        };
    };
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
type Story = StoryObj<typeof QueryFilter>;
export declare const Basic: Story;
