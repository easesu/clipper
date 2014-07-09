/**
* Event.js
*/


function Event() {
	this.events = {};
	this.listenings = {};
}

/**
* 方法
*/

Utils.extend(Event.prototype, {
	/**
	* 绑定事件
	*/
	on: function(event, handler) {
		var events = this.events,
			_handler = handler._callback || handler,
			handlers;

		if (!Utils.isArray(event)) {
			event = [event];
		}

		event.forEach(function(evt) {
			var isExist = false;

			if (events[evt]) {
				handlers = events[evt];
			} else {
				handlers = events[evt] = [];
			}
			isExist = handlers.some(function(h) {
				var _h = h._callback || h;

				if (_h === _handler) {
					return true;
				}
			});
			if (!isExist) {
				handlers.push(handler);
			}
		});

		
	},

	/**
	* 解除事件绑定
	*/
	off: function(event, handler) {
		var events = this.events || {},
			handlers = events[event],
			_handler,
			_handlers;

		if (handlers === undefined) {
			return false;
		}

		if (handler === undefined) {
			delete events[event];
		} else {
			_handler = handler._callback || handler;
			_handlers = handlers.filter(function(h) {
				var _h = h._callback || h;
				if (_h !== _handler) {
					return true;
				}
			});
			if (_handlers.length === 0) {
				delete events[event];
			} else {
				events[event] = _handlers;
			}


		}
		return true;
	},

	/**
	* 绑定一次性事件
	*/
	once: function(event, handler) {
		var _this = this;
		var _handler = function() {
			handler.apply(this, Utils.getArgs(arguments));
			_this.off(event, handler);
		}
		_handler._callback = handler;
		_this.on(event, _handler);
	},

	/**
	* 触发指定事件
	*/
	trigger: function(event) {
		var events = this.events,
			handlers = events[event],
			_this = this,
			res = true,
			args;

		if (!handlers) {
			return res;
		}

		args = Utils.getArgs(arguments, 1);

		handlers.forEach(function(handler) {
			if (handler.apply(_this, args) === false) {
				res = false;
			}
		});
		return res;
	},

	listen: function(event, handler) {
		var listenings = this.listenings,
			isExist = false,
			_handler = handler._callback || handler,
			handlers;

		if (!Utils.isArray(event)) {
			event = [event];
		}

		event.forEach(function(evt) {
			if (listenings[evt]) {
				handlers = listenings[evt];
			} else {
				handlers = listenings[evt] = [];
			}

			isExist = handlers.some(function(h) {
				var _h = h._callback || h;

				if (_h === _handler) {
					return true;
				}
			});

			if (!isExist) {
				handlers.push(handler);
			}
		});

		
	},

	doListen: function(event, data) {
		var events = this.listenings,
			handlers = events[event],
			_this = this,
			res = true,
			args;

		if (!handlers) {
			return res;
		}

		handlers.forEach(function(handler) {
			if (handler.call(_this, data) === false) {
				res = false;
			}
		});
		return res;
	}
});