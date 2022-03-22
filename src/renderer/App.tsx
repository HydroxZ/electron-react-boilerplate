import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import React, { Suspense } from 'react';
import Watchlist from 'components/Watchlist';
import Balance from 'components/Balance';
import API from 'components/API';
// dynmaic import component
const Table = React.lazy(() => import('../components/TableData'));

declare global {
  interface Window {
    electron: {
      scrape: {
        get: (exchange: 'kucoin' | 'bybit') => Promise<any>;
      };
      exchange: {
        getBalance: (
          exchange: 'kucoin' | 'bybit',
          symbol: string
        ) => Promise<any>;
        snipe: (
          exchange: 'kucoin' | 'bybit',
          symbol: string,
          leverage: number,
          percentage: number,
          timestamp: EpochTimeStamp
        ) => Promise<any>;
      };
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        // any other methods you've defined...
      };
      ipcRenderer: {
        myPing(): void;
      };
    };
  }
}
const Hello = () => {
  return (
    <div>
      <div className="header">
        <div>
          <API />
        </div>
      </div>
      <div className="layout">
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Table />
          </Suspense>
        </div>
        <div>
          <Balance />
        </div>
        <div>
          <Watchlist />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
