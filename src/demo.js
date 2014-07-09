// test demo

//比较slice与自定义方法转换arguments的性能
function test() {
	var i = 100;
	var slice = Array.prototype.slice;
	console.time("slice");
		while(i--) {
			slice.call(arguments);
		}
	console.timeEnd("slice");
	i = 100;
	console.time("custom");
		while(i--) {
			args(arguments);
		}
	console.timeEnd("custom");
}