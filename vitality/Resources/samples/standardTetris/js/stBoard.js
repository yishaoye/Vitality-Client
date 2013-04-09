

var STPiece = require( 'samples/standardTetris/js/stPiece.js' );

/**
 * 底层累积元素
 *
 * @memberOf  STBoard
 */
var STBoard = function(){

	this.mWidth = 0;			// 底板的宽度
	this.mHeight = 0;			// 底板的高度
	this.m_pcells = [];			// 地板上渲染的原色
	this.mPieceSpawnX = 0;		// 图形出生点
	this.mPieceSpawnY = 0;
	this.m_pSprites = [];		// 渲染图片
	this.setBoardDimensions( 10, 20 );
};

module.exports = STBoard;

/**
 * 设置对应的gameObject
 *
 * @memberOf  STBoard
 */
STBoard.prototype.setObject = function( object ){

	this.gameObject = object;
};

/**
 * 是否有效
 *
 * @memberOf  STBoard
 */
STBoard.prototype.IsValid = function(){
	if (this.mWidth  <= 0) {
		return 0;
	}
	if (this.mHeight <= 0) {
		return 0;
	}
	if (!this.m_pcells) {
		return 0;
	}
	return 1;
};

/**
 * 获取宽度
 *
 * @memberOf  STBoard
 */
STBoard.prototype.getWidth = function(){

	return this.mWidth;
};

/**
 * 获取高度
 *
 * @memberOf  STBoard
 */
STBoard.prototype.getHeight = function(){

	return this.mHeight;
};

/**
 * 获取
 *
 * @memberOf  STBoard
 */
STBoard.prototype.getPieceSpawnX = function(){

	return this.mPieceSpawnX;
};

/**
 * 获取
 *
 * @memberOf  STBoard
 */
STBoard.prototype.getPieceSpawnY = function(){

	return this.mPieceSpawnY;
};

/**
 * 获取总大小
 *
 * @memberOf  STBoard
 */
STBoard.prototype.getTotalCells = function(){

	return this.mWidth * this.mHeight;
};

/**
 * 获取索引
 *
 * @memberOf  STBoard
 */
STBoard.prototype.getCellIndex = function( x, y ){

	// Return (-1) for all invalid cases.
	if (this.mWidth  <=  0) 
	{
		return(-1);
	}

	if (this.mHeight <=  0)
	{
		return(-1);
	}

	if (!this.m_pcells)
	{
		return(-1);
	}

	if (x < 1)         
	{
		return(-1);
	}

	if (x > this.mWidth)         
	{
		return(-1);
	}

	if (y < 1)         
	{
		return(-1);
	}

	if (y > this.mHeight)        
	{
		return(-1);
	}

	// All values okay
	return( (this.mWidth * (y-1)) + (x-1) );
};

/**
 * 销毁缓存
 *
 * @memberOf  STBoard
 */
STBoard.prototype.destroyBuffer = function(){

	this.mWidth = 0;      
	this.mHeight = 0;     
	this.m_pcells = [];   
	this.mPieceSpawnX = 0;
	this.mPieceSpawnY = 0;
};

/**
 * 设置面板尺寸
 *
 * @memberOf  STBoard
 */
STBoard.prototype.setBoardDimensions = function( width, height ){

	this.destroyBuffer();
	if (this.width  <= 0) 
	{
		return;
	}
	if (this.height <= 0) 
	{
		return;
	}

	var totalCells = 0;
	totalCells = (width * height);

	// Commit to member variables
	this.mWidth       = width;
	this.mHeight      = height;
	this.m_pcells     = new Array( totalCells );
	this.mPieceSpawnX = (1 + Math.floor(width/2));
	this.mPieceSpawnY = height;
	for ( var i = 0; i < totalCells; ++i )
	{
		this.m_pcells[ i ] = 0;
	}
};


/**
 * 清空面板元素
 *
 * @memberOf  STBoard
 */
