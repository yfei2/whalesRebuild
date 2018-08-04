const WebSocket = require('ws');
const _ = require('lodash');
const CONSTANTS = require('../config');

const orderBook = {};
// const WS_URL = 'wss://api.huobi.pro/ws';
// const WS_URL = 'wss://stream.binance.com:9443/ws/bnbbtc@depth';

const isOrderBookData = data => data[1] !== 'hb' && !data.event;

const isSubscribedHeader = data => data.event === 'subscribed';

const isInitialSnapshot = data => typeof data[1][0] === 'object';

const isDeleteOrder = data => data[1][1] === 0;

const mapOrderArrayToObject = data => _.zipObject(['Price', 'Count', 'Amount'], data);

const initBifinexOrderBook = (normalizedSchema, symbols) => {
  const WS_URL = CONSTANTS.DEPTH_ENDPOINT_PREFIX.BITFINEX;
  const ws = new WebSocket(WS_URL);
  ws.onopen = () => {
    _.each(symbols, (symbolInfo) => {
      const { symbol } = symbolInfo;
      const msg = {
        event: 'subscribe',
        channel: 'book',
        pair: symbol,
        freq: 'F1',
      };
      orderBook[symbol.toUpperCase()] = symbolInfo;
      ws.send(JSON.stringify(msg));
    });
  };
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (isSubscribedHeader(data)) {
      const { chanId, pair } = data;
      const symbolInfo = orderBook[pair];
      orderBook[chanId] = symbolInfo;
    } else if (isOrderBookData(data)) {
      const [chanId, ordersData] = data;
      if (isInitialSnapshot(data)) {
        const orders = _.keyBy(_.map(ordersData, mapOrderArrayToObject), 'Price');
        orderBook[chanId].orders = orders;
      } else if (isDeleteOrder(data)) {
        const orderPrice = data[1][0];
        const { orders } = orderBook[chanId];
        orderBook[chanId].orders = _.omit(orders, orderPrice);
      } else {
        const newOrder = _.keyBy([mapOrderArrayToObject(ordersData)], 'Price');
        const { orders } = orderBook[chanId];
        orderBook[chanId].orders = { ...orders, ...newOrder };
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
exports.transformBitfinexResponse = (response, exchange) => _.map(response, symbolInfo => ({
  baseAsset: symbolInfo.substr(0, symbolInfo.length - 3),
  quoteAsset: symbolInfo.substr(symbolInfo.length - 3, symbolInfo.length),
  symbol: symbolInfo,
  exchange,
  id: '20',
}));
