import Store from 'electron-store';
// const config = {
//   apiKey: '6234cdd4720edf000108518f',
//   secretKey: 'fbb712a9-a244-41c9-abb7-f69de4f5ab6e',
//   passphrase: 'Prova@22',
//   environment: 'live',
// }

async function Caller(
  metodo: 'GET' | 'POST' | 'DELETE',
  endpoint: string,
  body: string
) {
  // const { v4: uuidv4 } = require('uuid');
  const { createHmac } = require('crypto');
  const axios = require('axios').default;
  // call electron store
  const store = new Store();
  const api: any = store.get('api');
  const baseUrl = 'https://api-futures.kucoin.com';
  // const config = {
  //   apiKey: '6233811134de1d0001e64b31',
  //   secretKey: 'd5c0fa29-e42d-4622-be02-4f7a90b1c184',
  //   passphrase: 'Fox9Code95!!9620',
  //   environment: 'live',
  // };
  const config = {
    apiKey: api.kucoin.key,
    secretKey: api.kucoin.secret,
    passphrase: api.kucoin.passphrase,
  };
  const METODO = metodo;
  const ENDPOINT = endpoint;
  const BODY = body;
  const timestamp = new Date().getTime().toString();
  const KC_API_PASSPHRASE = createHmac('sha256', config.secretKey)
    .update(config.passphrase)
    .digest('base64');
  // let uuid = uuidv4();
  const KC_API_SIGN = createHmac('sha256', config.secretKey)
    .update(
      `${timestamp}${METODO}${ENDPOINT}${
        BODY !== '' ? JSON.stringify(BODY) : ''
      }`
    )
    .digest('base64');
  const headers = {
    'KC-API-KEY': config.apiKey,
    'KC-API-PASSPHRASE': KC_API_PASSPHRASE,
    'KC-API-SIGN': KC_API_SIGN,
    'KC-API-TIMESTAMP': timestamp,
    'KC-API-KEY-VERSION': '2',
  };
  if (metodo === 'GET') {
    const data = await axios.get(`${baseUrl}${ENDPOINT}`, {
      headers,
    });
    const info = data.data;
    return info;
  }
  if (metodo === 'POST') {
    const data = await axios.post(
      `${baseUrl}${ENDPOINT}`,
      // @ts-expect-error
      { ...BODY },
      {
        headers,
      }
    );
    const info = data.data;
    return info;
  }
}

module.exports = Caller;