STBoard.prototype.clearCells = function(){
	if (0 == this.IsValid())  
	{
		return;
	}
	for ( var i = 0; i < this.getTotalCells(); ++i )
	{
		this.m_pcells[ i ] = 0;
	}
    if( this.gameObject )
	{
		for( var key in this.m_pSprites )
		{
			this.gameObject.deleteSprite( this.m_pSprites[ key ] );
		}
		this.m_pSprites = [];
	}
};

/**
 * 获取单个元素
 *
 * @memberOf  STBoard
 */
STBoard.prototype.getCell = function( x, y ){
	if (0 == this.IsValid())
	{
		return( 0 );
	}

	if (x > this.mWidth )
	{
		return( 0 );
	}
	if (y > this.mHeight)
	{
		return( 0 );
	}

	var index = 0;
	index = this.getCellIndex( x, y );

	if (index <  0)
	{
		return( 0 ); // Outside the board is emptiness!
	}

	if (index >= this.getTotalCells())
	{
		return( 0 ); // Outside the board is emptiness!
	}

	return( this.m_pcells[ index ] );

};


/**
 * 设置单个元素
 *
 * @memberOf  STBoard
 */
STBoard.prototype.setCell = function( x, y, value ){

	if (0 == this.IsValid())
	{  
		return;
	}

	if (x > this.mWidth )
	{
		return;
	}

	if (y > this.mHeight) 
	{
		return;
	}

	var index = 0;
	index = this.getCellIndex( x, y );

	if (index <  0) 
	{
		return; // Outside the board is emptiness!
	}

	if (index >= this.getTotalCells()) 
	{
		return; // Outside the board is emptiness!
	}

	this.m_pcells[ index ] = value;
    if( this.gameObject )
    {
        if( this.m_pcells[ index ] && !this.m_pSprites[ index ] )
        {
            var opt = {};
            opt.x = x * 38;
            opt.y = y * 38;
            this.m_pSprites[ index ] = this.gameObject.addNewSprite( opt );
        }
        else if( !this.m_pcells[ index ] && this.m_pSprites[ index ] )
        {
            this.gameObject.deleteSprite( this.m_pSprites[ index ] );
            this.m_pSprites[ index ] = null;
        }
    }
};



/**
 * 拷贝数据
 *
 * @memberOf  STBoard
 */
STBoard.prototype.copyFromBoard = function( board ){

    if( (0  ==  this.IsValid() ) || (this.mWidth  != board.mWidth ) || (this.mHeight != board.mHeight) )
    {
        this.destroyBuffer();
        this.setBoardDimensions( board.mWidth, board.mHeight );
    }

	this.mWidth = board.mWidth;      
	this.mHeight = board.mHeight;     
	this.m_pcells = [];   
	this.mPieceSpawnX = board.mPieceSpawnX;
	this.mPieceSpawnY = board.mPieceSpawnY;	
    for ( var i = 0; i < board.getTotalCells(); ++i )
	{
		this.m_pcells[ i ] = board.m_pcells[ i ];
	}
};


/**
 * 检测是否可以消除元素
 *
 * @memberOf  STBoard
 */
STBoard.prototype.collapseAnyCompletedRows = function(){
	// Check board
	if (0 == this.IsValid())  
	{
		return( 0 );
	}


	var totalRowsCollapsed = 0;

	// 从底部开始扫描每一行的元素
	// 如果任何行完全填满了, 在消除这行后上面的所有行向下补充
	// 需要注意的是, 如果我们消除了一行后, 再次检测同一行
	for ( var y = 1; y < this.mHeight; y++ ) // bottom-to-top (except top row)
	{
		// 检测这行是否排满
		var rowIsFull = 1;
		for ( var x = 1; ((x <= this.mWidth) && (0 != rowIsFull)); x++ )
		{
			var cellValue = this.getCell( x, y );
			if (0 == cellValue)  {
				rowIsFull = 0;
			}
		}


		// 如果这行排满了. 我们就消除一行.上面的向下移动一行
		if (0 != rowIsFull)
		{
			totalRowsCollapsed++; // 统计完成了一行

			var copySourceX = 0;
			var copySourceY = 0;

			for( copySourceY = (y + 1); copySourceY <= this.mHeight; copySourceY++ )
			{
				for ( copySourceX = 1; copySourceX <= this.mWidth; copySourceX++ )
				{
					var cellValue = this.getCell( copySourceX, copySourceY );
					this.setCell( copySourceX, (copySourceY - 1),  cellValue );
				}
			}

			// 清除最顶层一行
			for ( copySourceX = 1; copySourceX <= this.mWidth; copySourceX++ )
			{
				this.setCell( copySourceX, this.mHeight, 0 );
			}

			y--; // 重新检测这一行
		}

	}

	return( totalRowsCollapsed );
};

