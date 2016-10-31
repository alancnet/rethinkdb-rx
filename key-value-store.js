const rx = require('rx');
const r = require('rethinkdb');
const streamingLog = require('./streaming-log');

function keyValueStore(options, db) {
  return new KeyValueStore(options, db);
}

function KeyValueStore(options, db) {
  this._streamingLog = streamingLog(options, db);
}

KeyValueStore.prototype.get = function(key) {
  const topic = this._streamingLog.topic(key, {waitForTopic: true});
  return topic.replay({tail: 1}).merge(topic);
};

KeyValueStore.prototype.put = function(key, values) {
  if (values == undefined || (values && values.subscribe)) {
    if (values) {
      return this._streamingLog.topic(key).publish(rx.Observable.concat(
        this._streamingLog.createTopic(key).skip(1),
        values
      ));
    } else {
      const obs = new rx.Subject();
      this._streamingLog.topic(key).publish(rx.Observable.concat(
        this._streamingLog.createTopic(key).skip(1),
        values
      ));
      return obs;
    }
    return this._streamingLog.topic(key).publish(values);
  } else {
    throw new Error("Put can only be called with (key, observable) or (key). " +
                    "To set a single value instantly, use .putOnce(key, value).");
  }
};

KeyValueStore.prototype.getOnce = function(key) {
  return this.get(key).take(1);
};

KeyValueStore.prototype.putOnce = function(key, value) {
  return this.put(key, rx.Observable.just(value));
};


module.exports = keyValueStore;
