const _ = require('lodash');

const { hexMd5 } = require('./md5');
const CONSTANTS = require('./config');

const transformBinanceResponse = (response, exchange) => _.map(
  response.symbols,
  symbolInfo => ({
    baseAsset: symbolInfo.baseAsset,
    quoteAsset: symbolInfo.quoteAsset,
    symbol: symbolInfo.symbol,
    exchange,
    id: '00',
  }),
);

const transformHuobiResponse = (response, exchange) => _.map(
  response.data,
  symbolInfo => ({
    baseAsset: symbolInfo['base-currency'],
    quoteAsset: symbolInfo['quote-currency'],
    symbol: symbolInfo.symbol,
    exchange,
    id: '10',
  }),
);

const transformBitfinexResponse = (response, exchange) => _.map(
  response,
  symbolInfo => ({
    baseAsset: symbolInfo.substr(0, symbolInfo.length - 3),
    quoteAsset: symbolInfo.substr(symbolInfo.length - 3, symbolInfo.length),
    symbol: symbolInfo,
    exchange,
    id: '20',
  }),
);

const transformBittrexResponse = (response, exchange) => _.map(
  response.result,
  symbolInfo => ({
    baseAsset: symbolInfo.MarketCurrency,
    quoteAsset: symbolInfo.BaseCurrency,
    symbol: symbolInfo.MarketName,
    exchange,
    id: '30',
  }),
);

exports.exchangesArray = _.flatMap(CONSTANTS.EXCHANGES);

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
  symbolData = _.map(
    symbolData,
    symbol => ({
      ...symbol,
      baseAsset: _.upperCase(symbol.baseAsset),
      quoteAsset: _.upperCase(symbol.quoteAsset),
      id: parseInt(symbol.id + hexMd5(symbol.symbol + symbol.exchange), 16),
    }),
  );

  return symbolData;
};
