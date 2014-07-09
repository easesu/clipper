/**
*
*View
*
*/

function View(option) {
	option = Utils.extend({
		controls: [],
		activeControl: null,
		_type: "view"
	}, option);

	Control.call(this, option);

	this.on(MouseEvents, function(event) {
		var control = this.get("activeControl");
		control && control !== this && control.trigger(event.type, event);
	});

	this.on("drag", function(event) {
		var control = this.get("activeControl");
		control && control !== this && control.trigger("drag", event);
	});

	this.on("mousemove", function(event) {
		this.isCover(event.pointerX, event.pointerY);
	});


	this.listen("change:cursor", function(data) {
		if (data.target === this.get("activeControl")) {
			this.set("cursor", data.value);
		}
	});

}

Utils.inherit(View, Control);
Utils.extend(View.prototype, {
	indexOf: function(control) {
		var controls = this.get("controls");
		var index = -1;

		if (!!control) {
			return index;
		}

		for (var i = controls.length - 1; i >= 0; i--) {
			if (controls[i] === control) {
				index = i;
				break;
			}
		};
		return index;
	},
	addControl: function(control) {
		if (this.indexOf(control) === -1) {
			this.get("controls").push(control);
			control.set("parent", this);
		}
	},
	removeControl: function(control) {
		var controls = this.get("controls");
		var index = this.indexOf(control);

		if (index === -1) {
			return false;
		}

		controls.splice(index, 1)[0].set("parent", null);
	},
	isCover: function(x, y) {
		var controls = this.get("controls"),
			i, control;

		for (i = controls.length - 1; i >= 0; i--) {
			control = controls[i];
			if (control.isCover(x, y)) {
				this.set("activeControl", control);
				return true;
			}
		};

		control = this.get("activeControl") || this;
		this.set("activeControl", this);

		control.set("cursor", "default");
		control.set("state", "default");
	},
	draw: function(ctx) {
		this.get("controls").forEach(function(control) {
			control.draw(ctx);
		});
	},
	hide: function() {
		var activeControl = this.get("activeControl");

		if (activeControl) {
			activeControl.set("cursor", "default");
			activeControl.set("state", "default");
			this.set("activeControl", null);
		}
		
		this.set("visible", false);
	}
});


function createView(option) {
	return new View(option);
}
