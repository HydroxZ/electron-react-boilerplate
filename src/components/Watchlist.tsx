import { Button, Table } from 'antd';
import useStore from '../renderer/store';

const columns = [
  {
    title: 'Exchange',
    dataIndex: 'exchange',
    key: 'exchange',
  },
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
  },
  {
    title: 'Funding Rate',
    dataIndex: 'funding_rate',
    key: 'funding_rate',
  },
  {
    title: 'Time',
    dataIndex: 'next_funding_time',
    key: 'next_funding_time',
  },
  {
    title: 'Percentage',
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: 'Leverage',
    dataIndex: 'leverage',
    key: 'leverage',
  },
  {
    title: 'Return',
    dataIndex: 'return',
    render: (text: any, record: any) => {
      const { leverage } = record;
      let { funding_rate } = record;
      const percentage = record.size;
      const { exchange } = record;
      // convert funding_rate to positive
      if (funding_rate < 0) {
        funding_rate *= -1;
      }
      // @ts-ignore
      const balance: number = useStore.getState()[`${exchange}Balance`];
      const position = balance * (percentage / 100) * leverage;
      const funding_fee = (position * funding_rate) / 100;
      // calculate 0.14% of fees
      console.log(position);
      const fees = (position * 0.014) / 10;
      console.log(fees);
      console.log(funding_fee);
      const total = funding_fee - fees;
      return <div>{total.toFixed(2)}$</div>;
    },
  },
  {
    title: 'Actions',
    render: (text: any, record: any) => {
      console.log(record);
      return (
        <Button
          onClick={() => {
            const { watchlist } = useStore.getState();
            clearTimeout(record.timeout);
            useStore.setState({
              watchlist: watchlist.filter((item: any) => item.id !== record.id),
            });
          }}
        >
          Cancel
        </Button>
      );
    },
  },
];
function Watchlist() {
  const watchlist = useStore((state: any) => state.watchlist);
  console.log(watchlist);

  return (
    <div>
      <Table columns={columns} dataSource={watchlist} />
    </div>
  );
}

export default Watchlist;
