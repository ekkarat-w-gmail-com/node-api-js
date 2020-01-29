import { TAssetDetails } from '../../api-node/assets';
import { fetchTransactions } from '../../api-node/transactions';
import getAssetsByTransaction from './getAssetsByTransaction';
import { TLong } from '../../interface';
import { IWithApiMixin, TTransaction } from '@waves/ts-types';


export default function (base: string, address: string, limit: number, after?: string): Promise<{ transactions: Array<TTransaction<TLong> & IWithApiMixin>; assets: Record<string, TAssetDetails> }> {
    return fetchTransactions(base, address, limit, after)
        .then(transactions => getAssetsByTransaction(base, transactions).then(assets => ({ transactions, assets })));
}
