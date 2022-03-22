// import callKucoin
const callKucoin = require('./callKucoin.ts');

export async function getBalance(symbol: string) {
  let result = await callKucoin(
    'GET',
    '/api/v1/account-overview?currency=' + symbol,
    ''
  );
  return result.data.availableBalance;
}
module.exports = {
  getBalance
};
