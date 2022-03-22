import { useEffect } from 'react';
import useStore from '../renderer/store';

function Balance() {
  let kucoinBalance = useStore().kucoinBalance;
  let bybitBalance = useStore().bybitBalance;
  useEffect(() => {
    // let state
    let apikeys = window.electron.store.get('api');
    if (apikeys?.kucoin?.key && apikeys?.kucoin?.secret) {
      window.electron.exchange
        .getBalance('kucoin', 'USDT')
        .then((res) => useStore.setState({ kucoinBalance: res }));
    }
    if (apikeys?.bybit?.key && apikeys?.bybit?.secret) {
      window.electron.exchange
        .getBalance('bybit', 'USDT')
        .then((res) => useStore.setState({ bybitBalance: res }));
    }
  }, []);

  return (
    <div>
      <div>Kucoin: {kucoinBalance} USDT</div>
      <div>Bybit: {bybitBalance} USDT</div>
    </div>
  );
}

export default Balance;
