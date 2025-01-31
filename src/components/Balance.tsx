import { useEffect } from 'react';
import useStore from '../renderer/store';

function Balance() {
  const { kucoinBalance } = useStore();
  const { bybitBalance } = useStore();
  useEffect(() => {
    // let state
    const apikeys = window.electron.store.get('api');
    if (apikeys?.kucoin?.key && apikeys?.kucoin?.secret) {
      window.electron.exchange
        .getBalance('kucoin', 'USDT')
        .then((res) => useStore.setState({ kucoinBalance: res }))
        .catch((err) => {
          throw err;
        });
    }
    if (apikeys?.bybit?.key && apikeys?.bybit?.secret) {
      window.electron.exchange
        .getBalance('bybit', 'USDT')
        .then((res) => useStore.setState({ bybitBalance: res }))
        .catch((err) => {
          throw err;
        });
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
