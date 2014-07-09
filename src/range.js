/**
*Button
*/

function Range(option) {
	option = Utils.extend({
		text: "滑块",
		value: 0,
		_type: "range",
		showRuler: true
	}, option);

	Control.call(this, option);

	this.on("click", function(event) {
		var y, value;

		if (this.get("state") === "anchorOver") {
			return;
		}
		y = event.pointerX - this.get("x");
		value = y / this.get("width");
		this.set("value", value);
	});

	this.on("drag", function(event) {
		var value = this.get("value") + event.deltaX / this.get("width");
		this.set("value", value);
	});

	this.on("change:value", function() {
	});
}

Utils.inherit(Range, Control);
Utils.extend(Range.prototype, {
	draw: function(ctx) {
		var width, height, x, y, state, value, disabled,
			fillColor, borderColor, rulerColor,
			anchorBorderColor, anchorFillColor,
			barHeight, barPositionY,
			anchorWidth, anchorPositionX, anchorArrowHeight;

		if (!this.get("visible")) {
			return false;
		}

		width = this.get("width");
		height = this.get("height");
		x = this.get("x");
		y = this.get("y");
		state = this.get("state");
		disabled = this.get("disabled");
		value = this.get("value");

		barHeight = height * 0.2;
		barPositionY = (height - barHeight) / 2;

		anchorWidth = width * 0.07;
		anchorArrowHeight = barPositionY * 0.5;
		anchorPositionX = width * value;

		ctx.save();
		
		ctx.lineWidth = "1.0";
		fillColor = "#ccc";
		anchorBorderColor = "#3a9bfd";
		anchorFillColor = "#f4f4f4";
		rulerColor = "#000103";

		if (disabled) {
			anchorFillColor = fillColor = "#f4f4f4";
			anchorBorderColor = borderColor = "#adb2b5";
			rulerColor = "#838383";
		} else if (state === "anchorOver") {
			anchorFillColor = ctx.createLinearGradient(x, y, x, height + y);
			anchorFillColor.addColorStop(0, "#eaf4fc");
			anchorFillColor.addColorStop(1, "#dcedfc");
		} else {
			anchorFillColor = ctx.createLinearGradient(x, y, x, height + y);
			anchorFillColor.addColorStop(0, "#eef1f1");
			anchorFillColor.addColorStop(1, "#e8e8e8");
			anchorBorderColor = "#bbb";
		}

		ctx.strokeStyle = ctx.fillStyle = fillColor;
		ctx.fillRect(x, y + barPositionY, width, barHeight);
		ctx.strokeRect(x, y + barPositionY, width, barHeight);

		var rulerStep = width / 5;
		ctx.strokeStyle = rulerColor;
		for (var i = 0; i < 6; i++) {
			ctx.beginPath();
			ctx.moveTo(x + i * rulerStep, y + height -anchorArrowHeight);
			ctx.lineTo(x + i * rulerStep, y + height);
			ctx.closePath();
			ctx.stroke();
		};

		ctx.beginPath();
		ctx.moveTo(x + anchorPositionX - anchorWidth / 2, y);
		ctx.lineTo(x + anchorPositionX + anchorWidth / 2, y);
		ctx.lineTo(x + anchorPositionX + anchorWidth / 2, y + height - anchorArrowHeight);
		ctx.lineTo(x + anchorPositionX, y + height);
		ctx.lineTo(x + anchorPositionX - anchorWidth / 2, y + height - anchorArrowHeight);
		ctx.lineTo(x + anchorPositionX - anchorWidth / 2, y);
		ctx.closePath();
		ctx.fillStyle = anchorFillColor;
		ctx.fill();


		ctx.beginPath();
		ctx.moveTo(x + anchorPositionX - anchorWidth / 2, y);
		ctx.lineTo(x + anchorPositionX + anchorWidth / 2, y);
		ctx.lineTo(x + anchorPositionX + anchorWidth / 2, y + height - anchorArrowHeight);
		ctx.lineTo(x + anchorPositionX, y + height);
		ctx.lineTo(x + anchorPositionX - anchorWidth / 2, y + height - anchorArrowHeight);
		ctx.lineTo(x + anchorPositionX - anchorWidth / 2, y);
		ctx.closePath();
		ctx.strokeStyle = anchorBorderColor;
		ctx.stroke();

		ctx.restore();
	},

	isCover: function(x, y) {
		var width, height, _x, _y,
			value, positionY,
			left, right,
			anchorWidth;

		if (!this.get("visible")) {
			return;
		}
		width = this.get("width");
		height = this.get("height");
		_x = this.get("x");
		_y = this.get("y");
		value = this.get("value");
		positionY = width * value;
		anchorWidth = width * 0.07;
		x -=  _x;
		y -= _y;
		left = Math.min(0, positionY - anchorWidth / 2);
		right = Math.max(width, positionY + anchorWidth / 2);

		if (x >= left && x <= right && y >= 0 && y<= height) {
			if (this.get("disabled")) {
				this.set("cursor", "not-allowed");
			} else {
				this.set("cursor", "pointer");
			}

			if (x >= positionY - anchorWidth && x <= positionY + anchorWidth) {
				this.set("state", "anchorOver");
			} else {
				this.set("state", "over");
			}
			
			return true;
		}
		return false;
	}
});

var _set = Range.prototype.set;
var _add = Range.prototype.add;
Range.prototype.set = function(property, value) {
	if (value < 0) {
		value = 0;
	} else if (value > 1) {
		value = 1;
	}
	_set.call(this, property, value);
}
Range.prototype.add = function(property, value) {
	if (value !== undefined) {
		if (value < 0) {
			value = 0;
		} else if (value > 1) {
			value = 1;
		}
	}
	_add.call(this, property, value);
}
function createRange(option) {
	return new Range(option);
}