

var STGameState = require( 'samples/standardTetris/js/stGameState.js' );
var STBoard = require( 'samples/standardTetris/js/stBoard.js' );
var STPiece = require( 'samples/standardTetris/js/stPiece.js' );
var STStrategyManager = require( 'samples/standardTetris/js/stStrategyManager.js' );

/**
 * 游戏逻辑
 *
 * @memberOf  STGame
 */
var STGame = function(){
    // 创建游戏数据
	this.mGameState = new STGameState();
    // 初始化策略管理器
    STStrategyManager.initialize();

};

module.exports = STGame;

/**
 *  设置底板对应的GameObject
 *
 * @memberOf  STGame
 */
STGame.prototype.setObject = function( object ){

	this.mGameState.mSTBoardCurrent.setObject( object );
	this.mGameState.mSTPieceCurrent.setObject( object );
};

/**
 * 左移
 * @memberOf  STGame
 */
STGame.prototype.inputEvent_Left = function( ){

	this.privateTranslatePiece( -1 );
};

/**
 * 右移
 *
 * @memberOf  STGame
 */
STGame.prototype.inputEvent_Right = function( ){

	this.privateTranslatePiece( 1 );
};

/**
 * 变换形状
 *
 * @memberOf  STGame
 */
STGame.prototype.inputEvent_Rotate = function( ){

	this.privateRotatePiece();
};

/**
 * 下落
 *
 * @memberOf  STGame
 */
STGame.prototype.inputEvent_Drop = function( ){

	this.privateDropPiece();
};

/**
 * 重新开始
 *
 * @memberOf  STGame
 */
STGame.prototype.inputEvent_Reset = function( ){

    this.privateGameReset();
}

/**
 * 开启AI
 *
 * @memberOf  STGame
 */
STGame.prototype.inputEvent_AIStart = function( ){

    this.mGameState.mAI = 1;
    this.clearAllStatistics();
    this.inputEvent_Reset(); // Starting AI should start clean
};

/**
 * 关闭AI
 *
 * @memberOf  STGame
 */
STGame.prototype.inputEvent_AIStop = function( ){

    this.mGameState.mAI = 0;
    this.clearAllStatistics();
    this.inputEvent_Reset(); // Stopping AI should stop clean
};

/**
 * 清空所有统计信息
 *
 * @memberOf  STGame
 */
STGame.prototype.clearAllStatistics = function( ){

    this.clearHistoricRowsHistogram();

    var i = 0;
    var n = 0;
    n =   8; 
    for ( i = 0; i < n; i++ ) 
    {
        this.mGameState.mPieceHistogram [i] = 0;
    }
    n = 200; 
    for ( i = 0; i < n; i++ ) 
    {
        this.mGameState.mHeightHistogram[i] = 0;
    }
    n =  20; 
    for ( i = 0; i < n; i++ )
    {
        this.mGameState.mHistoricRows[i]    = 0;
    }
    this.mGameState.mTotalElapsedTimeSeconds = 0.0;
    this.mGameState.mHistoricHighScore      = 0;
    this.mGameState.mHistoricHighRows       = 0;
    this.mGameState.mHistoricHighPieces     = 0;
    this.mGameState.mHistoricCumulativeRows = 0;
    this.mGameState.mHistoricTotalGames     = 0;
};

/**
 * 清空统计高度历史记录
 *
 * @memberOf  STGame
 */
STGame.prototype.clearHistoricRowsHistogram = function( ){
   
    var i = 0;
    var n = 0;
    n = 20;
    for ( i = 0; i < n; i++ )
    {
        this.mGameState.mHistoricRows[i] = 0;
    }
}


/**
 * 重置游戏所有元素
 *
 * @memberOf  STGame
 */
