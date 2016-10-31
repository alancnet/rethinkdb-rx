/**
Returns a key value store interface for RethinkDB.
@param {(RethinkDBConnectOptions|string)} options - Options for the connection,
                        or a hostname.
@param {string} [db="test"] - Name of the DB to use.
@returns {KeyValueStore}
*/

/**
Creates a key value store interface for RethinkDB
@class KeyValueStore
@classdesc A simple key value store interface that uses RethinkDB as a backend.
           This is backed by the StreamingLog interface, so keys are ultimately
           represented by tables, and values are represented by the last row
           in that table.
@param {(RethinkDBConnectOptions|string)} options - Options for the connection,
                       or a hostname.
@param {string} [db="test"] - Name of the DB to use.
*/
/**
Gets a stream of latest values of a key
@memberof KeyValueStore#
@function get
@param {string} key - Key name (limited to characters A-Za-z0-9_)
@returns {Observable}
*/
/**
Gets a stream with the latest value of a key
@memberof KeyValueStore#
@function getOnce
@param {string} key - Key name (limited to characters A-Za-z0-9_)
@returns {Observable}
*/
/**
Puts each value of a stream to a key
@memberof KeyValueStore#
@function put
@param {string} key - Key name (limited to characters A-Za-z0-9_)
@param {Observable} values - Stream of values
@returns {Subscription}
*/
/**
Creates an observer that will save each value emitted to it to a key
@memberof KeyValueStore#
@function put
@param {string} key - Key name (limited to characters A-Za-z0-9_)
@returns {Observer}
*/
/**
Puts a single value to a key
@memberof KeyValueStore#
@function putOnce
@param {string} key - Key name (limited to characters A-Za-z0-9_)
@param {object} value - Value to save
@returns {Subscription} A pretty useless subscription.
*/
