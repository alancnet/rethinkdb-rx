const rx = require('rx');
const r = require('rethinkdb');

function streamingLog(options, db) {
  return new StreamingLog(options, db);
}

function StreamingLog(options, db) {
  const rdb = db ? r.db(db) : r;
  this.connect = rx.Observable.create(obs => {
    var conn = null;
    r.connect(options)
      .then(connection => {
        conn = connection;
        obs.onNext(connection);
      })
      .catch(err => {
        obs.onError(err);
      });
    return () => conn && conn.close();
  });

  this.topics = this.connect.flatMap(conn => rx.Observable.create(obs => {
    function getTables() {
      rdb.tableList().run(conn, (err, tables) => {
        if (err) obs.onError(err);
        tables.forEach(table => obs.onNext(table));
      });
    }
    getTables();
    const timer = setInterval(getTables, 1000);
    return () => {
      clearInterval(timer);
    };
  }).distinct());

  this.db = (db) => new StreamingLog(options, db);

  /**
    usage: sl.subscribe("topic", {
      fromBeginning: true,
      timestamp: 10355 // Note: This will result in duplicate
                       // emissions. Deal with it.
    })
  */

  this.topic = (topic, options) => {
    if (!options) options = {
      fromBeginning: false,
      timestamp: null,
      waitForTopic: false
    };
    if (!topic) {
      throw new Error("topic is required.");
    } else if (options.fromBeginning && options.timestamp) {
      throw new Error("cannot specify both fromBeginning and timestamp.");
    } else {
      var topicStream = this.connect
        .flatMap(conn => rx.Observable.create(obs => {
          rdb.table(topic)
            .changes()
            .run(conn, (err, cursor) => {
              if (err) obs.onError(err);
              else cursor.each((err, item) => {
                if (err) obs.onError(err);
                else if (item && item.new_val) obs.onNext(item.new_val);
              });
            })
        }));
      if (options.timestamp || options.fromBeginning) {
        topicStream = rx.Observable.concat(
          this.replay(topic, options),
          topicStream
        );
      }
      if (options && options.waitForTopic) {
        topicStream = rx.Observable.concat(
          this.topics
            .filter(x => x === topic) // Look for the topic
            .take(1)                  // Complete when we find it
            .filter(x => false),      // but don't emit anything.
          topicStream
        );
      }
      topicStream.publish = (observable) => this.publish(topic, observable);
      topicStream.replay = function(options) {
        if (!option || typeof options == 'object' && options.constructor == Object) {
          return this.replay(topic, options);
        } else {
          return rx.Observable.prototype.replay.apply(topicStream, arguments);
        }
      }.bind(this);
      topicStream.create = () => this.createTopic(topic);
      return topicStream;
    }
  };

  this.replay = (topic, options) => rx.Observable.create(obs => {
    const connSub = this.connect.subscribe(conn => {
      rdb.table(topic)
        .orderBy('timestamp')
        .filter(r.row('timestamp').ge(options.timestamp || new Date(0)))
        .run(conn, (err, cursor) => {
          if (err) obs.onError(err);
          else cursor.each((err, value) => {
            if (err) obs.onError(err);
            else obs.onNext(value);
          }, () => {
            connSub.dispose();
            obs.onCompleted();
          })
        })
    })
  });

  this.createTopic = (topic) => this.connect
    .flatMap(conn => rx.Observable.create(obs => {
      rdb.tableList().run(conn, (err, tables) => {
        if (err) obs.onError(err);
        else if (tables.indexOf(topic) === -1) {
          rdb.tableCreate(topic).run(conn, (err) => {
            if (err) obs.onError(err);
            else {
              obs.onNext(true);
              obs.onCompleted();
            }
          });
        } else {
          obs.onNext(false);
          obs.onCompleted();
        }
      });
    })).take(1);

  this.subscribe = (topic, options, observer) => {
    if (options.onNext || typeof options == 'function') {
      observer = options;
      options = {};
    }
    return this.topic(topic, options).subscribe(observer);
  };

  this.publish = (topic, observable) => {
    if (observable) {
      const pauser = new rx.BehaviorSubject(false);
      const rtopic = rdb.table(topic);
      var observer = null;
      var subscription = observable.pausableBuffered(pauser).subscribe(
        val => {
          observer.onNext(val);
        },
        err => observer.onError(val),
        () => observer.onCompleted()
      );

      const connSub = this.connect.subscribe(
        conn => {
          observer = {
            onNext: val => {
              rtopic.insert({
                timestamp: r.now(),
                value: val
              }).run(conn, (err) => {
                if (err) {
                  console.error(`Error in streamingLog(${options}, ${db}).publish(${topic}).insert():`, err);
                  subscription.dispose();
                  connSub.dispose();
                } else {
                }
              })
            },
            onError: err => {
              console.error(`Error in streamingLog(${options}, ${db}).publish(${topic}).subscribe():`, err);
              subscription.dispose();
              connSub.dispose();
            },
            onCompleted: () => subscription.dispose()
          };
          pauser.onNext(true);
        },
      err => {
        console.error(`Error in streamingLog(${options}, ${db}).publish(${topic}).connect():`, err);
        subscription.dispose();
      }
    );

      return connSub;
    } else {
      const subject = new rx.Subject();
      this.publish(topic, subject);
      return subject;
    }
  };
}

module.exports = streamingLog;
