import type { ProColumn } from './table.types';
import type { ProComponentObject, ProComponentAny } from '../common.types';
export type ProTabeHeaderCellProps<T extends ProComponentObject> = Pick<ProColumn<T>, 'tooltip' | 'required' | 'dataKey'> & {
    column: ProComponentObject;
    columnIndex: number;
    class?: string;
};
declare const ProTabeHeaderCell: {
    <T extends ProComponentObject>(props: ProTabeHeaderCellProps<T>, { slots }: {
        slots: ProComponentAny;
    }): import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    displayName: string;
    inheritAttrs: boolean;
};
export default ProTabeHeaderCell;
