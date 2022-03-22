const { LinearClient } = require('bybit-api');
import Store from 'electron-store';

//
export async function getBalance() {
  const store = new Store();

  const api: any = store.get('api')
  const API_KEY = api.bybit.key;
  const PRIVATE_KEY = api.bybit.secret;
  const useLivenet = true;

  const client = new LinearClient(
    API_KEY,
    PRIVATE_KEY,

    // optional, uses testnet by default. Set to 'true' to use livenet.
    useLivenet

    // restClientOptions,
    // requestLibraryOptions
  );

  let data = await client.getWalletBalance();
  let result = data.result.USDT.available_balance;
  return result;
}
getBalance();
// wait
// client.getLastFundingRate({ symbol: 'BTCUSDT' }).then(console.log)
module.exports = {
  getBalance,
};
