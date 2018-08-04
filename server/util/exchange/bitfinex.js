const WebSocket = require('ws');
const _ = require('lodash');
const CONSTANTS = require('../config');

const orderBook = {};
// const WS_URL = 'wss://api.huobi.pro/ws';
// const WS_URL = 'wss://stream.binance.com:9443/ws/bnbbtc@depth';

const isOrderBookData = data => (data[1] !== 'hb' && !data.event);

const isSubscribedHeader = data => (data.event === 'subscribed');

const isInitialSnapshot = data => (typeof (data[1][0]) === 'object');

const isDeleteOrder = data => (data[2] === 0);

const initBifinexOrderBook = (normalizedSchema, symbols) => {
  const WS_URL = CONSTANTS.DEPTH_ENDPOINT_PREFIX.BITFINEX;
  const ws = new WebSocket(WS_URL);
  ws.onopen = () => {
    // console.log(symbols);
    _.each(symbols, (symbolInfo) => {
      const { symbol } = symbolInfo;
      if (symbol === 'gntusd') {
        const msg = {
          event: 'subscribe',
          channel: 'book',
          pair: symbol,
          freq: 'F1',
        };
        orderBook[symbol.toUpperCase()] = symbolInfo;
        ws.send(JSON.stringify(msg));
      }
    });
  };
  ws.onmessage = (msg) => {
    console.log(normalizedSchema.symbols[normalizedSchema.bases.GNT.USD]);
    const data = JSON.parse(msg.data);
    // console.log(data);
    if (isSubscribedHeader(data)) {
      const { chanId, pair } = data;
      const symbolInfo = orderBook[pair];
      orderBook[chanId] = symbolInfo;
    } else if (isOrderBookData(data)) {
      const [chanId, orders] = data;
      if (isInitialSnapshot(data)) {
        orderBook[chanId].orders = orders;
        // console.log(normalizedSchema.symbols[normalizedSchema.bases.GNT.USD]);
      } else if (isDeleteOrder(data)) {
        // Delete the entries with price === orders[0]
      } else { // Normal order book update
        // add/minus corresponding entries
      }
    }
  };
  ws.onclose = () => {
    console.log('close');
    initBifinexOrderBook(normalizedSchema, symbols);
  };
  ws.onerror = (err) => {
    console.log('error', err);
    initBifinexOrderBook(normalizedSchema, symbols);
  };
};

exports.initBifinexOrderBook = initBifinexOrderBook;
exports.transformBitfinexResponse = (response, exchange) => _.map(
  response,
  symbolInfo => ({
    baseAsset: symbolInfo.substr(0, symbolInfo.length - 3),
    quoteAsset: symbolInfo.substr(symbolInfo.length - 3, symbolInfo.length),
    symbol: symbolInfo,
    exchange,
    id: '20',
  }),
);