STGame.prototype.privateGameReset = function( ){

    var i = 0;
    var n = 0;

    // Game Reset does NOT clobber all parts of the game object!
    // For example, the following are not cleared:
    //   (1) Paused flag;
    //   (2) Historical statistics;
    // However, the following are cleared, for example:
    //   (1) Current board;
    //   (2) Current piece;
    //   (3) Rows Completed;
    //   (4) Score;
    //   (5) Game-Over flag;
    // And the following values are initialized:
    //   (1) Iteration countdown time;


    this.mGameState.mSTBoardCurrent.clearCells();
    this.mGameState.mSTPieceCurrent.clear();


    this.mGameState.mGameOver              = 0;
    this.mGameState.mIterationCountdownSeconds = 0.05;
    this.mGameState.mCurrentPiecePointValue    = 0; // Starts at 24+(3*level)
    this.mGameState.mCompletedRows             = 0;

    // Piece sequence generator
    // Reset queue (even if we aren't using it now)
    //this.mGameState.mSTPieceSequence.ServerQueueReset();
    //SeedPieceSequenceGeneratorWithCurrentTime( );

    // UNCHANGED: mGameState.mPaused;
    // UNCHANGED: mGameState.mShowNextPiece;
    // UNCHANGED: mGameState.mAI;
    // UNCHANGED: mGameState.mSpawnFromVideoCapture;
    // UNCHANGED: mGameState.mOutputToRS232;
    // UNCHANGED: mGameState.mAutoRestart;
    // UNCHANGED: mGameState.mGameSpeedAdjustment;

    this.mGameState.mTotalElapsedTimeSeconds = 0.0;
    n =   8;  
    for ( i = 0; i < n; i++ )
    { 
        this.mGameState.mPieceHistogram [ i ] = 0;
    }

    n = 200;  
    for ( i = 0; i < n; i++ ) 
    {
        this.mGameState.mHeightHistogram[ i ] = 0;
    }

    this.mGameState.mScore = 0;

    // Only updated when game ends
    // UNCHANGED: mGameState.mHistoricHighScore;
    // UNCHANGED: mGameState.mHistoricHighRows;
    // UNCHANGED: mGameState.mHistoricHighPieces;
    // UNCHANGED: mGameState.mHistoricCumulativeRows;
    // UNCHANGED: mGameState.mHistoricTotalGames;

    // Move Animation
    // UNCHANGED: mGameState.mAnimateAIMovesEnable;
    this.mGameState.mAnimateAIMovesStartingY          = 0;
    this.mGameState.mAnimateAIMovesFinalSafeY         = 0;
    this.mGameState.mAnimateAITotalInitialCommands    = 0;
    this.mGameState.mAnimateAICommandsExecuted        = 0;
    this.mGameState.mAnimateAICommandsPerRow          = 0.0;
    this.mGameState.mAnimateAIMovesPendingRotation    = 0;
    this.mGameState.mAnimateAIMovesPendingTranslation = 0;
};

/**
 * 移动元素块位置
 *
 * @memberOf  STGame
 */
STGame.prototype.privateTranslatePiece = function( horizontalDirectionSign ){
	
	if (0 == this.mGameState.mSTBoardCurrent.IsValid()){
		return;
	}
	if (0 == this.mGameState.mSTPieceCurrent.IsValid()){ 
		return;
	}

	// 拷贝当前元素块, 对其进行移动. 检测一下是否可以移动
	var temp_Piece = new STPiece();
	temp_Piece.copyFromPiece( this.mGameState.mSTPieceCurrent );
	if (horizontalDirectionSign < 0)
		temp_Piece.translate( -1, 0 );
	else
		temp_Piece.translate(  1, 0 );

	var okayToTranslate = 0;
	okayToTranslate = this.mGameState.mSTBoardCurrent.IsGoalAcceptable( temp_Piece );

	if (0 != okayToTranslate)
	{
		// 调动可以接受, 调动实际的元素块
		if (horizontalDirectionSign < 0)
			this.mGameState.mSTPieceCurrent.translate( -1, 0 );
		else
			this.mGameState.mSTPieceCurrent.translate(  1, 0 );
	}
};


/**
 * 产生一个新的元素
 *
 * @memberOf  STGame
 */
