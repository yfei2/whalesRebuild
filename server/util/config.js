const CONSTANTS = {
  EXCHANGES: {
    BINANCE: 'BINANCE',
    OKEX: 'OKEX',
    HUOBI: 'HUOBI',
    HADAX: 'HADAX',
    BITFINEX: 'BITFINEX',
    BITTREX: 'BITTREX',
  },
  SYMBOLS_ENDPOINT: {
    BINANCE: 'https://api.binance.com/api/v1/exchangeInfo',
    OKEX: 'https://www.okcoin.com/api/v1/ticker.do?symbol=btc_usd',
    HUOBI: 'https://api.huobi.pro/v1/common/symbols',
    HADAX: 'https://api.huobi.pro/v1/hadax/common/symbols',
    BITFINEX: 'https://api.bitfinex.com/v1/symbols',
    BITTREX: 'https://bittrex.com/api/v1.1/public/getmarkets',
  },
  DEPTH_ENDPOINT_PREFIX: {
    BINANCE: 'wss://stream.binance.com:9443',
    /** OKCoin
      They state that they have a Chinese websocket portal with CNY quoteAsset,
      but the websocket API reference page is down
    */
    OKEX_INTL: 'wss://real.okcoin.com:10440/websocket/okcoinapi',
    OKEX_CN: 'wss://real.okcoin.cn:10440/websocket/okcoinapi',
    HUOBI: 'wss://api.huobi.pro/ws',
    HADAX: 'wss://api.hadax.com/ws',
    BITFINEX: 'wss://api.bitfinex.com/ws/2',
    /**
      It seems like Bittrex is using signalr for its ws connection.
      Need to figure out how to migrate signalr hub into regular ws workflow.

      Ref: https://github.com/Bittrex/bittrex.github.io/blob/master/samples/WebsocketSample.js
    */
    BITTREX: 'wss://beta.bittrex.com/signalr',
  },
};

module.exports = CONSTANTS;
