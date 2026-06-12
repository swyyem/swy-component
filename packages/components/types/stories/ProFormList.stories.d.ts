import type { StoryObj } from '@storybook/vue3';
import { type ConcreteComponent } from 'vue';
import { ProFormList } from '../index';
declare const meta: {
    title: string;
    component: ConcreteComponent;
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
type Story = StoryObj<typeof ProFormList>;
export declare const Basic: Story;
