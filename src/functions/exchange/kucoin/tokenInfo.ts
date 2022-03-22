// import callKucoin
const callKucoin = require('./callKucoin.ts');

export async function tokenInfo(symbol: string) {
  const result = await callKucoin('GET', `/api/v1/contracts/${symbol}`, '');
  const obj = {
    markPrice: result.data.markPrice,
    fundingRate: result.data.fundingFeeRate * 100,
  };

  return obj;
}

module.exports = {
  tokenInfo,
};
