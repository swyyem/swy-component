import dayjs from 'dayjs';
import type { DateType } from '../datePicker.data';
export declare const partMap: Record<string, DateType>;
export declare function getPartRange(part: DateType): [number, number];
export declare function getDynamicPartRange(format: string, part: DateType): [number, number] | null;
export declare function formatByType(date: dayjs.Dayjs, type: string): string;
export declare function updateParts(parts: any, val: string): void;
export declare const typeFormatMap: Record<string, string>;
export declare const ranges: string[];
