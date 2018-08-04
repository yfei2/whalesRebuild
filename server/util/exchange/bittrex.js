const _ = require('lodash');

exports.transformBittrexResponse = (response, exchange) => _.map(
  response.result,
  symbolInfo => ({
    baseAsset: symbolInfo.MarketCurrency,
    quoteAsset: symbolInfo.BaseCurrency,
    symbol: symbolInfo.MarketName,
    exchange,
    id: '30',
  }),
);
