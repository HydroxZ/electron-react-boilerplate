import { Button, Modal, Form, Input } from 'antd';
import { useState } from 'react';

function API() {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const apiValues = window.electron.store.get('api');
  const handleOk = () => {
    setVisible(false);
    const values = form.getFieldsValue();
    const obj = {
      kucoin: {
        key: values.kucoin_key,
        secret: values.kucoin_secret,
        passphrase: values.kucoin_passphrase,
      },
      bybit: {
        key: values.bybit_key,
        secret: values.bybit_secret,
      },
    };
    window.electron.store.set('api', obj);
    form.submit();
  };
  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <>
      <Modal onOk={handleOk} onCancel={handleCancel} visible={visible}>
        <Form
          initialValues={{
            kucoin_key: apiValues?.kucoin?.key || '',
            kucoin_secret: apiValues?.kucoin?.secret || '',
            kucoin_passphrase: apiValues?.kucoin?.passphrase || '',
            bybit_key: apiValues?.bybit?.key || '',
            bybit_secret: apiValues?.bybit?.secret || '',
          }}
          form={form}
        >
          <div>Kucoin</div>
          <Form.Item name="kucoin_key" label="Api key">
            <Input />
          </Form.Item>
          <Form.Item name="kucoin_secret" label="Api secret">
            <Input />
          </Form.Item>
          <Form.Item name="kucoin_passphrase" label="Passphrase">
            <Input />
          </Form.Item>
          <div>ByBit</div>
          <Form.Item name="bybit_key" label="Api key">
            <Input />
          </Form.Item>
          <Form.Item name="bybit_secret" label="Api secret">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Button
        onClick={() => {
          setVisible(true);
        }}
      >
        API Settings
      </Button>
    </>
  );
}

export default API;