/**
 * 随机生成元素
 *
 * @memberOf  STBoard
 */
STBoard.prototype.randomCells = function(){

	if (0 == this.IsValid())  
	{
		return;
	}

	var n = 0;
	var i = 0;
	n = this.getTotalCells();
	for ( i = 0; i < n; i++ )
	{
		m_pcells[ i ] = parseInt((Math.random()*100) % 8); // {0==EMPTY, {1..7}==PIECE}
	}
};

/**
 * 清理一行元素
 *
 * @memberOf  STBoard
 */
STBoard.prototype.clearRow = function( y ){

	if (0 == this.IsValid())  
	{
		return;
	}

	var x = 0;
	for ( x = 1; x <= this.mWidth; x++ )
	{
		this.setCell( x, y, 0 );
	}
};

/**
 * 向上抬起一行.并随机产生垃圾元素
 *
 * @memberOf  STBoard
 */
STBoard.prototype.liftPileByOneRowAndAddRandomJunk = function(){
	// 首先, 自上而下的太高一行
	var cell = 0;
	var x = 0;
	var y = 0;
	for ( y = this.mHeight; y > 1; y-- )  // Top-down
	{
		// 拷贝 (y-1)行 到 y行; 依此类推
		for ( x = 1; x <= this.mWidth; x++ )
		{
			cell = this.getCell( x, (y-1) );
			this.setCell( x, y, cell );
		}
	}
	// 随机添加垃圾到最底层一行.
	for ( x = 1; x <= this.mWidth; x++ )
	{
		cell = 0; // 0==EMPTY
		if ( parseInt((Math.random()*100) % 3) )  {
			cell = 8; // 8==JUNK CELL
		}
		this.setCell( x,  1,  cell );
	}
};

/**
 * 文字图案填充底座
 *
 * @memberOf  STBoard
 */
STBoard.prototype.fillBoardWithTestPattern = function( patternIndex ){

	if (0 == this.IsValid())  
	{
		return;
	}

	var x         = 0;
	var y         = 0;
	var value     = 0;
	var maxHeight = 0;


	var state = patternIndex;

	maxHeight = (1 + (patternIndex % this.mHeight));

	for ( y = 1; y <= maxHeight; y++ )
	{
		for ( x = 1; x <= this.mWidth; x++ )
		{
			value = 0;

			if ((patternIndex >> ((x - 1) % 8)) & 0x1)
			{ 
				value = 8;
			}

			if ((patternIndex >> ((y - 1) % 8)) & 0x1) 
			{
				value = (8 - value);
			}

			this.setCell( x, y, value );
		}
	}

	for ( y = (maxHeight+1); y <= this.mHeight; y++ )
	{
		for ( x = 1; x <= this.mWidth; x++ )
		{
			this.setCell( x, y, 0 );
		}
	}
};

/**
 * 统计占领元素总数
 *
 * @memberOf  STBoard
 */
STBoard.prototype.totalOccupiedCells = function(){

	if (0 == this.IsValid())  
	{
		return( 0 );
	}

	var totalOccupiedCells = 0;

	var n = 0;
	n = this.getTotalCells();

	var i = 0;
	for ( i = 0; i < n; i++ )
	{
		if (0 != this.m_pcells[ i ])  
		{
			totalOccupiedCells++;
		}
	}

	return( totalOccupiedCells );
};

