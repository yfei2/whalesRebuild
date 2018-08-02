const axios = require('axios');
const { schema, normalize } = require('normalizr');
const lodash = require('lodash');
const { fromJS } = require('immutable');

axios
  .get('https://api.binance.com/api/v1/exchangeInfo')
  .then((response) => {
    const myData = response.data.symbols;
    const exchangeSchema = new schema.Entity('exchanges', {}, {
      idAttribute: 'symbol',
      processStrategy: (entity) => {
        const exchange = { exchange: 'BINANCE' };
        const partialEntity = lodash.pick(entity, ['symbol', 'baseAsset', 'quoteAsset']);
        return lodash.assign(exchange, partialEntity);
      },
    });
    const symbolSchema = new schema.Entity('symbols', {}, {
      idAttribute: 'symbol',
      processStrategy: (entity) => {
        const exchange = { exchange: 'BINANCE' };
        const partialEntity = lodash.pick(entity, ['symbol', 'baseAsset', 'quoteAsset']);
        return lodash.assign(exchange, partialEntity);
      },
    });
    const mySchema = [symbolSchema];
    const normalizedData = normalize(myData, mySchema);
    console.log(fromJS(normalizedData));
  });
