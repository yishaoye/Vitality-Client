


/**
 * Touches 事件组件.
 * 
 * @memberOf touches
 */
 var touches = module.exports = {};
 
/**
 * 拖动事件响应
 * 
 * @memberOf touches
 */
touches.onTouchesMoved = function(touches, event) {

	if( this.scriptJS )
	{
		if( 'function' === typeof this.scriptJS.onTouchesMoved )
		{
			this.scriptJS.onTouchesMoved.call( this, touches, event );
		}
	}
};

/**
 * 按下事件响应
 * 
 * @memberOf touches
 */
touches.onTouchesBegan = function(touches, event) {

	if( this.scriptJS )
	{
		if( 'function' === typeof this.scriptJS.onTouchesBegan )
		{
			this.scriptJS.onTouchesBegan.call( this, touches, event );
		}
	}
};

/**
 * 抬起事件响应
 * 
 * @memberOf touches
 */
touches.onTouchesEnded = function(touches, event) {

	if( this.scriptJS )
	{
		if( 'function' === typeof this.scriptJS.onTouchesEnded )
		{
			this.scriptJS.onTouchesEnded.call( this, touches, event );
		}
	}
};

/**
 * 取消事件响应
 * 
 * @memberOf touches
 */
touches.onTouchesCancelled = function(touches, event) {

	if( this.scriptJS )
	{
		if( 'function' === typeof this.scriptJS.onTouchesCancelled )
		{
			this.scriptJS.onTouchesCancelled.call( this, touches, event );
		}
	}
};
