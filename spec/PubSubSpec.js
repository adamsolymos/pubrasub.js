/*
 * pubsub.js BDD spec
 *
 * @author Federico "Lox" Lucignano
 * <https://plus.google.com/117046182016070432246>
 */

/*global describe, it, expect, afterEach, PubSub*/
describe("The PubSub object", function () {
	'use strict';

	it("should exist", function () {
		expect(PubSub).toBeDefined();
	});

	it("should have a publish and subscribe method", function () {
		expect(typeof PubSub.publish).toBe('function');
		expect(typeof PubSub.subscribe).toBe('function');
	});

	//TODO: Finish porting from old spec file
});