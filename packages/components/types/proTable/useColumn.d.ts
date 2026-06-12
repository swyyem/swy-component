import type { ProColumns } from './table.types';
import type { ProUnifyTableColumnsContext } from './proTable.types';
import type { ProComponentObject } from '../common.types';
import { type ComputedRef, type Ref } from 'vue';
export declare function useColumns<T extends ProComponentObject>(proColumns: Ref<ProColumns<T> | undefined>, editContext: ProUnifyTableColumnsContext<T>): ComputedRef<ProColumns<T>>;
