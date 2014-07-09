/**
* GlobalWindow
*
*/

function Clipper(canvas) {
	var _this = this,
		draging = false,
		offset = canvas.getBoundingClientRect();
	Event.call(this);
	this.ctx = canvas.getContext("2d");
	this.width = canvas.width;
	this.height = canvas.height;
	this.x = offset.left;
	this.y = offset.top;
	this.views = [];
	this.activeView = null;
	this.ctx.translate(0.5, 0.5);

	/*******/
	this.on(MouseEvents, function(event) {
		if (event.type === "mousemove" && draging) {
			return;
		}
		this.activeView && this.activeView.trigger(event.type, event);
	});

	//drag event
	var _prevX = 0,
		_prevY = 0;
	this.on("mousedown", dragStartHandler);

	function dragStartHandler(event) {
		_prevX = event.clientX;
		_prevY = event.clientY;
		draging = true;
		document.addEventListener("mousemove", dragHandler, false);
		document.addEventListener("mouseup", dragEndHandler, false);
	}

	function dragHandler(event) {
		var deltaX = event.clientX - _prevX;
		var deltaY = event.clientY - _prevY;
		_prevX = event.clientX;
		_prevY = event.clientY;
		_this.activeView && _this.activeView.trigger("drag", {
			target: _this,
			type: "drag",
			deltaX: deltaX,
			deltaY: deltaY
		});

	}

	function dragEndHandler(event) {
		draging = false;
		document.removeEventListener("mousemove", dragHandler, false);
		document.removeEventListener("mouseup", dragEndHandler, false);
	}

	this.listen("change:cursor", function(event) {
		canvas.style.cursor = event.value;
	});
	this.listen("change:visible", function(event) {
		if (event.target.type = "view") {
			if (event.value) {
				this.alterActiveView(null, event.target);
			} else {
				this.alterActiveView();
			}
			
		}
	});
	this.listen(["change:x", "change:y", "change:visible", "change:value", "change:state", "change:width", "change:height"], function() {
		this.draw();
	});

	MouseEvents.forEach(function(event) {
		canvas.addEventListener(event, function(evt) {
			evt.pointerX = evt.clientX - _this.x;
			evt.pointerY = evt.clientY - _this.y;
			_this.trigger(event, evt);
		}, false);
	});
	/*******/
}

Utils.inherit(Clipper, Event);
Utils.extend(Clipper.prototype, {
	draw: function() {
		this.ctx.translate(-0.5, -0.5);
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.translate(0.5, 0.5);
		if (this.activeView) {
			this.activeView.draw(this.ctx);
		}
	},
	bubble: function(event, data) {
		this.doListen(event, data);
	},
	indexOf: function(view) {
		var index = -1,
			views = this.views,
			i;

		if (!view) {
			return index;
		}
		for (i = views.length - 1; i >= 0; i--) {
			if (view === views[i]) {
				index = i;
				break;
			}
		}

		return index;
	},
	addView: function(view) {
		if (!view) {
			return;
		}
		if (this.indexOf(view) === -1) {
			this.views.push(view);
			view.set("parent", this);
		}

	},
	alterActiveView: function(currentView, newView) {
		var index, i, views, view, _view;

		currentView = currentView || this.activeView;

		if (currentView !== this.activeView) {
			return;
		}
		if (newView) {
			this.activeView = newView;
		} else {
			index = this.indexOf(currentView);
			views = this.views;
			_view = null;

			for (i = index + 1; i < views.length; i++) {
				view = views[i];
				if (view.get("visible")) {
					_view = view;
					break;
				}
			}
			this.activeView = _view;
		}

		this.draw();
	}
});