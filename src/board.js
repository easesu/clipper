/**
*Button
*/


function Board(option) {
	option = Utils.extend({
		text: "画板",
		value: "",
		_type: "board",
		width: 200,
		height: 200,
		x: 0,
		y: 0,
		scale: 1,
		maxScale: 1
	}, option);

	Control.call(this, option);

	if (option.value) {
		this.loadImage({src: option.value});
	}
}

Utils.inherit(Board, Control);
Utils.extend(Board.prototype, {
	draw: function(ctx) {
		var width, height, x, y, image,
			scale, maxScale,
			rows, cols,
			color,
			darkColor = "#fff",
			lightColor = "#ccc";


		if (!this.get("visible")) {
			return false;
		}

		width = this.get("width");
		height = this.get("height");
		x = this.get("x");
		y = this.get("y");
		image = this.get("value");
		scale = this.get("scale");
		maxScale = this.get("maxScale");
		rows = Math.ceil(height / 10);
		cols = Math.ceil(width / 10);

		ctx.save();
		color = darkColor;
		for (var i = 0; i < rows; i++) {
			color = color === darkColor ? lightColor : darkColor;
			for (var h = 0; h < cols; h++) {
				ctx.strokeStyle = ctx.fillStyle = color;
				ctx.beginPath();
				ctx.fillRect(x + h * 10, y + i * 10, 10, 10);
				ctx.strokeRect(x + h * 10, y + i * 10, 10, 10);
				ctx.closePath();
				color = color === darkColor ? lightColor : darkColor;
			};
		};

		if (image && typeof image !== "string") {
			var imageWidth = image.width * scale * maxScale;
			var imageHeight = image.height * scale * maxScale;
			var dx = (width - imageWidth) / 2;
			var dy = (height - imageHeight) / 2;
			ctx.drawImage(image, x + dx, y + dy, imageWidth, imageHeight);
		}

		ctx.restore();
	},

	isCover: function(x, y) {
		return false;
	},

	loadImage: function(image) {
		var _image;
		var _this = this;
		var scale = _this.get("scale");
		var width = _this.get("width");
		var height = _this.get("height");

		if (typeof image === "string") {
			_image = new Image();
			_image.addEventListener("load", function() {
				_this.set("value", _image);
				_this.set("maxScale", checkBoardMaxScale(_image, width, height));
			}, false);
			
			_image.src = image;
		} else {
			_image = image;
			_this.set("value", _image);
			_this.set("maxScale", checkBoardMaxScale(_image, width, height));
		}
	},

	getImagePosition: function() {
		var image = this.get("value");
		var imageWidth = image.width;
		var imageHeight = image.height;
		var scale = this.get("scale") * this.get("maxScale");
		var width = this.get("width");
		var height = this.get("height");

		imageWidth = imageWidth * scale;
		imageHeight = imageHeight * scale;

		return {
			x: (width - imageWidth) / 2 + this.get("x"),
			y: (height - imageHeight) / 2 + this.get("y"),
			width: imageWidth,
			height: imageHeight
		}
	}
});


var _boardSet = Board.prototype.set;
Board.prototype.set = function(property, value) {
	if (property === "scale") {
		if (value < 0) {
			value = 0;
		} else if (value > 1) {
			value = 1;
		}
	}
	_boardSet.call(this, property, value);
}


function checkBoardMaxScale(image, width, height) {
	var imageWidth = image.width;
	var imageHeight = image.height;
	return Math.min(width / imageWidth, height / imageHeight);
}

function createBoard(option) {
	return new Board(option);
}