STGame.prototype.privateSpawnPiece = function( ){

	// 不论走到哪一步都清除当前移动元素
	this.mGameState.mSTPieceCurrent.clear();
	this.mGameState.mSTPieceNext.clear();
	this.mGameState.mCurrentPiecePointValue  = 0;
	// 清除最佳移动元素
	this.mGameState.mSTPieceBestMove.clear();


	// 游戏结束
	if (this.mGameState.mGameOver)
	{
		return;
	}


	// The ONLY source of the next piece is the piece sequence object.
	// It is possible that the "next piece" and even the current piece
	// are currently unavailable.  If the information is not available,
	// we should leave the current piece cleared, which will force the
	// spawning code to continue attempting to spawn.
	var currentKind = 0;
	var nextKind    = 0;
	currentKind = this.mGameState.mSTPieceSequence.clientPeekSelectedPieceCurrent();
	nextKind    = this.mGameState.mSTPieceSequence.clientPeekSelectedPieceNext();
	this.mGameState.mSTPieceSequence.clientRequestSelectionUpdate();


	if ((nextKind >= 1) && (nextKind <= 7))
	{
		// 设置下一个元素块
		this.mGameState.mSTPieceNext.setKind( nextKind );
		this.mGameState.mSTPieceNext.setX( 0 ); // NOTE: Not used
		this.mGameState.mSTPieceNext.setY( 0 ); // NOTE: Not used
		this.mGameState.mSTPieceNext.setOrientation( 1 ); // NOTE: Not used
	}

	if ((currentKind < 1) || (currentKind > 7))
	{
		// No current piece means we should leave and allow this function to
		// be called in the future.
		return;
	}

	// 设置当前元素块
	this.mGameState.mSTPieceCurrent.setKind( currentKind );
	this.mGameState.mSTPieceCurrent.setX( this.mGameState.mSTBoardCurrent.getPieceSpawnX() );
	this.mGameState.mSTPieceCurrent.setY( this.mGameState.mSTBoardCurrent.getPieceSpawnY() );
	this.mGameState.mSTPieceCurrent.setOrientation( 1 );

	// 设置当前元素积分值
	this.mGameState.mCurrentPiecePointValue = 
		24 + (3 * this.getCurrentLevel());

	this.mGameState.mPieceHistogram[ currentKind ]++; // Update histogram


	// 如果当前产生的元素不可以堆放, 结束游戏
	var okayToSpawn = 0;

	okayToSpawn = this.mGameState.mSTBoardCurrent.IsGoalAcceptable(	this.mGameState.mSTPieceCurrent );

	if (0 == okayToSpawn)
	{
		log( ' GAME OVER!' );
		// ********************** GAME OVER! **************************
		this.mGameState.mGameOver = 1;
		// Update historical statistics
		if (this.mGameState.mScore         > this.mGameState.mHistoricHighScore){
			this.mGameState.mHistoricHighScore = this.mGameState.mScore;
		}
		if (this.mGameState.mCompletedRows > this.mGameState.mHistoricHighRows){
			this.mGameState.mHistoricHighRows  = this.mGameState.mCompletedRows;
		}
		var totalPieces = 0;
		totalPieces = this.getPieceHistogramSum();
		if (totalPieces > this.mGameState.mHistoricHighPieces)
			this.mGameState.mHistoricHighPieces = totalPieces;
		this.mGameState.mHistoricCumulativeRows += this.mGameState.mCompletedRows; // Used for average: rows/games
		this.mGameState.mHistoricTotalGames++;
		var i = 0;
		var n = 20;
		for ( i = (n-1); i >= 1; i-- )
		{
			this.mGameState.mHistoricRows[i] = this.mGameState.mHistoricRows[i-1];
		}
		this.mGameState.mHistoricRows[0] = this.mGameState.mCompletedRows;
	}
	else
	{
		// 缓存当前最好的选择
		this.privateUpdateBestMovePiece( );
	}

};

