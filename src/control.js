/**
* BaseControl
* events: 
*	change:propery
*		newValue, prevValue
*	add:property
*		newValue
* methods:
	set
		property, value
	get
		property
	add
		property, [value]
*/

function Control(option) {
	Event.call(this);
	this.__properties = {
		parent: null,
		width: 100,
		height: 50,
		x: 0,
		y: 0,
		visible: true,
		disabled: false,
		state: "default", // default, over, down, drag
		cursor: "default"
	}
	Utils.extend(this.__properties, option);
}

Utils.inherit(Control, Event);
Utils.extend(Control.prototype, {
	bubble: function(event, data) {
		var parent = this.get("parent"),
			res = true;
		if (data.target) {
			res = this.doListen(event, data);
		} else {
			data.target = this;
		}

		if (parent && res !== false) {
			parent.bubble(event, data);
		}
	},
	// set property
	set: function(property, value) {
		var _prevValue, evt,
			_properties = this.__properties;

		if (!_properties.hasOwnProperty(property)) {
			this.add(property, value);
		} else {
			_prevValue = this.get(property);
			if (value !== _prevValue) {
				_properties[property] = value;
				evt = {
					type: "change:" + property,
					value: value,
					prev: _prevValue
				};

				this.trigger("change:" + property, evt);
				this.bubble("change:" + property, evt);
			}
		}
	},

	//get property
	get: function(property) {
		var _properties = this.__properties;
		return _properties[property] === undefined ? null : _properties[property];
	},

	// add propery
	add: function(property, value) {
		var evt,
			_properties = this.__properties;

		if (_properties.hasOwnProperty(property)) {
			this.set(property, value);
		} else {
			_properties[property] = value;
			evt = {
				type: "add:" + property,
				value: value
			}
			this.trigger("add:" + property, evt);
			this.bubble("add:" + property, evt);
		}
	},

	// show
	show: function() {
		this.set("visible", true);
	},
	hide: function() {
		this.set("visible", false);
	},
	enable: function() {
		this.set("disabled", false);
	},
	disable: function() {
		this.set("disabled", true);
	},
	isCover: function(x, y) {
		var width, height, _x, _y;

		if (!this.get("visible")) {
			return;
		}
		width = this.get("width");
		height = this.get("height");
		_x = this.get("x");
		_y = this.get("y");
		x -=  _x;
		y -= _y;
		if (x >= 0 && x <= width && y >= 0 && y<= height) {
			if (this.get("disabled")) {
				this.set("cursor", "not-allowed");
			} else {
				this.set("cursor", "pointer");
			}
			this.set("state", "over");
			return true;
		}
		return false;
	},
	draw: function(ctx) {
		var width = this.get("width");
		var height = this.get("height");
		var x = this.get("x");
		var y = this.get("y");

		ctx.save();
		ctx.strokeStyle = "#000";
		ctx.beginPath();
		ctx.strokeRect(x, y, width, height);
		ctx.closePath();
		ctx.restore();
	}
});

var _trigger = Control.prototype.trigger;
Control.prototype.trigger = function(event, data) {
	if (this.get("disabled")) {
		return;
	}
	data.target = this;
	_trigger.call(this, data.type, data);
}
