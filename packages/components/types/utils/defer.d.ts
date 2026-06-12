type Callback = () => void;
export type DeferredExcutorType = {
    reset: () => void;
    add: (v: Callback) => void;
    exec: () => void;
};
export declare const createDeferredExecutor: () => {
    reset(): void;
    add(cb: Callback): void;
    exec(): void;
};
export {};