/**
 * 旋转元素块方向
 *
 * @memberOf  STGame
 */
STGame.prototype.privateRotatePiece = function( ){
	
	if (0 == this.mGameState.mSTBoardCurrent.IsValid()){
		return;
	}
	if (0 == this.mGameState.mSTPieceCurrent.IsValid()){ 
		return;
	}

	// 拷贝当前元素块,对其进行变换, 检测一下是否可以变换
	var temp_Piece = new STPiece();
	temp_Piece.copyFromPiece( this.mGameState.mSTPieceCurrent );
	temp_Piece.rotate();

	var okayToRotate = 0;
	okayToRotate = this.mGameState.mSTBoardCurrent.IsGoalAcceptable( temp_Piece );

	if (0 != okayToRotate)
	{
		// 旋转可以接受, 旋转实际的元素块
		this.mGameState.mSTPieceCurrent.rotate();
	}
};


/**
 * 坠落元素块
 *
 * @memberOf  STGame
 */
STGame.prototype.privateDropPiece = function( ){

	if (0 == this.mGameState.mSTBoardCurrent.IsValid()){
		return;
	}
	if (0 == this.mGameState.mSTPieceCurrent.IsValid()){ 
		return;
	}

	this.mGameState.mScore += this.mGameState.mCurrentPiecePointValue;
	this.mGameState.mCurrentPiecePointValue = 0;

	// 直接坠落到底, 并添加到底座上.
	this.mGameState.mSTBoardCurrent.fullDropAndAddPieceToBoard( this.mGameState.mSTPieceCurrent	);

	// 检测是否有消除行
	this.privateCollapseAnyCompletedRows();

	// 清除当前移动元素块
	this.mGameState.mSTPieceCurrent.clear();

	// 清除最佳移动元素块
	this.mGameState.mSTPieceBestMove.clear();

	// Increment pile height bin
	var resultingPileHeight = 0;
	resultingPileHeight = this.mGameState.mSTBoardCurrent.pileMaxHeight();
	if ((resultingPileHeight >= 0) && (resultingPileHeight < 200))
		this.mGameState.mHeightHistogram[ resultingPileHeight ]++;
};


/**
 * 检测是否可以消除行
 *
 * @memberOf  STGame
 */
STGame.prototype.privateCollapseAnyCompletedRows = function( ){
	
	var totalRowsCollapsed = 0;

	totalRowsCollapsed = this.mGameState.mSTBoardCurrent.collapseAnyCompletedRows();

	if (totalRowsCollapsed > 0)
	{
		// 我们完成了一行或者多行
		this.mGameState.mCompletedRows += totalRowsCollapsed;
	}
};


/**
 * 获取当前等级
 *
 * @memberOf  STGame
 */
STGame.prototype.getCurrentLevel = function( ){
	var currentLevel = parseInt((this.mGameState.mCompletedRows - 1) / 10);
	if (currentLevel < 0) {
		currentLevel = 0;
	}
	if (currentLevel > 9) {
		currentLevel = 9;
	}
	return( currentLevel );    
};

/**
 * 获取类型统计总数
 *
 * @memberOf  STGame
 */
STGame.prototype.getPieceHistogramSum = function( ){
					
	return
		( 
		this.mGameState.mPieceHistogram[ 1 ]  // O
	+ this.mGameState.mPieceHistogram[ 2 ]  // I
	+ this.mGameState.mPieceHistogram[ 3 ]  // S
	+ this.mGameState.mPieceHistogram[ 4 ]  // Z
	+ this.mGameState.mPieceHistogram[ 5 ]  // L
	+ this.mGameState.mPieceHistogram[ 6 ]  // J
	+ this.mGameState.mPieceHistogram[ 7 ]  // T
	);
}

/**
 * 是否显示下一个图案
 *
 * @memberOf  STGame
 */
STGame.prototype.gameIsShowNextPiece = function( ){ 
	
	return( this.mGameState.mShowNextPiece );
};


/**
 * 更新最优选择
 *
 * @memberOf  STGame
 */
