/**
Returns a streaming log interface for RethinkDB.
@param {(RethinkDBConnectOptions|string)} options - Options for the connection,
                        or a hostname.
@param {string} [db="test"] - Name of the DB to use.
@returns {StreamingLog}
*/

/**
Creates a streaming log interface for RethinkDB
@class StreamingLog
@classdesc A simple streaming log interface that uses RethinkDB as a backend.
           Tables are used as topics, and r.changes() is used to stream events.
@param {(RethinkDBConnectOptions|string)} options - Options for the connection,
                        or a hostname.
@param {string} [db="test"] - Name of the DB to use.
@property {Observable<RethinkDBConnectOptions>} connect - Observable that connects to RethinkDB and emits
                        an active connection, and closes that connection
                        when the subscription is disposed.
@property {Observable} topics - Observable that emits topics within the
                        selected DB.
*/
/**
Selects a DB.
@memberof StreamingLog#
@function db
@param {string} db - Name of the DB.
@returns {StreamingLog} StreamingLog with a DB.
*/
/**
Selects a topics
@memberof StreamingLog#
@function topic
@param {string} topic - Topic name
@param {TopicOptions} [options] - Options for topic subscription.
@returns {Topic}
*/
/**
Creates a one-time stream that will emit events previously emitted to the topic.
@memberof StreamingLog#
@function replay
@param {string} topic - Topic name
@param {TopicOptions} options - Options for replay
@returns {Observable}
*/
/**
Subscribes to events emitted on the topic
@memberof StreamingLog#
@function subscribe
@param {string} topic - Topic name
@param {TopicOptions} [options] - Options for topic subscription.
@param {Observer} observer - Observer to receive events.
@returns {Subscription}
*/
/**
Creates an observer that will submit events to a topic.<br />
<strong>Remember to call `onCompleted` to release the connection.</strong>
@memberof StreamingLog#
@function publish
@param {string} topic - Topic name
@returns {Observer}
*/
/**
Creates an observer that will submit events to a topic.<br />
<strong>Remember to call `onCompleted` to release the connection.</strong>
@memberof StreamingLog#
@function publish
@param {string} topic - Topic name
@param {Observable} observable - Stream of events to be emitted to the topic.
@returns {Subscription}
*/
/**
Creates a topic and emits true/false to a stream representing if the topic
was just created.
@memberof StreamingLog#
@function createTopic
@param {string} topic - Topic name
@returns {Observable<boolean>}
*/


/**
Options for topics
@typedef TopicOptions
@property {boolean} fromBeginning - Specify to replay the topic from the
                      beginning.
@property {DateTime} timestamp - Specify to replay the topic from the specified
                      timestamp.
@property {boolean} waitForTopic - Polls database every 1 second for the topic
*/

/**
Streaming log for a topic.<br />
<pre>rrx.streamingLog().topic("topic")</pre>
@class Topic
@abstract
*/
/**
Subscribes to events emitted on the topic
@memberof Topic#
@function subscribe
@param {onNext|Observer} [onNext] - Called when an item is emitted on a stream
@param {onError} [onError] - Called when an error occurs on a stream and terminates
@param {onCompleted} [onCompleted] - Called when a stream completes
@returns {Subscription}
*/
/**
Creates an observer that will submit events to a topic.<br />
<strong>Remember to call `onCompleted` to release the connection.</strong>
@memberof Topic#
@function publish
@returns {Observer}
*/
/**
Creates an observer that will submit events to a topic.<br />
<strong>Remember to call `onCompleted` to release the connection.</strong>
@memberof Topic#
@function publish
@param {Observable} observable - Stream of events to be emitted to the topic.
@returns {Subscription}
*/
/**
Creates a one-time stream that will emit events previously emitted to the topic.
@memberof Topic#
@function replay
@param {TopicOptions} options - Options for replay
@returns {Observable}
*/
/**
Creates a topic and emits true/false to a stream representing if the topic
was just created.
@memberof Topic#
@function create
@returns {Observable<boolean>}
*/