/**
 * 统计空缺元素行数
 *
 * @memberOf  STBoard
 */
STBoard.prototype.totalShadowedHoles = function(){
	if (0 == this.IsValid())  
	{
		return( 0 );
	}

	var totalShadowedHoles = 0;

	// For each column we search top-down through the rows,
	// noting the first occupied cell, and counting any unoccupied cells after that point...
	var x = 0;
	for ( x = 1; x <= this.mWidth; x++ )
	{
		var encounteredOccupiedCell = 0;
		var y = 0;
		for ( y = this.mHeight; y >= 1; y-- ) // Top-to-Bottom
		{
			var cellValue = 0;
			cellValue = this.getCell( x, y );

			if (0 != cellValue)
			{
				encounteredOccupiedCell = 1;
			}
			else
			{
				// Cell is un-occupied...
				if (0 != encounteredOccupiedCell)
				{
					// ...and we already encountered an occupied cell above,
					// so this counts as a hole.
					totalShadowedHoles++;
				}
			}
		}
	}

	return( totalShadowedHoles );
};

/**
 * 堆积最大行数
 *
 * @memberOf  STBoard
 */
STBoard.prototype.pileMaxHeight = function(){

	if (0 == this.IsValid())  
	{
		return( 0 );
	}

	var x = 0;
	var y = 0;

	// 自顶向下的搜索非空元素
	for ( y = this.mHeight; y >= 1; y-- )
	{
		for ( x = 1; x <= this.mWidth; x++ )
		{
			var cellValue = 0;
			cellValue = this.getCell( x, y );
			if (0 != cellValue)  
			{
				return( y );
			}
		}
	}

	return( 0 ); // 整个底座是空的
};

/**
 * 
 *
 * @memberOf  STBoard
 */
STBoard.prototype.pileHeightWeightedCells = function(){
			
	if (0 == this.IsValid())  
	{
		return( 0 );
	}

	var x = 0;
	var y = 0;

	var totalWeightedCells = 0;

	for ( y = 1; y <= this.mHeight; y++ )
	{
		for ( x = 1; x <= this.mWidth; x++ )
		{
			var cellValue = 0;
			cellValue = this.getCell( x, y );
			if (0 != cellValue)  
			{
				totalWeightedCells += y;
			}
		}
	}

	return( totalWeightedCells );
};

/**
 * 获取这一纵列高度
 *
 * @memberOf  STBoard
 */
STBoard.prototype.getColumnHeight = function( x ){

	if (0 == this.IsValid())  
	{
		return( 0 );
	}

	if (x <= 0) 
	{
		return( 0 );
	}

	if (x > this.mWidth)
	{
		return( 0 );
	}

	// Top-Down Search for first occupied cell
	var y = 0;
	for ( y = this.mHeight; y >= 1; y-- ) // top-down search
	{
		var cellValue = this.getCell( x, y );
		if (0 != cellValue)
		{
			return( y );
		}
	}
	return( 0 );
};

/**
 * 高度之和
 *
 * @memberOf  STBoard
 */
