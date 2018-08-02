import { EXCHANGES } from './config';

const mapExchangeToSymbolEndpoint = (exchangeName) => {
  switch (exchangeName) {
    case EXCHANGES.BINANCE:
      return 'https://api.binance.com/api/v1/exchangeInfo';
    case EXCHANGES.OKEX:
      return 'https://www.okcoin.com/api/v1';
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

  }
}

export const getSymbol = (exchangeName) => {

  switch()
};

export const normalize
