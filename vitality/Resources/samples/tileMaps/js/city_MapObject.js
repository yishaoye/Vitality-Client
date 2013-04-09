

var mapObject = module.exports = {};

/**
 * Object初始化
 * 
 * @memberOf mapObject
 */
mapObject.init = function( opts ){

};

/**
 * Object循环
 * 
 * @memberOf mapObject
 */
mapObject.update = function( dt ){

};


/**
 * 拖动事件响应
 * 
 * @memberOf mapObject
 */
mapObject.onTouchesMoved = function(touches, event) {
	//log( 'onTouchesMoved' );
	// 地图移动
	var touch = touches[0];
	var delta = touch.getDelta();
	var node = this.map;
	var diff = cc.pAdd(delta, node.getPosition());
	this.onMapMoved( diff );
};

/**
 * 按下事件响应
 * 
 * @memberOf mapObject
 */
mapObject.onTouchesBegan = function(touches, event) {
	//log( 'onTouchesBegan' );

};

/**
 * 抬起事件响应
 * 
 * @memberOf mapObject
 */
mapObject.onTouchesEnded = function(touches, event) {
	//log( 'onTouchesEnded' );

};

mapObject.buttonDown = function( widget ){
	log( 'button Down' );
};