// import callKucoin
const callKucoin = require('./callKucoin');

export async function getBalance(symbol: string) {
  const result = await callKucoin(
    'GET',
    `/api/v1/account-overview?currency=${symbol}`,
    ''
  );
  return result.data.availableBalance;
}
module.exports = {
  getBalance,
};
