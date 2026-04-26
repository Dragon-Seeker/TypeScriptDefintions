type Collection<T> = {[key: string]: T} | Map<String, T> | T[];

type Consumer<T> = (value: T) => void;

interface ElementOptions {
    tagName?: string;
    style?: StyleHandler;
}

interface ToggleStyler {
    initialStyles: (value: boolean) => {btnStyle: StyleHandler, spanStyle: StyleHandler}
    onChangeStyler: (value: boolean, btn: HTMLButtonElement, span: HTMLSpanElement) => void;
}

interface ElementsStaticConstructors {
    modal(title: string|Element, consumer: (dialog: HTMLExtendedDialogElement, parent: HTMLDivElement, topBar: HTMLModalTopBar) => Promise<void>): Promise<HTMLExtendedDialogElement>;
    modal(title: string|Element, consumer: (dialog: HTMLExtendedDialogElement, parent: HTMLDivElement, topBar: HTMLModalTopBar) => void): HTMLExtendedDialogElement;
    modalAs<T>(title: string|Element, func: (dialog: HTMLExtendedDialogElement, parent: HTMLDivElement, topBar: HTMLModalTopBar) => Promise<T>): Promise<T>;
    modalAs<T>(title: string|Element, func: (dialog: HTMLExtendedDialogElement, parent: HTMLDivElement, topBar: HTMLModalTopBar) => T): T;
    dialog(): HTMLExtendedDialogElement;
}

interface HTMLModalTopBar extends HTMLDivElement {
    titleElement: HTMLHeadingElement,
    closeBtnElement: HTMLButtonElement
}

declare var Elements: ElementsStaticConstructors;

type TypeRef<T> = () => T | { new (): T };

interface Element {
    /**
     * Method used to add a child element with custom CSS within javascript land
     */
    addTo<T>(type: { new (): T }, tagName?: string): T;

    modify(modifier: Consumer<this>): this;
    clearElements(): this;
    mergeAs<T extends this>(typeRef: TypeRef<T>, objectData: T): T;
    
    themed(themeId: ThemeId, consumer: Consumer<this>): this;

    div(): HTMLDivElement;
    column(): HTMLDivElement;
    row(): HTMLDivElement;

    header(type: string|number, text: string): HTMLHeadingElement;
    collapsible(tooltip: string, state: Observable<boolean>, consumer: (parent: HTMLDivElement) => void): HTMLDivElement;

    detail(title: string, titleClassName?: string): HTMLDetailsElement;
    editBox(id: string, innerText: string, canEditContents: boolean): HTMLEditBox;

    btn(name: string, color: string, action: (btn: HTMLButtonElement, ev: PointerEvent) => any): HTMLButtonElement
    toggleBtn(id: string, value: boolean, onToggle?: ((value: boolean, btn: HTMLButtonElement, span: HTMLSpanElement) => void), styler?: ToggleStyler): HTMLToggleElement;

    selection<T>(options: Collection<T>, defaultOption: string|number|T, entryHandler?: EntryHandler): ElementObservable<HTMLSelectElement, {key: string | number | T, value: T}>
    dataListInput(id: string, placeholder: string,  options: Collection<string>, defaultValue: string, width: string): HTMLInputElement;
    input(type: string, placeholder: string, defaultValue: string): HTMLInputElement;
}

interface HTMLEditBox extends HTMLDivElement {
    setValue(value: string): void;
    getValue(): string
}

interface HTMLToggleElement extends HTMLButtonElement {
    setValue(value: boolean): void;
}

type StyleData = {
    className?: string,
    classList?: string[],
    style?: CSSStyleDeclaration
}

type StyleHandler = {
    className?: string,
    classList?: string[],
    themeId?: ThemeId,
    styleId?: StyleId,
    style?: CSSStyleDeclaration,
}

type ElementHandler = { id?: ElementId, name?: string, title?: string, attr?: {[qualifiedName: string]: string} };

type ElementId = string;

// TODO: WORK OUT SOME WAY TO HOLD LIKE A STYLIZED BUILDER OBJECT TYPE THING WHERE YOU GIVEN IT A STYLE KEY TO THEN HAVE CERTAIN THEME STYLES APPLY FOR STUFF
interface HTMLElement {
    displayAs(observable: Observable<boolean>);
    addStyle(style?: StyleHandler, withBase?: boolean): this;
    /** @deprecated */
    setStyle(style?: StyleHandler): this;
    modifyStyle(style: StyleHandler): this;
    with(handler: ElementHandler & this): this;
}

interface ElementObservable<E, T> extends Observable<T> {
    element: E;
    
    constructor(element: E, getCallback: () => T);
}

type ThemeId = string;
type StyleId = string;

declare class ThemeStorage {
    private static storages: Map<ThemeId, ThemeStorage>;
    private static stack: ThemeId[];
    private static onCreationCallbacks: ((storage: ThemeStorage) => void)[];

    identifier: ThemeId;
    styleSheetSupplier?: string | string[];
    
    baseStyle?: StyleData;
    toggleStyler?: ToggleStyler;
    styleAppliers: {[key: StyleId]: StyleData & { styleIds: StyleID[]}};

    constructor(id: ThemeId, styleSheetSupplier?: (string | string[]));

    static push(id: ThemeId): void;
    static pop(): void;
    static peek(): ThemeStorage;

    static get(id: ThemeId): ThemeStorage | null;
    static applyStyle<T extends HTMLElement>(element: T, handler?: StyleHandler): T;

    static onCreationCallback(callback: (storage: ThemeStorage) => void): void;

    resolveStyles(styleData: StyleData & { styleIds?: StyleID[], styleId?: StyleID }, styles: StyleData[] = []): StyleData[];
}

/**
 * Object used within {@link HTMLSelectElement.updateSelections} and {@link HTMLDataListElement.updateSelections} to indicate how the given
 * collection is used when parsing such to {@link HTMLOptionElement}
 */
declare enum EntryHandler {
    KEY_VALUE   = "key_value",
    VALUE_KEY   = "value_key",
    KEY_KEY     = "key_key",
    VALUE_VALUE = "value_value",
}

interface HTMLSelectElement {
    updateSelections<T>(options: Collection<T>, defaultOption: string|number|T, handler?: EntryHandler): this;
}

interface HTMLDataListElement {
    updateSelections<T>(options: Collection<T>, handler?: EntryHandler): this;
}

interface HTMLExtendedDialogElement extends HTMLDialogElement {
    /**
     * The showModal() method of the {@link HTMLDialogElement} interface displays the dialog as a modal dialog, over the top of any other dialogs or elements that might be visible.
     * 
     * @deprecated
     */
    openModal(): void;

    
    /** @private */ onOpenModalCallbacks: Array<(element: HTMLExtendedDialogElement) => void>;
    /** @private */ onCloseModalCallbacks: Array<(element: HTMLExtendedDialogElement) => void>;

    onOpen(callback: (element: HTMLExtendedDialogElement) => void): void;
    onClose(callback: (element: HTMLExtendedDialogElement) => void): void;
}