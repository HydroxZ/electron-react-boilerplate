const ccxt = require('ccxt');

const config = {
  accessKey: '818eabd729ad040f0aed65006d778769d752dd2d',
  secretKey: '7e33bf7869f847909eb401098a602f96a57e71b66878644a63cabffc6f60d54e',
  memo: 'Arb',
};

(async function () {
  const bitmart = new ccxt.ascendex({
    apiKey: config.accessKey,
    secret: config.secretKey,
  });
  // let markets = await bitmart.fetchMarkets();
  console.log(bitmart);

  console.time('fetchMarkets');
  const funding_rates = await bitmart.v2PublicGetFuturesPricingData();
  const symbols = await bitmart.fetchMarkets();
  const test = await bitmart.v2PublicGetFuturesContract();
  console.timeEnd('fetchMarkets');
  console.log(test);
  const { contracts } = funding_rates.data;
  // console.log(contracts)
  const arr = [];
  contracts.forEach((item) => {
    // find symbol
    const token = symbols.find((symbol) => {
      const itemSymbol = item.symbol.split('-')[0];
      return symbol.base === itemSymbol && symbol.quote;
    });
    //   console.log(token)
    arr.push({
      ...item,
      mark_price: item.markPrice,
      next_funding_time: item.nextFundingTime,
      funding_rate: item.fundingRate * 100,
    });
  });
  // console.log(data.data.contracts);
})();