STGame.prototype.privateUpdateBestMovePiece = function( ){
	
	// 清空当前数据
	this.mGameState.mSTPieceBestMove.clear();

	if (0 == this.mGameState.mHintMode) {
		return;
	}


	// 初始化一些数据
	this.mGameState.mSTPieceBestMove.setKind( this.mGameState.mSTPieceCurrent.getKind() );
	this.mGameState.mSTPieceBestMove.setX( this.mGameState.mSTBoardCurrent.getPieceSpawnX() );
	this.mGameState.mSTPieceBestMove.setY( this.mGameState.mSTBoardCurrent.getPieceSpawnY() - 1);
	this.mGameState.mSTPieceBestMove.setOrientation( 1 );

    var results = {};
    STStrategyManager.getBestMoveOncePerPiece
        (
        CopyOfCurrentBoard,
        CopyOfCurrentPiece,
        this.mGameState.mShowNextPiece,  // Showing "Next Piece" ?
        this.mGameState.mSTPieceNext.getKind(),     // Next piece kind
        results
        );

    var bestRotationDelta    = results.bestRotationDelta || 0;
    var bestTranslationDelta = results.bestTranslationDelta || 0;

	// 应用元素块
	this.mGameState.mSTPieceBestMove.rotateByCount( bestRotationDelta );
	this.mGameState.mSTPieceBestMove.translate    ( bestTranslationDelta, 0 );
	// 放置元素块
	this.mGameState.mSTBoardCurrent.dropPieceButBoardUnchanged( mGameState.mSTPieceBestMove );
};


/**
 * 更新游戏时间
 *
 * @memberOf  STGame
 */
STGame.prototype.conditionalAdvanceGameTimeByDelta = function( f32_DeltaSeconds ){

	
	if (0 != this.mGameState.mPaused)
	{
		return;
	}

	if (0 != this.mGameState.mGameOver)
	{
		return;
	}

	// 总运行时间
	this.mGameState.mTotalElapsedTimeSeconds   += f32_DeltaSeconds;

	// 剩余倒计时
	this.mGameState.mIterationCountdownSeconds -= f32_DeltaSeconds;
};


/**
 * 获取游戏速度
 *
 * @memberOf  STGame
 */
STGame.prototype.getGameSpeedAdjustment = function(){

	return( this.mGameState.mGameSpeedAdjustment );
};


/**
 * 游戏逻辑循环
 *
 * @memberOf  STGame
 */
STGame.prototype.conditionalAdvanceGameIteration = function( forceMove ){

    // 暂停游戏
	if (0 != this.mGameState.mPaused)
	{
		return;
	}

    // Ai
	if (0 != this.mGameState.mAI)
	{
		this.privateAIProcessing();
	}
//
//	if (0 != this.mGameState.mAutoRestart)
//	{
//		this.privateAutoRestartProcessing();
//	}

    // 游戏结束
	if (0 != this.mGameState.mGameOver)
	{
		return;
	}

	if ((this.mGameState.mIterationCountdownSeconds <= 0.0) || (0 != forceMove))
	{
		// 如果现在没有元素块, 我们生成一个
		if (0 == this.mGameState.mSTPieceCurrent.IsValid())
		{
			// 自动生成一个.
			this.privateSpawnPiece();

			// 重置计时器
			if (0 != this.mGameState.mSTPieceCurrent.IsValid())
			{
				this.mGameState.mIterationCountdownSeconds = this.privateGetCountdownInitialValue();
			}
		}
		else
		{
			// 向下运动元素块.
			this.privateFreeFallPiece();
			// 重置计时器.
			this.mGameState.mIterationCountdownSeconds = this.privateGetCountdownInitialValue();
		}
	}
};


/**
 * 向下移动元素块
 *
 * @memberOf  STGame
 */
