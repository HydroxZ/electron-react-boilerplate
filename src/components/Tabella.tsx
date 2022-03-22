import { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Table, Modal } from 'antd';
import useStore from '../renderer/store';

type Props = {
  exchange: 'kucoin' | 'bybit';
};

function Tabella(props: Props) {
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [refresh, setRefresh] = useState(false);
  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Funding Rate',
      dataIndex: 'funding_rate',
      key: 'funding_rate',
      sorter: (a: any, b: any) => a.funding_rate - b.funding_rate,
      sortDirection: ['descend', 'ascend'],
    },
    {
      title: 'Time',
      dataIndex: 'next_funding_time',
      key: 'next_funding_time',
      render: (text: any) => {
        const date = new Date(text);
        return <span>{date.toUTCString()}</span>;
      },
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.next_funding_time);
        const dateB = new Date(b.next_funding_time);
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      title: 'Price',
      dataIndex: 'mark_price',
      key: 'mark_price',
      sorter: (a: any, b: any) => a.mark_price - b.mark_price,
      sortDirection: ['descend', 'ascend'],
    },
    {
      title: 'Max Leverage',
      dataIndex: 'max_leverage',
      key: 'max_leverage',
    },
    {
      title: 'Volume (24h)',
      dataIndex: 'volume_24h',
      key: 'volume_24h',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => {
        return (
          <div>
            <span>
              <a
                target="_blank"
                href={`https://www.bybit.com/trade/usdt/${record.symbol}`}
                rel="noreferrer"
              >
                Trade
              </a>
            </span>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={() => {
                Modal.info({
                  cancelText: 'Close',
                  closable: true,
                  okCancel: true,
                  okText: 'Add to watchlist',
                  title: 'Settings',
                  content: (
                    <div>
                      <Form
                        form={form}
                        layout="vertical"
                        name="watchlist_insert"
                      >
                        <Form.Item
                          required
                          name="leverage"
                          label="Leverage"
                          rules={[
                            {
                              min: 0.01,
                              max: record.max_leverage,
                              type: 'number',
                              required: true,
                            },
                          ]}
                        >
                          <InputNumber />
                        </Form.Item>
                        <Form.Item
                          required
                          name="size"
                          label="% of balance"
                          rules={[
                            {
                              max: 100,
                              type: 'number',
                              min: 1,
                              required: true,
                            },
                          ]}
                        >
                          <InputNumber />
                        </Form.Item>
                      </Form>
                    </div>
                  ),
                  onOk: async () => {
                    const a = await form.validateFields();
                    // add to watchlist store
                    console.log(a);
                    const { watchlist } = useStore.getState();

                    const createUUID = (): string => {
                      return (
                        Math.random().toString(36).substring(2, 15) +
                        Math.random().toString(36).substring(2, 15)
                      );
                    };

                    const isInWatchlist = watchlist.find(
                      (item: any) => item.symbol === record.symbol
                    );
                    if (isInWatchlist) {
                      Modal.error({
                        title: 'Error',
                        content: 'Symbol already in watchlist',
                      });
                    } else {
                      let seconds = new Date(
                        record.next_funding_time
                      ).getSeconds();
                      let minutes = new Date(
                        record.next_funding_time
                      ).getMinutes();
                      const hours =
                        new Date(record.next_funding_time).getHours() - 1;
                      const day = new Date(record.next_funding_time).getDate();
                      const month = new Date(
                        record.next_funding_time
                      ).getMonth();
                      const year = new Date(
                        record.next_funding_time
                      ).getFullYear();
                      // set seconds to 00
                      // @ts-ignore
                      seconds = '57';
                      // @ts-ignore
                      minutes = '59';
                      // create new date with new time
                      const timestamp = new Date(
                        year,
                        month,
                        day,
                        hours,
                        minutes,
                        seconds
                      ).getTime();

                      // get missing time in milliseconds
                      const timeDiff = timestamp - new Date().getTime();
                      console.log(timeDiff);
                      const timeout = setTimeout(
                        (exchange, symbol, leverage, size, timestamp) => {
                          window.electron.exchange.snipe(
                            exchange,
                            symbol,
                            leverage,
                            size,
                            timestamp
                          );
                        },
                        timeDiff,
                        props.exchange,
                        record.symbol,
                        a.leverage,
                        a.size,
                        timestamp
                      );

                      const obj = {
                        id: createUUID(),
                        symbol: record.symbol,
                        leverage: a.leverage,
                        size: a.size,
                        funding_rate: record.funding_rate,
                        next_funding_time: record.next_funding_time,
                        mark_price: record.mark_price,
                        max_leverage: record.max_leverage,
                        volume_24h: record.volume_24h,
                        exchange: props.exchange,
                        timeout,
                      };
                      useStore.setState({
                        // @ts-expect-error
                        watchlist: [...watchlist, obj],
                      });
                    }

                    // check if symbol is already in watchlist
                  },
                });
              }}
            >
              Snipe
            </Button>
          </div>
        );
      },
    },
  ];
  const handleRefresh = () => {
    setLoading(true);
    setRefresh(!refresh);
  };
  console.log(window.electron.store.get('watchlist'));
  useEffect(() => {
    const getData = async () => {
      const api = await window.electron.store.get('api');
      if (api[props.exchange]?.key && api[props.exchange]?.secret) {
        const data = await window.electron.scrape.get(props.exchange);
        console.log(data);
        setState(data);
      }

      setLoading(false);
    };
    getData();
  }, [refresh]);

  return (
    <div>
      <div className="tableActions">
        <Button type="primary" onClick={handleRefresh}>
          Refresh
        </Button>
      </div>
      <Table
        size="small"
        columns={columns}
        loading={loading}
        dataSource={state}
      />
    </div>
  );
}

export default Tabella;