STBoard.prototype.sumOfWellHeights = function(){

	if (0 == this.IsValid())
	{
		return( 0 );
	}

	var  sumOfWellHeights    = 0;
	var  columnHeight        = 0;
	var  columnHeightToLeft  = 0;
	var  columnHeightToRight = 0;

	// Determine height of LEFT  well
	columnHeight        = this.getColumnHeight( 1 );
	columnHeightToRight = this.getColumnHeight( 2 );
	if (columnHeightToRight > columnHeight)
	{
		sumOfWellHeights += (columnHeightToRight - columnHeight);
	}

	// Determine height of RIGHT well
	columnHeightToLeft = this.getColumnHeight( this.mWidth - 1 );
	columnHeight       = this.getColumnHeight( this.mWidth     );
	if (columnHeightToLeft > columnHeight)
	{
		sumOfWellHeights += (columnHeightToLeft - columnHeight);
	}


	// Now do all interior columns, 1..8, which have TWO
	// adjacent lines...
	var x = 0;
	for ( x = 2; x <= (this.mWidth - 1); x++ )
	{
		columnHeightToLeft  = this.getColumnHeight( x - 1 );
		columnHeight        = this.getColumnHeight( x     );
		columnHeightToRight = this.getColumnHeight( x + 1 );

		if (columnHeightToLeft > columnHeightToRight)
		{
			columnHeightToLeft = columnHeightToRight;
		}
		else
		{
			columnHeightToRight = columnHeightToLeft;
		}

		if (columnHeightToLeft > columnHeight)
		{
			sumOfWellHeights += (columnHeightToLeft - columnHeight);
		}
	}

	return( sumOfWellHeights );

};

/**
 * 获取完整的行数
 *
 * @memberOf  STBoard
 */
STBoard.prototype.getTotalCompletedRows = function(){

	if (0 == this.IsValid())  
	{
		return( 0 );
	}

	var totalCompletedRows = 0;

	var x = 0;
	var y = 0;

	// Check each row
	for ( y = 1; y <= this.mHeight; y++ )
	{
		// Check if this row is full.
		var rowIsFull = 1; // Hypothesis
		for ( x = 1; ( (x <= this.mWidth) && (0 != rowIsFull) ); x++ )
		{
			var cellValue = 0;
			cellValue = this.getCell( x, y );
			if (0 == cellValue)  
			{
				rowIsFull = 0;
			}
		}

		if (0 != rowIsFull) 
		{
			totalCompletedRows++;
		}
	}

	return( totalCompletedRows );
};

/**
 * 
 *
 * @memberOf  STBoard
 */
STBoard.prototype.getTransitionCountForRow = function( y ){

	if (0 == this.IsValid())  
	{
		return( 0 );
	}

	var transitionCount = 0;

	var x     = 0;
	var flagA = 0;
	var flagB = 0;

	// Check cell and neighbor to right...
	for ( x = 1; x < this.mWidth; x++ )
	{
		flagA = this.getCell( x , y );
		flagB = this.getCell( (x + 1), y );

		// If a transition from occupied to unoccupied, or
		// from unoccupied to occupied, then it's a transition.
		if 
			( 
			((0 != flagA) && (0 == flagB)) ||
			((0 == flagA) && (0 != flagB)) 
			)
		{
			transitionCount++;
		}
	}

	// Check transition between left-exterior and column 1.
	// (NOTE: Exterior is implicitly "occupied".)
	flagA = this.getCell( 1, y );
	if (0 == flagA) 
	{
		transitionCount++;
	}

	// Check transition between column 'mWidth' and right-exterior.
	// (NOTE: Exterior is implicitly "occupied".)
	flagA = this.getCell( this.mWidth, y );
	if (0 == flagA) 
	{
		transitionCount++;
	}

	return( transitionCount );
};

/**
 * 
 *
 * @memberOf  STBoard
 */
STBoard.prototype.getTransitionCountForColumn = function( x ){

	if (0 == this.IsValid())  
	{
		return( 0 );
	}

	var transitionCount = 0;

	var y     = 0;
	var flagA = 0;
	var flagB = 0;

	// Check cell and neighbor above...
	for ( y = 1; y < this.mHeight; y++ )
	{
		flagA = this.getCell( x, y     );
		flagB = this.getCell( x, y + 1 );
		// If a transition from occupied to unoccupied, or
		// from unoccupied to occupied, it's a transition.
		if 
			( 
			((0 != flagA) && (0 == flagB)) ||
			((0 == flagA) && (0 != flagB)) 
			)
		{
			transitionCount++;
		}
	}

	// Check transition between bottom-exterior and row Y=1.
	// (NOTE: Bottom exterior is implicitly "occupied".)
	flagA = this.getCell( x, 1 );
	if (0 == flagA) 
	{
		transitionCount++;
	}

	// Check transition between column 'mHeight' and above-exterior.
	// (NOTE: Sky above is implicitly UN-"occupied".)
	flagA = this.getCell( x, this.mHeight );
	if (0 != flagA) 
	{
		transitionCount++;
	}

	return( transitionCount );
};

