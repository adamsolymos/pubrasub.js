/**
 * pubrasub.js
 *
 * A tiny, standalone and robust special pubsub implementation
 * with 2 extra methods: request and answer
 * supporting different javascript environments
 *
 * @author Adam Solymos <https://github.com/adamsolymos/>
 *
 * @see https://github.com/adamsolymos/pubrasub.js
 */

/*global define, module*/
(function (context) {
	'use strict';

	/**
	 * @private
	 */
	function init() {
		//the channel subscription hash
		var channels = {},
			//help minification
			funcType = Function;

		return {
			/*
			 * @public
			 *
			 * Publish some data on a channel
			 *
			 * @param String channel The channel to publish on
			 * @param Mixed argument The data to publish, the function supports
			 * as many data parameters as needed
			 *
			 * @example Publish stuff on '/some/channel'.
			 * Anything subscribed will be called with a function
			 * signature like: function(a,b,c){ ... }
			 *
			 * PubraSub.publish(
			 *		"/some/channel", "a", "b",
			 *		{total: 10, min: 1, max: 3}
			 * );
			 */
			publish: function () {
				//help minification
				var args = arguments,
					// args[0] is the channel
					subs = channels[args[0]],
					len,
					params,
					x;

				if (subs) {
					len = subs.length;
					params = (args.length > 1) ?
							Array.prototype.splice.call(args, 1) : [];

					//run the callbacks asynchronously,
					//do not block the main execution process
					setTimeout(
						function () {
							//executes callbacks in the order
							//in which they were registered
							for (x = 0; x < len; x += 1) {
								subs[x].apply(context, params);
							}

							//clear references to allow garbage collection
							subs = context = params = null;
						},
						0
					);
				}
			},
			
			channelInverter: '@',
			listeningTimeout: 200,
			
			/*
			 * @public
			 *
			 * Request - A sepcial way to publish some data on a channel
			 *		and then waiting for an answer
			 *
			 * @param String channel The channel to publish on
			 * @param Mixed argument The data to publish, the function supports
			 * as many data parameters as needed
			 * ...
			 * @param Function callback Event handler, Request is waiting for an answer
			 * message on a special reverse channel which temporarily subscribed to
			 *
			 * @example Publish stuff on '/some/channel'.
			 * Anything subscribed will be called with a function
			 * signature like: function(a,b,c){ ... }
			 *
			 * PubraSub.request(
			 *		"/some/channel",
			 *		"a", "b", {total: 10, min: 1, max: 3},
			 *		function(a, b, c){ ... }
			 * );
			 */
			request: function () {
				var that = this;
				var args = Array.prototype.slice.call(arguments),
					// First argument is the channel
					channel = args[0],
					// Last argument is the callback function
					answerCallback = args.pop();
				
				// Actually publish the rest of the arguments on the channel
				this.publish.apply(this, args);
				
				// Subscribe to the reverse channel
				channel = this.channelInverter + channel;
				var handle = this.subscribe(channel, answerCallback);

				// After a timeout, unsubscribe
				setTimeout(function () {
						that.unsubscribe(handle);
					},
					this.listeningTimeout);
			},

			/*
			 * @public
			 *
			 * Answer - A sepcial way to publish some data on a reverse channel
			 * 		as an answer to a Request
			 *
			 * @param String channel The original channel where the request was published
			 * @param Mixed argument The data to publish, the function supports
			 * as many data parameters as needed
			 *
			 * @example Publish stuff on '@/some/channel'.
			 * The original requester is subscribed and will be called with a function
			 * signature like: function(a,b,c){ ... }
			 *
			 * PubraSub.answer(
			 *		"/some/channel",
			 *		"a", "b", {total: 10, min: 1, max: 3}
			 * );
			 */
			answer: function () {
				var args = Array.prototype.slice.call(arguments),
					// First argument is the original channel
					channel = args.shift();

				channel = this.channelInverter + channel;

				args.unshift(channel);
				
				// Actually publish the rest of the arguments on the channel
				this.publish.apply(this, args);
			},

			/*
			 * @public
			 *
			 * Register a callback on a channel
			 *
			 * @param String channel The channel to subscribe to
			 * @param Function callback The event handler, any time something is
			 * published on a subscribed channel, the callback will be called
			 * with the published array as ordered arguments
			 *
			 * @return Array A handle which can be used to unsubscribe this
			 * particular subscription
			 *
			 * @example PubraSub.subscribe(
			 *				"/some/channel",
			 *				function(a, b, c){ ... }
			 *			);
			 */
			subscribe: function (channel, callback) {
				if (typeof channel !== 'string') {
					throw "invalid or missing channel";
				}

				if (!(callback instanceof funcType)) {
					throw "invalid or missing callback";
				}

				if (!channels[channel]) {
					channels[channel] = [];
				}

				channels[channel].push(callback);

				return {channel: channel, callback: callback};
			},

			/*
			 * @public
			 *
			 * Disconnect a subscribed function f.
			 *
			 * @param Mixed handle The return value from a subscribe call or the
			 * name of a channel as a String
			 * @param Function callback [OPTIONAL] The event handler originaally
			 * registered, not needed if handle contains the return value
			 * of subscribe
			 *
			 * @example
			 * var handle = PubSub.subscribe("/some/channel", function(){});
			 * PubSub.unsubscribe(handle);
			 *
			 * or
			 *
			 * PubraSub.unsubscribe("/some/channel", callback);
			 */
			unsubscribe: function (handle, callback) {
				if (handle.channel && handle.callback) {
					callback = handle.callback;
					handle = handle.channel;
				}

				if (typeof handle !== 'string') {
					throw "invalid or missing channel";
				}

				if (!(callback instanceof funcType)) {
					throw "invalid or missing callback";
				}

				var subs = channels[handle],
					x,
					y = (subs instanceof Array) ? subs.length : 0;

				for (x = 0; x < y; x += 1) {
					if (subs[x] === callback) {
						subs.splice(x, 1);
						break;
					}
				}
			}
		};
	}

	//UMD
	if (typeof define === 'function' && define.amd) {
		//AMD module
		define('pubrasub', init);
	} else if (typeof module === 'object' && module.exports) {
		//CommonJS module
		module.exports = init();
	} else {
		//traditional namespace
		context.PubraSub = init();
	}
}(this));
