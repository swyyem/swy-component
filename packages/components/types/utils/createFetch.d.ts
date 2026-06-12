export declare function createFetch<P, R>(fn?: (params?: P) => Promise<R>, cb?: () => void): (params?: P) => Promise<R>;
