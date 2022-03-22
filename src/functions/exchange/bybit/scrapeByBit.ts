import Store from 'electron-store';

const { LinearClient } = require('bybit-api');

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

//
export async function scrape() {
  const arrayFundingRates: any = [];
  const data = await client.getTickers();
  const symbols = await client.getSymbols();
  data.result.forEach(async (item: any) => {
    const {
      symbol,
      last_price,
      volume_24h,
      next_funding_time,
      funding_rate,
      countdown_hour,
      mark_price,
    } = item;
    // find symbol inside symbols and get leverage
    const { max_leverage } = symbols.result.find(
      (x: any) => x.name === symbol
    ).leverage_filter;
    arrayFundingRates.push({
      symbol,
      last_price,
      volume_24h: Number(volume_24h),
      next_funding_time,
      funding_rate: Number(funding_rate * 100),
      countdown_hour: Number(countdown_hour),
      mark_price: Number(mark_price),
      max_leverage: Number(max_leverage),
    });
  });

  // order by highest funding rate
  arrayFundingRates.sort((a: any, b: any) =>
    Number(b.fundingRate - Number(a.fundingRate))
  );
  return arrayFundingRates;
}
// wait
// client.getLastFundingRate({ symbol: 'BTCUSDT' }).then(console.log)
module.exports = {
  scrape,
};
