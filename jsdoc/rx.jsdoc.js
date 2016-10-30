/**
@class Observable
@see {@link https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md}
*/
/**
@memberof Observable#
@function subscribe
@param {onNext|Observer} [onNext] - Called when an item is emitted on a stream
@param {onError} [onError] - Called when an error occurs on a stream and terminates
@param {onCompleted} [onCompleted] - Called when a stream completes
@returns {Subscription}
*/
/**
Called when an item is emitted on a stream
@callback onNext
@param {object} value - Item emitted
*/
/**
Called when an error occurs on a stream and terminates
@callback onError
@param {object} error - Error thrown
*/
/**
Called when a stream completes
@callback onCompleted
*/
/**
@typedef Observer
@property {onNext} onNext - Called when an item is emitted on a stream
@property {onError} onError - Called when an error occurs on a stream and terminates
@property {onCompleted} onCompleted - Called when a stream completes
*/
/**
@class Subscription
*/
/**
Ends the subscription, and releases upstream resources.
@memberof Subscription#
@function dispose
*/