/**
 * 
 *
 * @memberOf  STBoard
 */
STBoard.prototype.getBuriedHolesForColumn = function( x ){

	if (0 == this.IsValid())  
	{
		return( 0 );
	}

	var totalHoles = 0;
	var cell   = 0;
	var enable = 0;
	var y      = 0;

	for ( y = this.mHeight; y >= 1; y-- )
	{
		cell = this.getCell( x, y );

		if (0 != cell)
		{
			enable = 1;
		}
		else
		{
			if (0 != enable)
			{
				totalHoles++;
			}
		}
	}

	return( totalHoles );
};

/**
 * 
 *
 * @memberOf  STBoard
 */
STBoard.prototype.getBlanksDownBeforeBlockedForColumn = function( x, topY ){

	if (0 == this.IsValid())  
	{
		return( 0 );
	}

	var totalBlanksBeforeBlocked = 0;
	var cell = 0;
	var y = 0;

	for ( y = topY; y >= 1; y-- )
	{
		cell = this.getCell( x, y );

		if (0 != cell)
		{
			return( totalBlanksBeforeBlocked );
		}
		else
		{
			totalBlanksBeforeBlocked++;
		}
	}

	return( totalBlanksBeforeBlocked );
};

/**
 * 
 *
 * @memberOf  STBoard
 */
STBoard.prototype.getAllWellsForColumn = function( x ){

	if (0 == this.IsValid())
	{
		return( 0 );
	}

	var wellValue  = 0;
	var y          = 0;
	var cellLeft   = 0;
	var cellRight  = 0;
	var blanksDown = 0;

	for ( y = this.mHeight; y >= 1; y-- )
	{
		if ((x-1) >= 1)
		{
			cellLeft  = this.getCell( (x - 1), y );
		}
		else
		{
			cellLeft = 1;
		}

		if ((x + 1) <= this.mWidth)
		{
			cellRight = this.getCell( (x + 1), y );
		}
		else
		{
			cellRight = 1;
		}

		if ((0 != cellLeft) && (0 != cellRight))
		{
			blanksDown = this.getBlanksDownBeforeBlockedForColumn( x, y );
			wellValue += blanksDown;
		}
	}

	return( wellValue );
};


/**
 * 是否可以接受
 *
 * @memberOf  STBoard
 */
STBoard.prototype.IsGoalAcceptable = function( piece ){

	if (0 == this.IsValid()) 
	{
		return( 0 );
	}

	// If piece kind or orientation is invalid, goal is not acceptable.
	if (0 == piece.IsValid()) 
	{
		return( 0 );
	}

	// Fast check: If piece origin lies outside board, goal is not acceptable.
	if (piece.getX() < 1) 
	{
		return( 0 );
	}

	if (piece.getY() < 1) 
	{
		return( 0 );
	}

	if (piece.getX() > this.getWidth()) 
	{
		return( 0 );
	}

	if (piece.getY() > this.getHeight()) 
	{
		return( 0 );
	}

	// Consider the absolute position of all points of the piece.
	// If any of the points lie outside the board, goal is not acceptable.
	// If any of the points coincide with an occupied cell of the board,
	//  the goal is not acceptable.
	var point       = 0;
	var totalPoints = 0;
	var absoluteX   = 0;
	var absoluteY   = 0;
	totalPoints = STPiece.getTotalPoints();
	for ( point = 1; point <= totalPoints; point++ )
	{
		absoluteX = piece.getAbsolutePointX( point );
		absoluteY = piece.getAbsolutePointY( point );
		// Absolute point must be in the board area
		if (absoluteX < 1) 
		{
			return( 0 );
		}

		if (absoluteX > this.getWidth ())
		{
			return( 0 );
		}

		if (absoluteY < 1)
		{
			return( 0 );
		}

		if (absoluteY > this.getHeight()) 
		{
			return( 0 );
		}

		// Absolute point cannot overlap an occupied cell of the board.
		if (0 != this.getCell( absoluteX, absoluteY ))
		{
			return( 0 );
		}
	}

	// If we made it to this point, the goal is acceptable.
	return( 1 );
};