STGame.prototype.privateFreeFallPiece = function( ){

	
	if (0 == this.mGameState.mSTBoardCurrent.IsValid()) 
	{
		return;
	}
	if (0 == this.mGameState.mSTPieceCurrent.IsValid())
	{
		return;
	}

	// 拷贝当前元素块, 运行它做测试
	var  temp_Piece = new STPiece();
	temp_Piece.copyFromPiece( this.mGameState.mSTPieceCurrent );
	temp_Piece.translate(  0, -1 );

	var okayToFall = 0;
	okayToFall = this.mGameState.mSTBoardCurrent.IsGoalAcceptable( temp_Piece );

	if (0 != okayToFall)
	{
		// 下降实际元素
		this.mGameState.mSTPieceCurrent.translate( 0, -1 );
		this.mGameState.mCurrentPiecePointValue--;
	}
	else
	{
		// 如果不能运行, 则落到底部了
		this.privateTransferPieceToPile();
	}
};

/**
 * 元素块下落到底部
 *
 * @memberOf  STGame
 */
STGame.prototype.privateTransferPieceToPile = function( ){

	if (0 == this.mGameState.mSTBoardCurrent.IsValid()) 
	{
		return;
	}
	if (0 == this.mGameState.mSTPieceCurrent.IsValid())
	{
		return;
	}

	// 计算积分
	if (this.mGameState.mCurrentPiecePointValue > 0)
	{
		this.mGameState.mScore += this.mGameState.mCurrentPiecePointValue;
	}
	this.mGameState.mCurrentPiecePointValue = 0;

	// 添加当前元素到底座上
	this.mGameState.mSTBoardCurrent.addPieceToBoard( this.mGameState.mSTPieceCurrent	);

	// 检测是否有消除行
	this.privateCollapseAnyCompletedRows();

	// 清除当前移动元素块
	this.mGameState.mSTPieceCurrent.clear();

	// 清除最佳移动元素块
	this.mGameState.mSTPieceBestMove.clear();

	// Increment pile height bin
	var resultingPileHeight = 0;
	resultingPileHeight = this.mGameState.mSTBoardCurrent.pileMaxHeight();
	if ((resultingPileHeight >= 0) && (resultingPileHeight < 200))
	{
		this.mGameState.mHeightHistogram[ resultingPileHeight ]++;
	}
};

/**
 * 获取元素下落时间间隔
 *
 * @memberOf  STGame
 */
STGame.prototype.privateGetCountdownInitialValue = function( ){

	// -2, -3, -4,... : Slow Mode (delay proportional to index)
	// -1 : Normal, Clipped at 0.20 sec/row
	//  0 : Normal
	// +1 : Fast Mode (still render bound)
	// +2 : Very Fast Mode (still render bound)
	// +3, +4, +5,... : Multiple moves per rendered frame

	if (0 == this.mGameState.mGameSpeedAdjustment)
	{
		// Normal Tetris Speed Rule
		return( (10.0 - this.getCurrentLevel()) / 20.0 );
	}

	if ((-1) == this.mGameState.mGameSpeedAdjustment)
	{
		// Normal Tetris Speed Rule, but clamped to 0.20
		var f32_Delay = ( (10.0 - this.getCurrentLevel()) / 20.0 );
		if (f32_Delay < 0.20) f32_Delay = 0.20;
		return( f32_Delay );
	}

	if (this.mGameState.mGameSpeedAdjustment <= (-2))
	{
		// Slowness is proportional to speed adjustment
		var f32_Delay = ((0.5) * (-(this.mGameState.mGameSpeedAdjustment)));
		return( f32_Delay );
	}

	if ((1) == this.mGameState.mGameSpeedAdjustment)
	{
		return( 0.05 ); // Level 9 fastness
	}

	if ((1) == this.mGameState.mGameSpeedAdjustment)
	{
		return( 0.0 ); // Render speed bound
	}

	if (this.mGameState.mGameSpeedAdjustment >= (2))
	{
		// Render speed bound...
		//   ...but main function also does multiple calls for even more speed
		return( 0.0 ); 
	}

	// We should never get here
	return( 0.5 ); 
};

