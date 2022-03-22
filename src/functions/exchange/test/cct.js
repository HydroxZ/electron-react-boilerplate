const ccxt = require('ccxt');

const config = {
  accessKey: '818eabd729ad040f0aed65006d778769d752dd2d',
  secretKey: '7e33bf7869f847909eb401098a602f96a57e71b66878644a63cabffc6f60d54e',
  memo: 'Arb',
};
const ascendexCfg = {
  apiKey: 'rCsEj16K4vHNtRkmaSZPJvPm76Vf2KSa',
  secret: 'jJA4fDXh5x35kPva2p5Usn7Axa8nS2emt3ZDoFhbRqFas79TU9735BaPekXr8B3L',
  accountGroup: 3,
};
(async function () {
  const ascendex = new ccxt.ascendex({
    apiKey: ascendexCfg.apiKey,
    secret: ascendexCfg.secret,
  });
  const data = await ascendex.v2_public_get_futures_pricing_data();
  const tickers = await ascendex.fetchMarkets();
  // get tickers only where future = true
  console.log(tickers[0]);
  tickers.forEach((item) => {
    if (item.limits.leverage.min) {
      console.log(item);
    }
  });
  // console.log(data.data.contracts);
})();
