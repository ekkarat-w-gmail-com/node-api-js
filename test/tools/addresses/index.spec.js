"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var watch_1 = __importDefault(require("../../../src/tools/adresses/watch"));
var _state_1 = require("../../_state");
var waves_transactions_1 = require("@waves/waves-transactions");
var watcher = null;
var address = '';
var wait = function (time) { return new Promise(function (resolve) { return setTimeout(resolve, time); }); };
beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                address = waves_transactions_1.libs.crypto.address(waves_transactions_1.libs.crypto.randomSeed(), _state_1.CHAIN_ID);
                return [4 /*yield*/, watch_1["default"](_state_1.NODE_URL, address, 50)];
            case 1:
                watcher = _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// describe('Check available sponsorship', () => {
//
//     const seed = libs.crypto.randomSeed();
//     const address = libs.crypto.address(seed, NETWORK_BYTE);
//
//     const asset = issue({
//         chainId: NETWORK_BYTE,
//         name: 'Sponsor',
//         description: '',
//         reissuable: false,
//         quantity: 100000000,
//         decimals: 2
//     }, MASTER_ACCOUNT.SEED);
//
//     const inBlockChain = broadcast(asset, NODE_URL)
//         .then(({ id }) => waitForTx(id, { apiBase: NODE_URL }))
//         .then(() => sponsorship({ assetId: asset.id, minSponsoredAssetFee: 1 }, MASTER_ACCOUNT.SEED))
//         .then(({ id }) => waitForTx(id, { apiBase: NODE_URL }));
//
//     test('Check', async () => {
//         await inBlockChain;
//
//         console.log('Start');
//         const list = await availableSponsoredBalances(NODE_URL, address, Math.pow(10, 8));
//         console.log(list);
//         const [info] = list;
//         expect(list.length).toBe(1);
//         expect(info.assetFee).toBe(String(1000));
//     }, 1000000);
// });
it('Catch one transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
    var ok, tx;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ok = false;
                watcher.on('change-state', function (_a) {
                    var tx = _a[0];
                    ok = tx.type === 4;
                });
                tx = waves_transactions_1.transfer({
                    amount: 1,
                    recipient: address,
                }, _state_1.STATE.ACCOUNTS.SIMPLE.seed);
                return [4 /*yield*/, waves_transactions_1.broadcast(tx, _state_1.NODE_URL)];
            case 1:
                _a.sent();
                return [4 /*yield*/, waves_transactions_1.waitForTx(tx.id, { apiBase: _state_1.NODE_URL })];
            case 2:
                _a.sent();
                return [4 /*yield*/, wait(500)];
            case 3:
                _a.sent();
                expect(ok).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
it('Catch once transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
    var count, i, tx;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                count = 0;
                watcher.once('change-state', function (_a) {
                    var tx = _a[0];
                    count++;
                });
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < 2)) return [3 /*break*/, 6];
                tx = waves_transactions_1.transfer({
                    amount: 1,
                    recipient: address,
                }, _state_1.STATE.ACCOUNTS.SIMPLE.seed);
                return [4 /*yield*/, waves_transactions_1.broadcast(tx, _state_1.NODE_URL)];
            case 2:
                _a.sent();
                return [4 /*yield*/, waves_transactions_1.waitForTx(tx.id, { apiBase: _state_1.NODE_URL })];
            case 3:
                _a.sent();
                return [4 /*yield*/, wait(100)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 1];
            case 6:
                expect(count).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
test('Catch 30 transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, toSend, count, add;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = [];
                toSend = [];
                count = 0;
                watcher.on('change-state', function (list) {
                    result.push.apply(result, list);
                });
                add = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tmp, i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                tmp = [];
                                for (i = count; i < count + 5; i++) {
                                    tmp.push(waves_transactions_1.transfer({
                                        amount: i + 1,
                                        recipient: address
                                    }, _state_1.STATE.ACCOUNTS.SIMPLE.seed));
                                }
                                toSend.push.apply(toSend, tmp);
                                count = count + 5;
                                return [4 /*yield*/, Promise.all(tmp.map(function (tx) { return waves_transactions_1.broadcast(tx, _state_1.NODE_URL); }))];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, Promise.all(tmp.map(function (tx) { return waves_transactions_1.waitForTx(tx.id, { apiBase: _state_1.NODE_URL }); }))];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, add()];
            case 1:
                _a.sent();
                return [4 /*yield*/, wait(500)];
            case 2:
                _a.sent();
                return [4 /*yield*/, add()];
            case 3:
                _a.sent();
                return [4 /*yield*/, wait(500)];
            case 4:
                _a.sent();
                return [4 /*yield*/, add()];
            case 5:
                _a.sent();
                return [4 /*yield*/, wait(500)];
            case 6:
                _a.sent();
                return [4 /*yield*/, add()];
            case 7:
                _a.sent();
                return [4 /*yield*/, wait(500)];
            case 8:
                _a.sent();
                return [4 /*yield*/, add()];
            case 9:
                _a.sent();
                return [4 /*yield*/, wait(500)];
            case 10:
                _a.sent();
                return [4 /*yield*/, add()];
            case 11:
                _a.sent();
                return [4 /*yield*/, wait(500)];
            case 12:
                _a.sent();
                expect(result.length).toBe(toSend.length);
                return [2 /*return*/];
        }
    });
}); }, 60000000);
//# sourceMappingURL=index.spec.js.map