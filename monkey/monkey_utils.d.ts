/// <reference path="./tamper_monkey.d.ts" />
//import { GMXMLRequest, DataType } from './tamper_monkey';

declare enum ErrorType {
    ERROR = "error",
    ABORT = "abort",
    TIMEOUT = "timeout",
    INVALID_STATUS = "invalid_status",
    HANDLER_ERROR = "handler_error",
}
declare interface XMLResponseType {
    readonly ARRAYBUFFER: DataType<ArrayBuffer>;
    readonly TEXT: DataType<string>;
    readonly JSON: DataType<Record<string, any>>;
    readonly BLOB: DataType<Blob>;
    readonly STREAM: DataType<any>; // TODO: FIGURE OUT WHAT TYPE THIS IS 
} 

declare type RequestErrorHandler<T> = ((error?: GMXMLRequest<T>, type: ErrorType, thrownError?: Error) => T);

declare interface MonkeyRequestData<T> extends BaseMonkeyRequestData<T> {
    /** 
     * The method request type either being GET, POST, PATCH, or DELETE 
     */
    method: string;
    /** 
     * The request body for any PATCH/POST requests
     */
    data?: string | Blob | File | Object | Array<any> | FormData | undefined;
}

declare interface BaseMonkeyRequestData<T> {
    /** 
     * Type of data that a given server should Responded in typically from {@link XMLResponseType}'s
     */
    type?: DataType<T>;
    /** 
     * Check if the given returned status is within the valid range for the response from the server which is defaulted to {@link generalStatusCodeRange}
     */
    allowedStatuses?: (status: number) => boolean ,
    /** 
     * Header information for the request
     */
    headers?: { [key: string]: string };
    /** 
     * Handler function used to return the final value for the servers request if required
     */
    handler?: (request: GMXMLRequest<T>) => T;
    /** 
     * Function to handle errors of either caused by the handling of the response or from the request call 
     */
    onError: RequestErrorHandler<T>;
}