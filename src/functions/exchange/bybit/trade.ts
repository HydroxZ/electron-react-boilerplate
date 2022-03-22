const { LinearClient } = require('bybit-api');
import Store from 'electron-store';

//
export async function snipe(
  symbol: string,
  leverage: number,
  percentage: number,
  timestamp: number
) {
  const store = new Store();
  const api: any = store.get('api');
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

  let [token, walletBallance] = await Promise.all([
    client.getTickers({ symbol }),
    client.getWalletBalance(),
  ]);
  let balance = walletBallance.result.USDT.available_balance;
  let price = token.result[0].mark_price;
  let size = ((percentage / 100) * balance * leverage) / price;
  let fundingRate = token.result[0].funding_rate;
  let side: string;
  if (fundingRate > 0) {
    side = 'Sell';
  } else {
    side = 'Buy';
  }
  let data = await client.placeActiveOrder({
    close_on_trigger: false,
    leverage,
    order_type: 'Market',
    side,
    symbol,
    qty: size.toPrecision(8),
    reduce_only: false,
    time_in_force: 'ImmediateOrCancel',
  });
  console.log(data)
  let orderId = data.result.order_id;
  if (side === 'Buy') {
    side = 'Sell';
  } else {
    side = 'Buy';
  }

  let interval = setInterval(async () => {
    let funded = await waitForFunding(symbol, timestamp);
    console.log(funded);
    if (funded) {
      let sell = await client.placeActiveOrder({
        reduce_only: true,
        order_link_id: orderId,
        close_on_trigger: true,
        symbol,
        side,
        qty: size.toPrecision(8),
        time_in_force: 'ImmediateOrCancel',
        order_type: 'Market',
      });
      console.log(sell);
      clearInterval(interval);
    }
  }, 700);

  // console.log(data)
  // console.log(orderId)

  // let result = data.result.USDT.available_balance;
  return true;
}
// wait
// client.getLastFundingRate({ symbol: 'BTCUSDT' }).then(console.log)
module.exports = {
  snipe,
};

const waitForFunding = async (symbol: string, timestamp: number) => {
  const store = new Store();
  const api: any = store.get('api');
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

  let fundingRes = await client.getLastFundingFee({ symbol });
  let zulutime = fundingRes?.result?.exec_time;
  if (zulutime) {
    let timestamp_fee = new Date(zulutime).getTime();
    if (timestamp_fee > timestamp) {
      return true;
    } else {
      return false;
    }
  } else return false;
};