/**
 * 
 *
 * @memberOf  STBoard
 */
STBoard.prototype.determineAccessibleTranslationsForPieceOrientation = function( piece, results ){
	
	// Clear Results.
	results.ref_movePossible = 0;
	results.ref_minDeltaX    = 0;
	results.ref_maxDeltaX    = 0;


	if (0 == this.IsValid()) 
	{
		return;
	}

	if (0 == piece.IsValid()) 
	{
		return;
	}


	var width  = 0;
	var height = 0;
	width  = this.getWidth();
	height = this.getHeight();


	var temp_Piece = new STPiece();
	var moveAcceptable = 0;
	var trialTranslationDelta = 0;


	// Check if we can move at all.
	moveAcceptable = this.IsGoalAcceptable( piece );
	if (0 != moveAcceptable)
	{
		results.ref_movePossible = 1;
	}
	else
	{
		return;
	}



	// Scan from center to left to find left limit.
	var stillAcceptable = 1;
	for( trialTranslationDelta = 0;( (trialTranslationDelta >= (-(width))) && (stillAcceptable) );trialTranslationDelta-- )
	{
		// Copy piece to temp and translate
		temp_Piece.copyFromPiece( piece );
		temp_Piece.translate( trialTranslationDelta, 0 );

		moveAcceptable =this.IsGoalAcceptable( temp_Piece );
		if (0 != moveAcceptable)
		{
			results.ref_minDeltaX = trialTranslationDelta;
		}
		else
		{
			stillAcceptable = 0;
		}
	}


	// Scan from center to right to find right limit.
	stillAcceptable = 1;
	for( trialTranslationDelta = 0;( (trialTranslationDelta <= width) && (stillAcceptable) );trialTranslationDelta++ )
	{
		// Copy piece to temp and translate
		temp_Piece.copyFromPiece( piece );
		temp_Piece.translate( trialTranslationDelta, 0 );

		moveAcceptable = this.IsGoalAcceptable( temp_Piece );
		if (0 != moveAcceptable)
		{
			results.ref_maxDeltaX = trialTranslationDelta;
		}
		else
		{
			stillAcceptable = 0;
		}
	}
};

/**
 * 
 *
 * @memberOf  STBoard
 */
STBoard.prototype.addPieceToBoard = function( piece ){

	if (0 == this.IsValid()) 
	{
		return;
	}

	// If piece kind or orientation is invalid, adding is not acceptable.
	if (0 == piece.IsValid())
	{
		return;
	}

	// Fast check: If piece origin lies outside board, adding is not acceptable.
	if (piece.getX() < 1) 
	{
		return;
	}

	if (piece.getY() < 1) 
	{
		return;
	}

	if (piece.getX() > this.getWidth ()) 
	{
		return;
	}

	if (piece.getY() > this.getHeight()) 
	{
		return;
	}

	// Consider the absolute position of all points of the piece, and set the
	// corresponding cells on the board.
	var point       = 0;
	var totalPoints = 0;
	var absoluteX   = 0;
	var absoluteY   = 0;
	totalPoints = STPiece.getTotalPoints();
	for ( point = 1; point <= totalPoints; point++ )
	{
		absoluteX = piece.getAbsolutePointX( point );
		absoluteY = piece.getAbsolutePointY( point );
		// Set absolute position on the board.
		// (NOTE: Board will silently discard points with invalid (x,y).)
		this.setCell( absoluteX, absoluteY, piece.getKind() );
	}
};

