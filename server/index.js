const axios = require('axios');
const { schema, normalize } = require('normalizr');
const _ = require('lodash');
const { fromJS } = require('immutable');
const { exchangesArray, transformResponse, mapExchangeToSymbolEndpoint } = require('./util/util');

const exchangesPromise = _
  .map(exchangesArray, value => axios.get(mapExchangeToSymbolEndpoint(value)));

Promise.all(exchangesPromise).then((responses) => {
  const exchangeResponseMap = _.zipObject(exchangesArray, responses);
  const data = _
    .chain(exchangeResponseMap)
    .map((response, exchange) => transformResponse(response.data, exchange))
    .flatten()
    .value();

  console.log(data);
});

// axios
//   .get('https://api.binance.com/api/v1/exchangeInfo')
//   .then((response) => {
//     const myData = response.data.symbols;
//     console.log(exchangeEndpoints);
//     // const exchangeSchema = new schema.Entity('exchanges', {}, {
//     //   idAttribute: 'symbol',
//     //   processStrategy: (entity) => {
//     //     const exchange = { exchange: 'BINANCE' };
//     //     const partialEntity = lodash.pick(entity, ['symbol', 'baseAsset', 'quoteAsset']);
//     //     return lodash.assign(exchange, partialEntity);
//     //   },
//     // });
//     // const symbolSchema = new schema.Entity('symbols', {}, {
//     //   idAttribute: 'symbol',
//     //   processStrategy: (entity) => {
//     //     const exchange = { exchange: 'BINANCE' };
//     //     const partialEntity = lodash.pick(entity, ['symbol', 'baseAsset', 'quoteAsset']);
//     //     return lodash.assign(exchange, partialEntity);
//     //   },
//     // });
//     // const mySchema = [symbolSchema];
//     // const normalizedData = normalize(myData, mySchema);
//     // console.log(fromJS(normalizedData));
//   });
