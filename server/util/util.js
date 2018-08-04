const _ = require('lodash');

const { hexMd5 } = require('./md5');
const CONSTANTS = require('./config');
const { transformBinanceResponse } = require('./exchange/binance');
const { transformHuobiResponse } = require('./exchange/huobi');
const { transformBittrexResponse } = require('./exchange/bittrex');
const { transformBitfinexResponse, initBifinexOrderBook } = require('./exchange/bitfinex');

exports.exchangesArray = _.flatMap(CONSTANTS.EXCHANGES);

exports.initOrderBookSocket = (normalizedSchema, symbolIds, exchange) => {
  const { EXCHANGES, DEPTH_ENDPOINT_PREFIX } = CONSTANTS;
  const symbols = _.pick(normalizedSchema.symbols, symbolIds);

  switch (exchange) {
    case EXCHANGES.BINANCE:
      return DEPTH_ENDPOINT_PREFIX.BINANCE;
    case EXCHANGES.OKEX:
      return DEPTH_ENDPOINT_PREFIX.OKEX;
    case EXCHANGES.HUOBI:
      return DEPTH_ENDPOINT_PREFIX.HUOBI;
    case EXCHANGES.HADAX:
      return DEPTH_ENDPOINT_PREFIX.HADAX;
    case EXCHANGES.BITFINEX:
      return initBifinexOrderBook(normalizedSchema, symbols);
    // Fucking bithumb is using KRW as its base currency....?????
    // case EXCHANGES.BITHUMB:
    //   return 'https://api.bithumb.com/public/orderbook/{currency}';
    case EXCHANGES.BITTREX:
      return DEPTH_ENDPOINT_PREFIX.BITTREX;
    default:
      return '';
  }
};

exports.mapExchangeToSymbolEndpoint = (exchangeName) => {
  const { EXCHANGES, SYMBOLS_ENDPOINT } = CONSTANTS;
  switch (exchangeName) {
    case EXCHANGES.BINANCE:
      return SYMBOLS_ENDPOINT.BINANCE;
    case EXCHANGES.OKEX:
      return SYMBOLS_ENDPOINT.OKEX;
    case EXCHANGES.HUOBI:
      return SYMBOLS_ENDPOINT.HUOBI;
    case EXCHANGES.HADAX:
      return SYMBOLS_ENDPOINT.HADAX;
    case EXCHANGES.BITFINEX:
      return SYMBOLS_ENDPOINT.BITFINEX;
    // Fucking bithumb is using KRW as its base currency....?????
    // case EXCHANGES.BITHUMB:
    //   return 'https://api.bithumb.com/public/orderbook/{currency}';
    case EXCHANGES.BITTREX:
      return SYMBOLS_ENDPOINT.BITTREX;
    default:
      return '';
  }
};

// const checkBitfinexQuoteAsset =
//  response => _.uniq(_.map(response, symbol => symbol.substr(symbol.length - 3, symbol.length)));

exports.transformResponse = (response, exchangeName) => {
  const { EXCHANGES } = CONSTANTS;
  let symbolData;
  switch (exchangeName) {
    case EXCHANGES.BINANCE:
      symbolData = transformBinanceResponse(response, exchangeName);
      break;
    case EXCHANGES.OKEX:
      symbolData = transformHuobiResponse(response, exchangeName);
      break;
    case EXCHANGES.HUOBI:
      symbolData = transformHuobiResponse(response, exchangeName);
      break;
    case EXCHANGES.HADAX:
      symbolData = transformHuobiResponse(response, exchangeName);
      break;
    case EXCHANGES.BITFINEX:
      symbolData = transformBitfinexResponse(response, exchangeName);
      break;
    // Fucking bithumb is using KRW as its base currency....?????
    // case EXCHANGES.BITHUMB:
    //   return 'https://api.bithumb.com/public/orderbook/{currency}';
    case EXCHANGES.BITTREX:
      symbolData = transformBittrexResponse(response, exchangeName);
      break;
    default:
      break;
  }

  // Data post-proceesing
  symbolData = _.map(symbolData, symbol => ({
    ...symbol,
    baseAsset: _.upperCase(symbol.baseAsset),
    quoteAsset: _.upperCase(symbol.quoteAsset),
    id: parseInt(symbol.id + hexMd5(symbol.symbol + symbol.exchange), 16),
  }));

  return symbolData;
};