/**
 * AI 逻辑处理
 *
 * @memberOf  STGame
 */
STGame.prototype.privateAIProcessing = function( ){

    if (0 == this.mGameState.mSTBoardCurrent.IsValid()) 
    {
        return;
    }

    if (0 == this.mGameState.mSTPieceCurrent.IsValid())
    {
        return;
    }


    // AI 移动动画
    if (0 != this.privateAIAnimationProcessing())
        return;


    // HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK 
    // For the moment we do the sub-optimal but reliable thing of
    // waiting for the piece to fall to the first row before giving
    // the AI the chance to decide on a best move.  The border of
    // the board will not block rotations.  (It is still possible
    // for the pile to block rotations.)
    if ( this.mGameState.mSTPieceCurrent.getY() != 
        (this.mGameState.mSTBoardCurrent.getHeight()-1) )
    {
        // Unless the piece is exactly one row below the top of the board,
        // just give up on doing the AI.
        return;
    }


    // COPY THE BOARD AND PIECE BEFORE CALLING AI!
    // We don't want AI messing up board or piece under innocent or
    // cheating circumstances.
    var CopyOfCurrentBoard = new STBoard();
    var CopyOfCurrentPiece = new STPiece();

    CopyOfCurrentBoard.copyFromBoard( this.mGameState.mSTBoardCurrent );
    CopyOfCurrentPiece.copyFromPiece( this.mGameState.mSTPieceCurrent );

    var results = {};

    STStrategyManager.getBestMoveOncePerPiece
        (
        CopyOfCurrentBoard,
        CopyOfCurrentPiece,
        this.mGameState.mShowNextPiece,  // Showing "Next Piece" ?
        this.mGameState.mSTPieceNext.getKind(),     // Next piece kind
        results
        );

    var bestRotationDelta    = results.bestRotationDelta || 0;
    var bestTranslationDelta = results.bestTranslationDelta || 0;

    log( 'bestRotationDelta: ' + bestRotationDelta );
    log( 'bestTranslationDelta: ' + bestTranslationDelta );

    if (0 == this.mGameState.mAnimateAIMovesEnable)
    {
        // 旋转
        var rotateCount = 0;
        for ( rotateCount = 0; rotateCount < bestRotationDelta; rotateCount++ )
        {
            this.inputEvent_Rotate();
        }

        // 移动位置
        var translateCount = 0;
        if (bestTranslationDelta < 0)
        {
            for ( translateCount = 0; translateCount > bestTranslationDelta; translateCount-- )
            {
                this.inputEvent_Left();
            }
        }
        if (bestTranslationDelta > 0)
        {
            for ( translateCount = 0; translateCount < bestTranslationDelta; translateCount++ )
            {
                this.inputEvent_Right();
            }
        }

        // 下落
        this.inputEvent_Drop();
    }
    else
    {
        // 设置AI移动轨迹.
        this.mGameState.mAnimateAIMovesPendingRotation    = bestRotationDelta;
        this.mGameState.mAnimateAIMovesPendingTranslation = bestTranslationDelta;

        this.mGameState.mAnimateAITotalInitialCommands = bestRotationDelta;
        if (bestTranslationDelta > 0)
        {
            this.mGameState.mAnimateAITotalInitialCommands += bestTranslationDelta;
        }
        else
        {
            this.mGameState.mAnimateAITotalInitialCommands -= bestTranslationDelta;
        }

        this.mGameState.mAnimateAICommandsExecuted = 0;

        this.mGameState.mAnimateAIMovesStartingY = this.mGameState.mSTPieceCurrent.getY();

        this.mGameState.mAnimateAIMovesFinalSafeY = 
            (this.mGameState.mSTBoardCurrent.pileMaxHeight() + 4); // +3 + paranoia!

        var fallRows = this.mGameState.mAnimateAIMovesStartingY - this.mGameState.mAnimateAIMovesFinalSafeY;

        // Worst-case scenario: Execute all moves now!
        this.mGameState.mAnimateAICommandsPerRow = 1 + this.mGameState.mAnimateAITotalInitialCommands;

        // If we can fall free for some rows, then compute the number of
        // commands per row we must execute, with a slight over-estimate.
        if (fallRows > 0)
        {
            this.mGameState.mAnimateAICommandsPerRow = (1 + this.mGameState.mAnimateAITotalInitialCommands) / fallRows;
        }

        // Attempt processing immediately!
        // REASON: If the game is very fast, there may only be one cycle
        // before the piece falls by one row, which could terminate the
        // game.  Thus, we have to be able to act immediately, as if the
        // animation effect were turned off.  Otherwise, the performance
        // of the AI would depend on whether or not the animation effect
        // was on, which is bad.
        this.privateAIAnimationProcessing();
    }
};


