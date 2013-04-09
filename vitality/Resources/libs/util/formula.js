var formula = module.exports;


/**
 * 判断两个点之间的距离是否在一个范围内.
 *
 * @param {Object} origin 起始点
 * @param {Object} target 终点
 * @param {Number} range 距离范围
 * @return {Boolean} 结果
 */
formula.inRange = function(origin, target, range) {
  var dx = origin.x - target.x;
  var dy = origin.y - target.y;
  return dx * dx + dy * dy <= range * range;
};

/**
 * 获取两个点之间的距离.
 *
 * @param {Number} x1 y1 起始点
 * @param {Number} x2 y2 终点
 * @return {Number} 距离
 */
formula.distance = function(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;

  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * 转换日期格式为字符串
 * @param {Object} date
 * return {String} format
 */
formula.timeFormat = function(date) {
	var n = date.getFullYear(); 
	var y = date.getMonth() + 1;
	var r = date.getDate(); 
	var mytime = date.toLocaleTimeString(); 
	var mytimes = n+ "-" + y + "-" + r + " " + mytime;
  return mytimes;
};
