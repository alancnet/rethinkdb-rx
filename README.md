# rethink-rx
### Functional Reactive Programming with RethinkDB
A library that provides real-time StreamingLog and KeyValueStore functionality
using RethinkDB as a backend.

## StreamingLog
#### [StreamingLog Reference](https://cdn.rawgit.com/alancnet/rethinkdb-rx/master/out/StreamingLog.html)

```javascript
const rx = require('rx');
const rxdb = require('rethink-rx');
const streamingLog = rxdb.streamingLog({host: 'localhost'}, 'LogDB');

// Create a topic
streamingLog
  .createTopic('coolTopic')
  .subscribe(created => console.log('Topic ready'));

// Subscribe to a topic
const subsub = streamingLog
  .topic('coolTopic')
  .subscribe(value => console.log(value));

// Publish to a topic
const coolStream = rx.Observable
  .interval(1000)
  .map(t => { seconds: t });

const pubsub = streamingLog
  .topic('coolTopic')
  .publish(stream);

// Resource management
subsub.dispose(); // Unsubscribe
pubsub.dispose(); // Stop publishing
```

## KeyValueStore
#### [KeyValueStore Reference](https://cdn.rawgit.com/alancnet/rethinkdb-rx/master/out/KeyValueStore.html)

```javascript
const rx = require('rx');
const rxrb = require('rethink-rx');
const keyValueStore = rxdb.keyValueStore({host: 'localhost'}, 'KeyValDB')

// Save data instantly and imperatively
keyValueStore
  .putOnce('coolKey', {hello: 'world'});

// Save data as it happens
const coolStream = rx.Observable
  .interval(1000)
  .map(t => { seconds: t });

const putsub = keyValueStore
  .put('coolKey', coolStream);

// Retrieve the current value
keyValueStore
  .getOnce('coolKey')
  .subscribe(value => console.log(value));

// Retrieve the current value, and subscribe to all future values.
const getsub = keyValueStore
  .get('coolKey')
  .subscribe(value => console.log(value));

// Resource management
putsub.dispose(); // Stop saving
getsub.dispose(); // Stop getting
```

### TODO:

1. ~~Connection pooling.~~ (Done)
2. ReactiveX interface for standard RethinkDB operations.
3. Memoization of created topics so createTopic can shortcut.
4. Stream of created topics so waitForTopic can be instant.
5. Tests? Everything requires ReactDB...
6. Reporting of resource leaks like undisposed streams and stale connections.
7. Configuration for connection pooling.