/**
 * 
 *
 * @memberOf  STBoard
 */
STBoard.prototype.dropPieceButBoardUnchanged = function( piece ){

	if (0 == this.IsValid())
	{
		return;
	}

	if (0 == piece.IsValid())
	{
		return;
	}


	// Special case: Cannot place piece at starting location.
	var goalAcceptable = 0;

	goalAcceptable = this.IsGoalAcceptable( piece );

	if (0 == goalAcceptable)
	{
		// No dropping at all!
		return;
	}


	// 使用一个临时变量尝试出最大移动距离
	var boardHeight      = 0;
	var lastSuccessfulDropDistance = 0;
	var firstFailureEncountered    = 0;
	var trialDropDistance          = 0;

	boardHeight = this.getHeight();

	var temp_Piece = new STPiece();
	temp_Piece.copyFromPiece( piece );

	for( trialDropDistance = 0;( (0 == firstFailureEncountered) && (trialDropDistance <= boardHeight) );trialDropDistance++ )
	{
		// 设置临时的元素块Y轴向下移动, 找到停靠点
		temp_Piece.setY( piece.getY() - trialDropDistance );

		goalAcceptable = this.IsGoalAcceptable( temp_Piece );

		if (0 == goalAcceptable)
		{
			// 在这个点上失败, 停止向下搜索
			firstFailureEncountered = 1;
		}
		else
		{
			lastSuccessfulDropDistance = trialDropDistance;
		}
	}
	
	// 更新当前元素的Y轴
	piece.setY( piece.getY() - lastSuccessfulDropDistance );
};
/**
 * 
 *
 * @memberOf  STBoard
 */
STBoard.prototype.countPieceCellsEliminated = function( piece ){

	if (0 == this.IsValid())
	{
		return( 0 );
	}

	if (0 == piece.IsValid())
	{
		return( 0 );
	}


	// Copy piece and board so that this measurement is not destructive.
	var boardCopy = new STBoard();
	var PieceCopy = new STPiece();
	boardCopy.copyFromBoard( this );
	PieceCopy.copyFromPiece( piece );

	// Drop piece on to the board copy
	boardCopy.fullDropAndAddPieceToBoard( PieceCopy );

	// Scan rows.  For each completed row, check all absolute Y values for the
	// piece.  If any absolute Y of the piece matches the completed row Y,
	// increment the total eliminated cells.
	var pieceCellsEliminated = 0;

	var y  = 0;
	var x  = 0;
	var rowCompleted = 0;
	var totalPoints  = 0;
	var point        = 0;
	var pointY       = 0;
	var width        = 0;
	var height       = 0;
	var cell         = 0;

	width  = boardCopy.getWidth();
	height = boardCopy.getHeight();

	totalPoints = STPiece.getTotalPoints();

	for ( y = 1; y <= height; y++ )
	{

		rowCompleted = 1; // Hypothesis

		for ( x = 1; ((x <= width) && (0 != rowCompleted)); x++ )
		{
			cell = boardCopy.getCell( x, y );
			if (0 == cell) 
			{
				rowCompleted = 0;     
			}
		}

		if (0 != rowCompleted)
		{
			// Find any matching absolute Y values in piece.
			for ( point = 1; point <= totalPoints; point++ )
			{
				pointY = piece.getAbsolutePointY( point );
				if (pointY == y)  
				{
					pieceCellsEliminated++;  // Moohahahaaa!
				}
			}
		}
	}

	return( pieceCellsEliminated );
};
/**
 * 
 *
 * @memberOf  STBoard
 */
STBoard.prototype.fullDropAndAddPieceToBoard = function( piece ){

	if (0 == this.IsValid())
	{
		return;
	}

	if (0 == piece.IsValid())
	{
		return;
	}

	// Drop piece as far as it will go.  A drop of zero distance is possible.
	this.dropPieceButBoardUnchanged( piece );

	// Simply add the piece to the board.
	this.addPieceToBoard( piece );
};
































