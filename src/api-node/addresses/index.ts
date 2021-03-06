import { IRequestOptions, TLong } from '../../interface';
import { TDataTransactionEntry } from '@waves/ts-types';
import request from '../../tools/request';
import query from '../../tools/query';


export function fetchDataKey(base: string, address: string, key: string, options?: IRequestOptions): Promise<TDataTransactionEntry<TLong>> {
    return request({
        base,
        url: `/addresses/data/${address}/${encodeURIComponent(key)}`
    });
}

export function fetchScriptInfoMeta(base: string, address: string, options?: IRequestOptions): Promise<IScriptInfoMeta> {
    return request({
        base,
        url: `/addresses/scriptInfo/${address}/meta`
    });
}

export function fetchBalanceDetails(base: string, address: string, options?: IRequestOptions): Promise<IBalanceDetails<TLong>> {
    return request({
        base,
        url: `/addresses/balance/details/${address}`
    });
}

export function fetchBalanceConfirmations(base: string, address: string, confirmations: number, options?: IRequestOptions): Promise<IBalanceConfirmations<TLong>> {
    return request({
        base,
        url: `/addresses/balance/${address}/${confirmations}`
    });
}

export function fetchScriptInfo(base: string, address: string, options?: IRequestOptions): Promise<IScriptInfo<TLong>> {
    return request({
        base,
        url: `/addresses/scriptInfo/${address}`
    });
}

export function data(base: string, address: string, params: IDataQueryParams = Object.create(null), options?: IRequestOptions): Promise<Array<TDataTransactionEntry<TLong>>> {
    return request({
        base,
        url: `/addresses/data/${address}${query(params)}`
    });
}

export function fetchValidate(base: string, address: string, options?: IRequestOptions): Promise<IValidateResponse> {
    return request({ base, url: `/addresses/validate/${address}` });
}

export function fetchBalance(base: string, address: string, options?: IRequestOptions): Promise<IBalanceConfirmations<TLong>> {
    return request({ base, url: `/addresses/balance/${address}` });
}

export function fetchEffectiveBalanceConfirmations(base: string, address: string, confirmations: number): Promise<IBalanceConfirmations<TLong>> {
    return request({
        base,
        url: `/addresses/effectiveBalance/${address}/${confirmations}`
    });
}

export function fetchEffectiveBalance(base: string, address: string): Promise<IBalanceConfirmations<TLong>> {
    return request({
        base,
        url: `/addresses/effectiveBalance/${address}`
    });
}

export function fetchSeq(base: string, from: number, to: number): Promise<Array<string>> {
    return request({
        base,
        url: `/addresses/seq/${from}/${to}`
    })
}

export function fetchSeed(base: string, address: string): Promise<string> {
    return request({
        base,
        url: `/addresses/seed/${address}`
    })
}

export function fetchPublicKey(base: string, publicKey: string): Promise<IPublicKeyResponse> {
    return request({
        base,
        url: `/addresses/publicKey/${publicKey}`
    })
}

export function fetchAddresses(base: string): Promise<Array<string>> {
    return request({
        base,
        url: '/addresses'
    });
}

// @TODO: when correct API key is received
//  /addresses/verifyText/{address}
//  /addresses/signText/{address}
//  /addresses/sign/{address}
//  /addresses   POST
//  /addresses/verify/{address}
//  /addresses/{address}   DELETE

export interface IBalanceConfirmations<LONG> {
    address: string;
    confirmations: number;
    balance: LONG;
}

export interface IScriptInfo<LONG = TLong> {
    address: string;
    complexity: number;
    extraFee: LONG;
    script?: string;
    scriptText?: string;
}

export interface IDataQueryParams {
    matches?: string;
    keys?: string | Array<string>;
}

export interface IBalanceDetails<LONG> {
    address: string;
    /**
     * Весь принадлежащий мне баланс, включая исходящий лизинг
     * Available + LeaseOut
     */
    regular: LONG;
    /**
     * Минимальный эффективный баланс за последнюю 1000 блоков
     */
    generating: LONG;
    /**
     * Мой баланс без исходящего лизинга
     * Баланс, который можно тратить
     */
    available: LONG;
    /**
     * Баланс для генерации блоков (включая входящий лизинг и исключая исходящий)
     * Available + LeaseIn - LeaseOut
     */
    effective: LONG;
}

export interface IScriptInfoMeta {
    address: string;
    meta: {
        version: string;
        callableFuncTypes: Record<string, Record<string, 'Int' | 'String' | 'Binary'>>
    }
}

export interface IValidateResponse {
    address: string;
    valid: boolean;
}

export interface IPublicKeyResponse {
    address: string;
}