/**
 * AI 动画处理
 *
 * @memberOf  STGame
 */
STGame.prototype.privateAIAnimationProcessing = function( ){

    if (0 == this.mGameState.mAnimateAIMovesEnable)
    {
        return(0);
    }

    if ((0 == this.mGameState.mAnimateAIMovesPendingRotation) &&
        (0 == this.mGameState.mAnimateAIMovesPendingTranslation))
    {
        return(0);
    }


    var currentY = this.mGameState.mSTPieceCurrent.getY();

    // 如果我们已经达到指定y轴指定位置, 强制执行剩余的命令
    if (currentY <= this.mGameState.mAnimateAIMovesFinalSafeY)
    {
        // 执行所有的旋转动作
        while (this.mGameState.mAnimateAIMovesPendingRotation > 0)
        {
            this.inputEvent_Rotate();
            this.mGameState.mAnimateAIMovesPendingRotation--;
            this.mGameState.mAnimateAICommandsExecuted++;
        }
        
        // 执行所有的移动动作
        while (this.mGameState.mAnimateAIMovesPendingTranslation != 0)
        {
            if (this.mGameState.mAnimateAIMovesPendingTranslation < 0)
            {
                this.inputEvent_Left();
                this.mGameState.mAnimateAIMovesPendingTranslation++;
                this.mGameState.mAnimateAICommandsExecuted++;
            }
            else if (this.mGameState.mAnimateAIMovesPendingTranslation > 0)
            {
                this.inputEvent_Right();
                this.mGameState.mAnimateAIMovesPendingTranslation--;
                this.mGameState.mAnimateAICommandsExecuted++;
            }
        }
        return(1);
    }

    // 计算理论数量的命令,我们应该执行到这个时间点。
    var droppedRows = 0;
    droppedRows = this.mGameState.mAnimateAIMovesStartingY - currentY;

    var goalExecutedCommands = this.mGameState.mAnimateAICommandsPerRow * droppedRows;

    // Execute Rotations until either rotations are exhausted, or the total number of executed commands reaches the desired level.
    while ( ((this.mGameState.mAnimateAICommandsExecuted) < (goalExecutedCommands)) &&
        (this.mGameState.mAnimateAIMovesPendingRotation > 0) )
    {
        this.inputEvent_Rotate();
        this.mGameState.mAnimateAIMovesPendingRotation--;
        this.mGameState.mAnimateAICommandsExecuted++;
    }

    while ( ((this.mGameState.mAnimateAICommandsExecuted) < (goalExecutedCommands)) &&
        (this.mGameState.mAnimateAIMovesPendingTranslation != 0) )
    {
        if (this.mGameState.mAnimateAIMovesPendingTranslation < 0)
        {
            this.inputEvent_Left();
            this.mGameState.mAnimateAIMovesPendingTranslation++;
            this.mGameState.mAnimateAICommandsExecuted++;
        }
        else if (this.mGameState.mAnimateAIMovesPendingTranslation > 0)
        {
            this.inputEvent_Right();
            this.mGameState.mAnimateAIMovesPendingTranslation--;
            this.mGameState.mAnimateAICommandsExecuted++;
        }
    }

    return(1);
};

