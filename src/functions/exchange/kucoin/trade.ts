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
  } else {
    return 'buy';
  }
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
  let size = ((percentage / 100) * balance * leverage) / price.markPrice;
  console.log(size);
  let result = await callKucoin('POST', `/api/v1/orders`, {
    clientOid: createUUID(),
    size,
    leverage,
    price: price.markPrice,
    type: 'market',
    side: calculateSide(price.fundingRate),
    symbol,
  });
  console.log(result)
  return result.data.orderId;
}
export async function sellOrder(orderId: string, symbol: string) {
  let data = await callKucoin('POST', `/api/v1/orders`, {
    clientOid: orderId,
    symbol,
    closeOrder: true,
    type: 'market',
  });
  return data.data.orderId;
}
export async function waitForFunding(symbol: string, timestamp: number) {
  let {data} = await callKucoin('GET', '/api/v1/funding-history?symbol=' + symbol, '')
  let tempo = data.dataList[0].timePoint
  if (tempo > timestamp) {
    return true;
  } else {
    return false
  }

}
export async function snipe(symbol: string, leverage: number, percentage: number, timestamp:number) {
  let orderId = await buyOrder(symbol, leverage, percentage);
  // set interval to check if order is funded
  let interval = setInterval(async () => {
    let funded = await waitForFunding(symbol, timestamp);
    console.log('checking funding history');
    if (funded) {
      console.log('order funded');
      clearInterval(interval);
      let sell = await sellOrder(orderId, symbol);
      console.log(sell);
    }
  }
  , 800);
}
module.exports = {
  buyOrder,
  sellOrder,
  snipe,
  waitForFunding,
};
