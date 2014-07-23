/*!
 * connect-memcached
 * MIT Licensed
 */

var Memcached = require('memcached');
var oneDay = 86400;
function ensureCallback(fn) {
	return function() {
		fn && fn.apply(null, arguments);
	};
}
var Mclient;
var Mopts;

/**
 * Return the `MemcachedStore` extending `connect`'s session Store.
 *
 * @param {object} session
 * @return {Function}
 * @api public
 */

function dooauth(cb) {
    var k =  Mopts.token + " " + Mopts.project_id + " " + Mopts.cache_name ;
    var self = this;
    Mclient.set('oauth', k, 0, ensureCallback( function(err, data) {
        cb()
    }));
};

module.exports = function(session) {
	// var Store = session.Store;
    var Store = session.Store || session.session.Store;

	/**
	 * Initialize MemcachedStore with the given `options`.
	 *
	 * @param {Object} options
	 * @api public
	 */
	function MemcachedStore(options) {
		options = options || {};
		Store.call(this, options);

		this.prefix = options.prefix || '';
		if (!options.client) {
			if (!options.hosts) {
				options.hosts = '127.0.0.1:11211';
			}

			options.client = new Memcached(options.hosts, options);
		}
        Mopts = options;
		this.client = options.client;
        Mclient = options.client;
        dooauth(function() {});
	}

	MemcachedStore.prototype.__proto__ = Store.prototype;

	/**
	 * Translates the given `sid` into a memcached key, optionally with prefix.
	 *
	 * @param {String} sid
	 * @api private
	 */
	MemcachedStore.prototype.getKey = function getKey(sid) {
		return this.prefix + sid;
	};

	/**
	 * Attempt to fetch session by the given `sid`.
	 *
	 * @param {String} sid
	 * @param {Function} fn
	 * @api public
	 */
	MemcachedStore.prototype.get = function(sid, fn) {

        dooauth(function() {
		Mclient.get(sid, function(err, data) {
            if (err) { return fn(err, {}); }
			try {
				if (!data) {
					return fn();
				}
				fn(null, JSON.parse(data.toString()));
			} catch (e) {
				fn(e);
			}
		});
        });
	};

	/**
	 * Commit the given `sess` object associated with the given `sid`.
	 *
	 * @param {String} sid
	 * @param {Session} sess
	 * @param {Function} fn
	 * @api public
	 */
	MemcachedStore.prototype.set = function(sid, sess, fn) {
		sid = this.getKey(sid);

		try {
			var maxAge = sess.cookie.maxAge;
			var ttl = 'number' == typeof maxAge ? maxAge / 1000 | 0 : oneDay;
			var sess = JSON.stringify(sess);

            dooauth(function() {
			Mclient.set(sid, sess, ttl, ensureCallback(fn));
            });
		  } catch (err) {
		    fn && fn(err);
		  }
	};

	/**
	 * Destroy the session associated with the given `sid`.
	 *
	 * @param {String} sid
	 * @param {Function} fn
	 * @api public
	 */
	MemcachedStore.prototype.destroy = function(sid, fn) {
		sid = this.getKey(sid);
        dooauth(function() {
		Mclient.del(sid, ensureCallback(fn));
        });
	};

	/**
	 * Fetch number of sessions.
	 *
	 * @param {Function} fn
	 * @api public
	 */
	MemcachedStore.prototype.length = function(fn) {
        dooauth(function() {
		Mclient.items(ensureCallback(fn));
        });
	};

	/**
	 * Clear all sessions.
	 *
	 * @param {Function} fn
	 * @api public
	 */
	MemcachedStore.prototype.clear = function(fn) {
        dooauth(function() {
		Mclient.flush(ensureCallback(fn));
        });
	};

	return MemcachedStore;
};
