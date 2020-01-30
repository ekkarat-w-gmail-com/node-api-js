import { IWithApiMixin, TSignedTransaction, TTransaction, } from '@waves/ts-types';
import { TLong } from '../../interface';
import { broadcast } from '../../api-node/transactions';
import { head, toArray } from '../utils';
import wait from './wait';


const DEFAULT_BROADCAST_OPTIONS: IOptions = {
    chain: false,
    confirmations: -1,
    maxWaitTime: 0,
    requestInterval: 0
};

export type TMap<MAP extends Record<string | number, any>, Key extends keyof MAP> = MAP[Key];
export type TMapTuple<T extends Array<Record<string | number, any>>, TO_MAP extends Record<string | number, Record<string | number, any>>, KEY> = {
    [K in keyof T]: T[K] extends never ? never : KEY extends keyof T[K] ? T[K][KEY] extends infer R ? R extends keyof TO_MAP ? TO_MAP[R] : never : never : never;
}
type TWithApiMixinList<T extends Array<TTransaction<TLong>>> = { [Key in keyof T]: T[Key] extends TTransaction<TLong> ? TSignedTransaction<T[Key]> & IWithApiMixin : never }

export type TSigned<LONG, T extends Array<TTransaction<LONG>>> = { [Key in keyof T]: T[Key] extends TTransaction<LONG> ? TSignedTransaction<T[Key]> : never }

export default function <T extends Array<TTransaction<TLong>>>(base: string, list: TSigned<TLong, T>): Promise<TWithApiMixinList<T>>;
export default function <T extends TTransaction<TLong>>(base: string, tx: TSignedTransaction<T>, options?: Partial<IOptions>): Promise<T & IWithApiMixin>;
export default function (
    base: string,
    list: TSignedTransaction<TTransaction<TLong>> | Array<TSignedTransaction<TTransaction<TLong>>> | any,
    options?: Partial<IOptions>
): Promise<TTransaction<TLong> & IWithApiMixin | Array<TTransaction<TLong> & IWithApiMixin>> {
    const opt = {...DEFAULT_BROADCAST_OPTIONS, ...(options || {})};
    const isOnce = !Array.isArray(list);
    const confirmations = opt.confirmations > 0 ? 1 : 0;

    return (opt.chain
        ? chainBroadcast(base, toArray(list), {...opt, confirmations})
        : simpleBroadcast(base, toArray(list)))
        .then(list => opt.confirmations <= 0 ? list : wait(base, list, opt))
        .then(list => isOnce ? head(list) as TTransaction<TLong> & IWithApiMixin : list);
}


function simpleBroadcast<T extends Array<TSignedTransaction<TTransaction<TLong>>>>(base: string, list: T): Promise<TWithApiMixinList<T>> {
    return Promise.all(list.map(tx => broadcast(base, tx))) as Promise<TWithApiMixinList<T>>;
}

function chainBroadcast<T extends TSignedTransaction<TTransaction<TLong>>>(base: string, list: Array<T>, options: IOptions): Promise<Array<T & IWithApiMixin>> {
    return new Promise<Array<T & IWithApiMixin>>((resolve, reject) => {
        const toBroadcast: Array<TSignedTransaction<TTransaction<TLong>>> = list.slice().reverse();
        const result: Array<T & IWithApiMixin> = [];

        const loop = () => {
            const tx = toBroadcast.pop();
            if (tx == null) {
                resolve(result);
                return null;
            } else {
                broadcast(base, tx)
                    .then(tx => wait(base, tx, options))
                    .then((tx: TSignedTransaction<TTransaction> & IWithApiMixin) => {
                        result.push(tx as T & IWithApiMixin);
                        loop();
                    }, reject);
            }
        };

        loop();
    });
}

export interface IOptions {
    chain: boolean;
    confirmations: number;
    maxWaitTime: number;
    requestInterval: number;
}

