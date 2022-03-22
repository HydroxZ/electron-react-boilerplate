import { Tabs } from 'antd';
import Tabella from './Tabella';

const { TabPane } = Tabs;

function TableData() {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="All" key="1">
        Content of Tab Pane 1
      </TabPane>
      <TabPane tab="Kucoin" key="2">
      <Tabella exchange="kucoin" />
      </TabPane>
      <TabPane tab="Bybit" key="3">
        <Tabella exchange="bybit" />
      </TabPane>
    </Tabs>
  );
}

export default TableData;
