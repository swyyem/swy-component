import type { StoryObj } from '@storybook/vue3';
import type { ConcreteComponent } from 'vue';
import { ProTransfer } from '../index';
declare const meta: {
    title: string;
    component: ConcreteComponent;
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
type Story = StoryObj<typeof ProTransfer>;
export declare const Basic: Story;
