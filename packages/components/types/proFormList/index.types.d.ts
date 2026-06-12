import type { VNode, Ref } from 'vue';
import type { PropFormFieldProps } from '../form/form.types';
export type FormListActionGuard = {
    /**
     * @name 添加行之前的钩子，返回false，会阻止这个行为
     *
     * @example 阻止新增 beforeAddRow={()=> return false}
     */
    beforeAddRow?: (...params: [...Parameters<FormListOperation['add']>, number]) => boolean | Promise<boolean>;
    /**
     * @name 删除行之前的钩子，返回false，会阻止这个行为
     *
     * @example 阻止删除 beforeAddRow={()=> return false}
     */
    beforeRemoveRow?: (...params: [...Parameters<FormListOperation['remove']>, number]) => boolean | Promise<boolean>;
};
export interface FormListOperation {
    add: (defaultValue?: any, insertIndex?: number) => void;
    remove: (index: number | number[]) => void;
    move: (from: number, to: number) => void;
}
export type FormListActionType<T = any> = FormListOperation & {
    get: (index: number) => T | undefined;
    getList: () => T[] | undefined;
};
export interface FormListFieldData {
    name: number;
    key: number;
}
export type IconConfig = {
    /**
     * 新的icon的组件，我们会将其实例化
     * Icon: ()=> <div/>
     */
    Icon?: VNode;
    /**
     * tooltip 的提示文案
     */
    tooltipText?: string;
};
export type ProFormListProps = Pick<PropFormFieldProps, 'label' | 'name'> & {
    /** 自定义 Item，可以用来将 action 放到别的地方 */
    itemRender?: (dom: {
        listDom: VNode;
        action: VNode;
    }) => VNode;
    /** 新建一行的默认值 */
    creatorRecord?: Record<string, any> | (() => Record<string, any>);
    /** 当前 List 的自带操作，可以增删改查列表项	{add,remove,move,get} */
    actionRef?: Ref<FormListActionType<any> | undefined>;
    /** FormItem 的拦截器，包含删除和添加的拦截 */
    actionGuard?: FormListActionGuard;
    /** 允许增加的最少条数，删除时校验 */
    min?: number;
    /** 允许增加的最大条数 */
    max?: number;
    copyIconProps?: IconConfig | false;
    deleteIconProps?: IconConfig | false;
    actionRender?: (field: FormListFieldData, action: FormListOperation, defaultActionDom: VNode[], count: number) => VNode[];
    /** 数据新增成功回调 */
    onAfterAdd?: (...params: [...Parameters<FormListOperation['add']>, number]) => void;
    /** 数据移除成功回调 */
    onAfterRemove?: (...params: [...Parameters<FormListOperation['remove']>, number]) => void;
};
export type ProFormListDataType = {
    name: string;
    addColumnKey: (key: string) => void;
    removeColumnKey: (key: string) => void;
    onKeydownEnter: (key: string) => void;
};
