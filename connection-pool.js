const rx = require('rx');
const rethinkdb = require('rethinkdb');
const log4js = require('log4js');

function RethinkDBConnector(connectionOptions) {
  const log = log4js.getLogger('RethinkDbConnector');
  const myId = RethinkDBConnector.count = (RethinkDBConnector.count || 0) + 1;
  const ret = {
    isConnected: function() { return this.connected; },
    connect: function(callback) {
      log.debug(`Connecting ${this}`);
      rethinkdb.connect(connectionOptions)
        .then(conn => {
          log.debug(`Connected ${this}`);
          this.connection = conn;
          this.connected = true;
          callback(null, conn);
        })
        .catch(err => {
          log.error(`Connection error ${this} ${err}`);
          callback(err, null);
        });
    },
    disconnect: function() {
      log.debug(`Disconnecting ${this}`)
      this.connection && this.connection.close();
    },
    toString: function() {
      return `[RethinkDBConnector ${myId}]`;
    }
  };
  log.debug(`Created ${ret}`);
  return ret;
}

function connectionPool(options) {
  return new ConnectionPool(options);
}

function ConnectionPool(options) {
  const log = log4js.getLogger('ConnectionPool');
  if (!options) throw new Error('options required');
  if (!options.connectionOptions) console.warn('connectionPool called without {connectionOptions: ...}');
  var Connector = options.Connector || RethinkDBConnector;
  var poolSize = options.poolSize || 10;
  var timeout = 10000;
  var pool = [];

  function pushConnection(connector) {
    if (pool.length == poolSize) {
      log.debug(`Pool size reached max (${poolSize}), trimming oldest connection.`);
      const oldConnection = pool.shift();
      oldConnection.disconnect();
      clearTimeout(oldConnection.timer);
    }
    connector.timer = setTimeout(function() {
      log.debug(`Connection unused for ${timeout}ms. Disconnecting.`);
      // this connector should always be the last one, but we'll check anyways.
      const i = pool.indexOf(connector);
      if (i !== -1) pool.splice(i, 1);
      connector.disconnect();
    }, timeout);
    log.debug(`Adding connector to connection pool: ${connector}`);
    pool.push(connector);
  }

  function getConnector() {
    if (pool.length) {
      const connector = pool.shift();
      log.debug(`Reusing connection from pool: ${connector}`);
      clearTimeout(connector.timer);
      return connector;
    } else {
      const connector = new Connector(options.connectionOptions);
      log.debug(`Created new connection: ${connector}`);
      return connector;
    }
  }

  this.connect = rx.Observable.create(obs => {
    const state = {};
    Error.captureStackTrace(state);
    // state.timer = setTimeout(function() {
    //   log.warn(`Connection subscribed for > 30s${state.stack.substr(5)}`);
    // }, 3000);
    const connector = getConnector();
    log.debug(`connect subscribed with connector ${connector}`);
    connector.connect((err, conn) => {
      if (err) {
        log.error(`Connection failed: ${err}`);
        obs.onError(err);
      }
      else {
        log.debug(`Connection success: ${connector}/${conn}`);
        obs.onNext(conn);
      }
    })
    return () => {
      clearTimeout(state.timer);
      log.debug(`Connection released: ${connector}`);
      pushConnection(connector);
    };
  });
}

module.exports = connectionPool;
