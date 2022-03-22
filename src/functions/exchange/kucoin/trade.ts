import { getBalance } from './balance';
import { tokenInfo } from './tokenInfo';

// import callKucoin
const callKucoin = require('./callKucoin.ts');

const createUUID = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
const calculateSide = (fundingRate: number): string => {
  if (fundingRate > 0) {
    return 'sell';
  }
  return 'buy';
};

export async function buyOrder(
  symbol: string,
  leverage: number,
  percentage: number
) {
  // generate random userid
  console.time('Promise');
  const [balance, price] = await Promise.all([
    getBalance('USDT'),
    tokenInfo(symbol),
  ]);
  console.timeEnd('Promise');

  // calculate size by taking percentage of wallet balance and multiplying by leverage and then dividing by price
  const size = ((percentage / 100) * balance * leverage) / price.markPrice;
  console.log(size);
  const result = await callKucoin('POST', `/api/v1/orders`, {
    clientOid: createUUID(),
    size,
    leverage,
    price: price.markPrice,
    type: 'market',
    side: calculateSide(price.fundingRate),
    symbol,
  });
  console.log(result);
  return result.data.orderId;
}
export async function sellOrder(orderId: string, symbol: string) {
  const data = await callKucoin('POST', `/api/v1/orders`, {
    clientOid: orderId,
    symbol,
    closeOrder: true,
    type: 'market',
  });
  return data.data.orderId;
}
export async function waitForFunding(symbol: string, timestamp: number) {
  const { data } = await callKucoin(
    'GET',
    `/api/v1/funding-history?symbol=${symbol}`,
    ''
  );
  const tempo = data.dataList[0].timePoint;
  if (tempo > timestamp) {
    return true;
  }
  return false;
}
export async function snipe(
  symbol: string,
  leverage: number,
  percentage: number,
  timestamp: number
) {
  const orderId = await buyOrder(symbol, leverage, percentage);
  // set interval to check if order is funded
  const interval = setInterval(async () => {
    const funded = await waitForFunding(symbol, timestamp);
    console.log('checking funding history');
    if (funded) {
      console.log('order funded');
      clearInterval(interval);
      const sell = await sellOrder(orderId, symbol);
      console.log(sell);
    }
  }, 800);
}
module.exports = {
  buyOrder,
  sellOrder,
  snipe,
  waitForFunding,
};
