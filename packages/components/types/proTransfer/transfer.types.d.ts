import type { ProComponentObject, ProComponentAny } from '../common.types';
import type { ProTableProps, KeyType } from '../proTable/index';
export type ProTransferValueType = ProComponentObject[];
export type ProTransferDirection = 'left' | 'right';
export type ProTransferChangeMethod = (value: ProTransferValueType, direction: ProTransferDirection, movedKeys: ProTransferValueType) => void;
export type ProTransferPanelProps<T extends ProComponentObject = ProComponentObject> = {
    data: T[];
    tableProps: Partial<ProTableProps<T>>;
    valueKey?: string;
    checked: ProComponentAny[];
    checkedChange: (keys: KeyType[], rows: T[]) => void;
};
export type ProTransferFilterType<T> = (arr: T[], item: T) => boolean;
export type ProTransferProps<T extends ProComponentObject = ProComponentObject> = Pick<ProTransferPanelProps<T>, 'data' | 'tableProps' | 'valueKey'> & {
    modelValue?: ProComponentAny[];
    'onUpdate:modelValue': (value: ProComponentAny) => void;
    leftDefaultChecked?: ProComponentAny[];
    rightDefaultChecked?: ProComponentAny[];
    contentHeight?: number;
} & {
    onChange: ProTransferChangeMethod;
    onLeftCheckChange: (v: ProTransferValueType) => void;
    onRightCheckChange: (v: ProTransferValueType) => void;
};
