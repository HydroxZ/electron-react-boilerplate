// import callKucoin
const callKucoin = require('./callKucoin.ts');

export async function tokenInfo(symbol: string) {
  let result = await callKucoin('GET', '/api/v1/contracts/' + symbol, '');
  let obj = {
    markPrice: result.data.markPrice,
    fundingRate: result.data.fundingFeeRate * 100,
  };

  return obj
}

module.exports = {
  tokenInfo,
};
