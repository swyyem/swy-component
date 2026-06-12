import type { ProOptionProps, ProOptionStates } from './select.types';
export declare function useOption(props: ProOptionProps, states: ProOptionStates): {
    currentLabel: import("vue").ComputedRef<any>;
    currentValue: import("vue").ComputedRef<any>;
    itemSelected: import("vue").ComputedRef<boolean>;
    isDisabled: import("vue").ComputedRef<boolean>;
    hoverItem: () => void;
    updateOption: (query: string) => void;
};
