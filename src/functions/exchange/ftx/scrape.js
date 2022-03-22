const API_KEY = 'BjUtxHeGwGWash-3U34UI-glgmnM1L9mV4NDqQJG';
const API_SECRET = '5fD5DsD7VELoEjm6dq6aYFLZUNHD-jcZWOcM-4vS';
const { RestClient } = require('ftx-api');

const client = new RestClient(
  API_KEY,
  API_SECRET

  // restClientOptions,
  // requestLibraryOptions
);

// client.getMarkets()
//   .then(result => {
//     console.log("getMarkets result: ", result);
//   })
//   .catch(err => {
//     console.error("getMarkets error: ", err);
//   });
const arr = [];
client.getFundingRates().then((res) => {
  res.result.forEach((item) => {
    arr.push({ ...item, rate: item.rate * 100 });
  });
  arr.sort((a, b) => {
    return a.rate - b.rate;
  });
  console.table(arr);
});
