// import callKucoin
const callKucoin = require('./callKucoin.ts');

export async function scrape() {
  const result = await callKucoin('GET', '/api/v1/contracts/active', '');
  const arr = [];
  for (const i of result.data) {
    const {
      maxLeverage: max_leverage,
      symbol,
      fundingFeeRate: funding_rate,
      volumeOf24h: volume_24h,
      nextFundingRateTime: next_funding_time,
      markPrice: mark_price,
    } = i;
    // time in ms to date
    const timestamp_to_date = new Date().getTime() + next_funding_time;
    const date2 = new Date(timestamp_to_date);
    // let date = new Date(timestamp_to_date).toLocaleString('it-IT').replace(',', '');

    arr.push({
      symbol,
      max_leverage,
      funding_rate: funding_rate * 100,
      volume_24h,
      next_funding_time: date2.toISOString(),
      mark_price,
    });
  }
  return arr;
}
scrape();
module.exports = {
  scrape,
};
