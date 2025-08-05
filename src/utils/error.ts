import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import type {SerializedError} from "@reduxjs/toolkit";

export default function getErrorMessage(error?: FetchBaseQueryError | SerializedError): string {
    if (!error) return ''
    if ('status' in error) {
        const err = error as FetchBaseQueryError;

        if (err.status === 'FETCH_ERROR' && 'error' in err)
            return err.error || 'Network error';
        if (typeof err.data === 'string') return err.data;
        if (err.data && typeof err.data === 'object' && 'detail' in err.data)
            return (err.data as any).detail;
        return JSON.stringify(err.data);
    } else
        return error.message || 'Unknown client error';
}