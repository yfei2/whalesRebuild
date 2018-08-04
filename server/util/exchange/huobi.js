const _ = require('lodash');

exports.transformHuobiResponse = (response, exchange) => _.map(
  response.data,
  symbolInfo => ({
    baseAsset: symbolInfo['base-currency'],
    quoteAsset: symbolInfo['quote-currency'],
    symbol: symbolInfo.symbol,
    exchange,
    id: '10',
  }),
);
