/**
*Button
*/

var arrows = {
	"00": "nw-resize",
	"01": "n-resize",
	"02": "ne-resize",
	"10": "w-resize",
	"12": "e-resize",
	"20": "sw-resize",
	"21": "s-resize",
	"22": "se-resize"
}

function Crop(option) {
	option = Utils.extend({
		text: "裁剪框",
		value: 0,
		_type: "crop",
		width: 200,
		height: 200,
		x: 0,
		y: 0,
		maxWidth: 200,
		maxHeight: 200,
		minX: 0,
		minY: 0

	}, option);

	function _checkCropLimit(crop, property, value) {
		var x, y, minX, minY, maxWidth, maxHeight;

		switch (property) {
			case "x":
				value = Math.max(value, option.minX);
				break;
			case "y":
				value = Math.max(value, option.minY);
				break;
			case "width":
				x = option.x;
				minX = option.minX;
				maxWidth = option.maxWidth;
				if (x + value > minX + maxWidth) {
					value = minX + maxWidth - x;
				}
				break;
			case "height":
				y = option.y;
				minY = option.minY;
				maxHeight = option.maxHeight;
				if (y + value > minY + maxHeight) {
					value = minY + maxHeight - y;
				}
		}

		return value;
	}

	option.x = _checkCropLimit(this, "x", option.x);
	option.y = _checkCropLimit(this, "y", option.y);
	option.width = _checkCropLimit(this, "width", option.width);
	option.height = _checkCropLimit(this, "height", option.height);

	Control.call(this, option);

	this.currentAnchor = null;

	this.on("drag", function(event) {
		var directions = this.currentAnchor.split("");
		var width = this.get("width");
		var height = this.get("height");
		var x = this.get("x");
		var y = this.get("y");

		switch (directions[0]) {
			case "0":
				this.set("y", y + event.deltaY);
				this.set("height", height - event.deltaY);
				break;
			case "1":
				this.set("y", y + event.deltaY);
				break;
			case "2":
				this.set("height", height + event.deltaY);
				break;
		}

		switch (directions[1]) {
			case "0":
				this.set("x", x + event.deltaX);
				this.set("width", width - event.deltaX);
				break;
			case "1":
				this.set("x", x + event.deltaX);
				break;
			case "2":
				this.set("width", width + event.deltaX);
				break;
		}
	});
}

Utils.inherit(Crop, Control);
Utils.extend(Crop.prototype, {
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
		
		ctx.lineWidth = 1.0;
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

		ctx.strokeRect(x, y, width, height);

		var hStep = width / 2;
		var vStep = height / 2;
		ctx.fillStyle = anchorFillColor;
		ctx.strokeStyle = anchorBorderColor;
		for (var h = 0; h < 3; h++) {
			for (var v = 0; v < 3; v++) {
				if (h === 1 && v === 1) {
					continue;
				}
				ctx.beginPath();
				ctx.arc(x + h * hStep, y + v * vStep, 8, 0, Math.PI * 2);
				ctx.fill();
				ctx.arc(x + h * hStep, y + v * vStep, 8, 0, Math.PI * 2);
				ctx.stroke();
				ctx.closePath();
			};
		};
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

		var hStep = width / 2;
		var vStep = height / 2;
		var arcX = 0;
		var arcY = 0;
		var currentAnchor;
		var isOverBlank = false;

		for (var v = 0; v < 3; v++) {
			for (var h = 0; h < 3; h++) {
				if (h === 1 && v === 1) {
					continue;
				}
				arcX = hStep * h;
				arcY = vStep * v;
				if (Math.pow(x - arcX, 2) + Math.pow(y - arcY, 2) <= 64) {
					currentAnchor = v + "" + h;
					break;
				}
			};
			if (currentAnchor) {
				break;
			}
		};
		if (x >= 0 && x <= width && y >= 0 && y <= height ) {
			isOverBlank = true;
		}

		if (currentAnchor || isOverBlank) {
			if (this.get("disabled")) {
				this.set("cursor", "not-allowed");
			} else if (currentAnchor) {
				this.set("cursor", arrows[currentAnchor]);
				this.currentAnchor = currentAnchor;
			} else {
				this.set("cursor", "move");
				this.currentAnchor = "11";
			}
			return true;
		}

		return false;
	},

	setLimit: function(limit) {
		var properties = ["x", "y", "width", "height"];

		for (var n in limit) {
			this.set(n, limit[n]);
		}

		for (var i = 0; i < 4; i++) {
			this.set(properties[i], this.get(properties[i]));
		};

	}
});
function createCrop(option) {
	return new Crop(option);
}

var _cropSet = Crop.prototype.set;
Crop.prototype.set = function(property, value) {
	value = checkCropLimit(this, property, value);
	_cropSet.call(this, property, value);
}

function checkCropLimit(crop, property, value) {
	var x, y, minX, minY, maxWidth, maxHeight,
		width, height;

	switch (property) {
		case "x":
			value = Math.max(value, crop.get("minX"));
			minX = crop.get("minX");
			maxWidth = crop.get("maxWidth");
			width = crop.get("height");
			if (value + width > minX + maxWidth) {
				value = minX + maxWidth - width;
			}
			break;
		case "y":
			value = Math.max(value, crop.get("minY"));
			minY = crop.get("minY");
			maxHeight = crop.get("maxHeight");
			height = crop.get("height");
			if (value + height > minY + maxHeight) {
				value = minY + maxHeight - height;
			}
			break;
		case "width":
			x = crop.get("x");
			minX = crop.get("minX");
			maxWidth = crop.get("maxWidth");
			if (x + value > minX + maxWidth) {
				value = minX + maxWidth - x;
			}
			break;
		case "height":
			y = crop.get("y");
			minY = crop.get("minY");
			maxHeight = crop.get("maxHeight");
			if (y + value > minY + maxHeight) {
				value = minY + maxHeight - y;
			}
	}

	return value;
}
