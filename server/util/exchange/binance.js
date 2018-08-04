const _ = require('lodash');

exports.transformBinanceResponse = (response, exchange) => _.map(response.symbols, symbolInfo => ({
  baseAsset: symbolInfo.baseAsset,
  quoteAsset: symbolInfo.quoteAsset,
  symbol: symbolInfo.symbol,
  exchange,
  id: '00',
}));
