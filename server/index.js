const axios = require('axios');
const _ = require('lodash');
// const { fromJS } = require('immutable');
// const sizeof = require('object-sizeof');

const {
  exchangesArray,
  transformResponse,
  mapExchangeToSymbolEndpoint,
  initOrderBookSocket,
} = require('./util/util');

const exchangesPromise = _
  .map(exchangesArray, value => axios.get(mapExchangeToSymbolEndpoint(value)));

// Probably move the normalization part to the client?
Promise.all(exchangesPromise).then((responses) => {
  const exchangeResponseMap = _.zipObject(exchangesArray, responses);
  const data = _
    .chain(exchangeResponseMap)
    .map((response, exchange) => transformResponse(response.data, exchange))
    .flatten()
    .value();
  const exchangeListSchema = _
    .chain(data)
    .groupBy(symbolInfo => symbolInfo.exchange)
    .mapValues(symbolInfoList => _.map(symbolInfoList, symbolInfo => symbolInfo.id))
    .value();
  const baseAssetListSchema = _
    .chain(data)
    .groupBy(symbolInfo => symbolInfo.baseAsset)
    .mapValues(symbolBaseList => _.chain(symbolBaseList)
      .groupBy(symbolInfo => symbolInfo.quoteAsset)
      .mapValues(symbolInfoList => _.map(symbolInfoList, symbolInfo => symbolInfo.id))
      .value())
    .value();
  const normalizedSchema = {
    exchanges: exchangeListSchema,
    bases: baseAssetListSchema,
    symbols: _.keyBy(data, 'id'),
  };
  // 197kb
  // console.log(sizeof(normalizedSchema));

  _.each(exchangeListSchema, (symbolIds, exchange) => {
    initOrderBookSocket(normalizedSchema, symbolIds, exchange);
  });
});
