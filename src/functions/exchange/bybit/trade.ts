import Store from 'electron-store';

const { LinearClient } = require('bybit-api');

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

  const [token, walletBallance] = await Promise.all([
    client.getTickers({ symbol }),
    client.getWalletBalance(),
  ]);
  const balance = walletBallance.result.USDT.available_balance;
  const price = token.result[0].mark_price;
  const size = ((percentage / 100) * balance * leverage) / price;
  const fundingRate = token.result[0].funding_rate;
  let side: string;
  if (fundingRate > 0) {
    side = 'Sell';
  } else {
    side = 'Buy';
  }
  const data = await client.placeActiveOrder({
    close_on_trigger: false,
    leverage,
    order_type: 'Market',
    side,
    symbol,
    qty: size.toPrecision(8),
    reduce_only: false,
    time_in_force: 'ImmediateOrCancel',
  });
  console.log(data);
  const orderId = data.result.order_id;
  if (side === 'Buy') {
    side = 'Sell';
  } else {
    side = 'Buy';
  }

  const interval = setInterval(async () => {
    const funded = await waitForFunding(symbol, timestamp);
    console.log(funded);
    if (funded) {
      const sell = await client.placeActiveOrder({
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

  const fundingRes = await client.getLastFundingFee({ symbol });
  const zulutime = fundingRes?.result?.exec_time;
  if (zulutime) {
    const timestamp_fee = new Date(zulutime).getTime();
    if (timestamp_fee > timestamp) {
      return true;
    }
    return false;
  }
  return false;
};
