PubraSub.js
===========

A [pubsub](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)
implementation in a special way (PUBlish-Request-Answer-SUBscribe). The basic PubSub function has been extended with two extra methods. Those are variations of the Publish method.
*	__Request__ method : Publishes a message on a channel and waiting for (subscribes to) any answer from any subscriber via a _reverse_ channel
*	__Answer__ method : The dedicated way to publish an answer message to a request (will use a _reverse_ channel)

This project is evolved from an original pubsub implementation by [Federico Lox](https://github.com/federico-lox/),
who also refactored other's work, like [Daniel Lamb](http://daniellmb.com).


...editing the README is in progress...


Credits
-------

*	[Adam Solymos](http://github.com/adamsolymos/), creator and maintainer
*	[Federico "Lox" Lucignano](https://plus.google.com/117046182016070432246 "Google profile"), original code
*	[Daniel Lamb](http://daniellmb.com), more original code
*	All the [contributors](http://github.com/federico-lox/pubsub.js/contributors "pubsub.js contributors at GitHub")
