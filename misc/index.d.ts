declare interface OnChangeCallback<T> {
    (value: T): void;
}

declare class Observable<T> {
    private listeners?: OnChangeCallback<T>[];
    get(): T;
    set(value: T): void;

    ifNotNull(func: (value: T) => void): void;

    static of<T>(startingValue: T): Observable<T>;

    static and(...observables: Observable<boolean>[]): Observable<boolean>;
    static or(...observables: Observable<boolean>[]): Observable<boolean>;

    constructor (getter: () => T, setter?: (value: T) => T, runChangeCallbackOnSet?: boolean);

    onChange(callback: OnChangeCallback<T>): this;
}

declare const fallThoughEndec: Endec<any, any>;

declare interface Settings {
    get<T>(key: string): T;
    set<T>(key: string, value: T): T;
    onMutation<T>(key: string, callback: (key: string, oldValue: T, newValue: T) => void): void;
    of<T>(key: string, defaultValue: T, endec?: Endec<T, any>): Setting<T>;
    of<T>(key: string, defaultValue: T, endec?: AsyncEndec<T, any>): Promise<Setting<T>>;
}

declare class KeyedObservable<T> extends Observable<T> {
    get key(): string;

    constructor (key: string, getter: (key: string) => T, setter?: (value: T) => T, runChangeCallbackOnSet?: boolean);
}

declare class Setting<T> extends KeyedObservable<T> {

    get defaultValue(): T;
    get endec(): Endec<T, any>;

    constructor (settings: Settings, key: string, defaultValue: T, endec?: Endec<T, any>|AsyncEndec<T, any>);

    static of<T>(settings: Settings, key: string, defaultValue: T, endec?: Endec<T, any>): Setting<T>;
    static of<T>(settings: Settings, key: string, defaultValue: T, endec?: AsyncEndec<T, any>): Promise<Setting<T>>;
}

declare class Endec<T, B> {
    constructor (decode: (value: B) => T, encode: (value: T) => B);
    decode(value: B): T;
    encode(value: T ): B;
}

declare class AsyncEndec<T, B> {
    constructor (decode: (value: B) => Promise<T>, encode: (value: T) => Promise<B>);
    decode(value: B): Promise<T>;
    encode(value: T ): Promise<B>;
}

declare class TreeNode<N extends TreeNode<N>> {
    parent: TreeNode<N> | null;
    children: Map<string, N>;
    name: string;
    path: string;

    constructor(parent: TreeNode<N> | null, name: string, path: string);

    sort(compare: ((a: N, b: N) => number) | undefined): this;
}

declare function getFromCollectionValidated<T>(obj: Collection<T>, key, defaultKey): T;

declare function getFromCollection<T>(obj: Collection<T>, key: string): T;

declare function validateKeyWithCollection<T>(obj: Collection<T>, key, defaultKey): T;

declare function isGeneralAllowedStatusCode(status: number): boolean;

declare function sleep(ms: number): Promise<void>;

declare function waitForElementValue(selector: string, getter: (element: Element) => Element, interval?: number): Promise<Element>;