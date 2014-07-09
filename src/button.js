/**
*Button
*/

function Button(option) {
	option = Utils.extend({
		value: "按钮",
		_type: "button"
	}, option);

	Control.call(this, option);
}

Utils.inherit(Button, Control);
Utils.extend(Button.prototype, {
	draw: function(ctx) {
		var width, height, x, y, state, disabled,
			fillColor, borderColor, textColor;

		if (!this.get("visible")) {
			return false;
		}

		width = this.get("width");
		height = this.get("height");
		x = this.get("x");
		y = this.get("y");
		state = this.get("state");
		disabled = this.get("disabled");

		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = "1.0";
		
		borderColor = "#3a9bfd";
		textColor = "#000103";
		if (disabled) {
			fillColor = "#f4f4f4";
			borderColor = "#adb2b5";
			textColor = "#838383";
		} else if (state === "over") {
			fillColor = ctx.createLinearGradient(x, y, x, height + y);
			fillColor.addColorStop(0, "#eaf4fc");
			fillColor.addColorStop(1, "#dcedfc");
		} else {
			fillColor = ctx.createLinearGradient(x, y, x, height + y);
			fillColor.addColorStop(0, "#eef1f1");
			fillColor.addColorStop(1, "#e8e8e8");
		}
		ctx.fillStyle = fillColor;
		ctx.fillRect(x, y, width, height);
		ctx.strokeStyle = borderColor;
		ctx.strokeRect(x, y, width, height);
		ctx.font = height * 0.4 + "px Microsoft YaHei";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = textColor;
		ctx.fillText(this.get("value"), x + width / 2, y + height / 2);
		ctx.closePath();
		ctx.restore();
	}
});
function createButton(option) {
	return new Button(option);
}