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
    url: '',
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
    url: '',
    id: '10',
  }),
);

const transformBitfinexResponse = (response, exchange) => _.map(
  response,
  symbolInfo => ({
    baseAsset: symbolInfo.substr(symbolInfo.length - 3),
    quoteAsset: symbolInfo.substr(symbolInfo.length - 3, symbolInfo.length),
    symbol: symbolInfo,
    exchange,
    url: '',
    id: '20',
  }),
);

const transformBittrexResponse = (response, exchange) => _.map(
  response.result,
  symbolInfo => ({
    baseAsset: symbolInfo.BaseCurrency,
    quoteAsset: symbolInfo.MarketCurrency,
    symbol: symbolInfo.MarketName,
    exchange,
    url: '',
    id: '30',
  }),
);

exports.exchangesArray = _.flatMap(CONSTANTS.EXCHANGES);

exports.mapExchangeToSymbolEndpoint = (exchangeName) => {
  const { EXCHANGES } = CONSTANTS;
  switch (exchangeName) {
    case EXCHANGES.BINANCE:
      return 'https://api.binance.com/api/v1/exchangeInfo';
    case EXCHANGES.OKEX:
      return 'https://www.okcoin.com/api/v1/ticker.do?symbol=btc_usd';
    case EXCHANGES.HUOBI:
      return 'https://api.huobi.pro/v1/common/symbols';
    case EXCHANGES.HADAX:
      return 'https://api.huobi.pro/v1/hadax/common/symbols';
    case EXCHANGES.BITFINEX:
      return 'https://api.bitfinex.com/v1/symbols';
    // Fucking bithumb is using KRW as its base currency....?????
    // case EXCHANGES.BITHUMB:
    //   return 'https://api.bithumb.com/public/orderbook/{currency}';
    case EXCHANGES.BITTREX:
      return 'https://bittrex.com/api/v1.1/public/getmarkets';
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
      id: symbol.id + hexMd5(symbol.symbol + symbol.exchange),
    }),
  );

  return symbolData;
};
