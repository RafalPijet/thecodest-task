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
    type: string;
    symbol: string;
    bitcoinName: string | undefined;
}