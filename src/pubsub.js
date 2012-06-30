/*!
* pubsub.js
* 
* @author Federico "Lox" Lucignano <https://plus.google.com/117046182016070432246>
* 
* Original implementation by Daniel Lamb <daniellmb.com>
*/

(this.__pubsub_js_init__ = function(context){
	//help code minification
	var m = context.module,
		d = context.define;
	
	//universal module
	if(m)//CommonJS module
		m.exports = init();
	else if(d)//CommonJS AMD module
		d("pubsub", init);
	else//traditional module
		context.PubSub = init();

	function init(){
		
		var channels = {},// the channel subscription hash
			funcType = Function;//help minification

		return {
			/*
			 * Publish some data on a channel
			 *
			 * @param String channel The channel to publish on
			 * @param Mixed argument The data to publish, the function supports
			 * as many data parameters as needed
			 *
			 * @example Publish stuff on '/some/channel'. Anything subscribed will
			 * be called with a function signature like: function(a,b,c){ ... }
			 * PubSub.publish("/some/channel", "a", "b", {total: 10, min: 1, max: 3});
			 */
			publish: function(){
				var args = arguments,//help minification
					subs = channels[args[0] /* channel */];

				if(subs){
					var len = subs.length,
						params = (args.length > 1) ? Array.prototype.splice.call(args, 1) : [],
						x = 0;

					//executes callbacks in the order in which they were registered
					for(; x < len; x++)
						subs[x].apply(context, params);
				}
			},

			/*
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
			 * @example PubSub.subscribe("/some/channel", function(a, b, c){ ... });
			 */
			subscribe: function(channel, callback){
				if(!channel)
					throw "channel not specified";
				if(!(callback instanceof funcType))
					throw "callback is not a function";

				if(!channels[channel])
					channels[channel] = [];

				channels[channel].push(callback);

				return [channel, callback];
			},

			/*
			 * Disconnect a subscribed function f.
			 * 
			 * @param Mixed handle The return value from a subscribe call or the
			 * name of a channel as a String
			 * @param Function callback [OPTIONAL] The event handler originaally
			 * registered, not needed if handle contains the return value of subscribe
			 * 
			 * @example
			 * var handle = PubSub.subscribe("/some/channel", function(){});
			 * PubSub.unsubscribe(handle);
			 * 
			 * or
			 * 
			 * PubSub.unsubscribe("/some/channel", callback);
			 */
			unsubscribe: function(handle, callback){
				if(handle instanceof Array && handle.length > 1){
					callback = handle[1];
					handle = handle[0];
				}

				if(typeof handle != "string")
					throw "channel not specified";

				if(!(callback instanceof funcType))
					throw "callback is not a function";

				var subs = channels[handle],
					len = subs ? subs.length : 0;
				
				while(len--){
					if(subs[len] === callback){
						subs.splice(len, 1);
					}
				}
			}
		};
	}
})(this);