interface Currencies {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    rev: number;
}

export interface AxiosResponseOfName {
    currencies: Currencies[]
}

export interface Markers {
    id: string | undefined;
    type: string;
    symbol: string;
    name: string | undefined;
    value: string | undefined;
}

export interface Entry {
    key: string;
    item: Markers;
}

export interface ErrorMarker {
    isError: boolean;
    message: string;
}

export enum KeyAvailable {
    name = 'Name',
    value = 'Value'
}