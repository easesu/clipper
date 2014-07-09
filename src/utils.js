/**
*utils.js
*/

var objToString = Object.prototype.toString;
var MouseEvents = ["click", "mousedown", "mousemove", "mouseup", "dblclick"];

var Utils = {
	/**
	* extend
	*/
	extend: function(obj) {
		var args = arguments,
			_obj, i, n;
		for (i = 0; i < args.length; i++) {
			_obj = args[i];
			for (n in _obj) {
				if (_obj.hasOwnProperty(n)) {
					obj[n] = _obj[n];
				}
			}
		}
		return obj;
	},

	inherit: function(obj, parent) {
		var _temp = function() {};
		_temp.prototype = parent.prototype;
		obj.prototype = new _temp();
	},

	isArray: function(arr) {
		if (objToString.call(arr) === "[object Array]") {
			return true;
		}
	},

	isFunction: function(fn) {
		if (objToString.call(fn) === "[object Function]") {
			return true;
		}
	},

	getArgs: function(args, start, end) {
		var i = 0, _args = [];
		start = start || 0;
		end = end || args.length;
		start = Math.max(0, start);
		end = Math.min(args.length, end);
		for (i = start; i < end; i++) {
			_args.push(args[i]);
		}
		return _args;
	}
}