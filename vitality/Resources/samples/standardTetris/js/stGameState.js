

var STBoard = require( 'samples/standardTetris/js/stBoard.js' );
var STPiece = require( 'samples/standardTetris/js/stPiece.js' );
var STPieceSequence = require( 'samples/standardTetris/js/stPieceSequence.js' );

/**
 * 游戏状态
 *
 * @memberOf  STGameState
 */
var STGameState = function(){


	this.mSTBoardCurrent = new STBoard();	// 当前底座
	this.mSTPieceCurrent = new STPiece();	// 当前移动元素

    this.mAI = 0;                           // 是否启动AI
	this.mPaused = 0;						// 是否暂停
	this.mGameOver = 1;						// 是否结束游戏
	this.mCurrentPiecePointValue = 0;		// 当前元素位置
	this.mCompletedRows = 0;				// 累积消除行数


	this.mSTPieceSequence = new STPieceSequence();// 元素序列表
	
	this.mPieceHistogram = new Array( 8 );	// 类型统计
	this.mHeightHistogram = new Array( 202 ); // 高度直方图
	this.mScore = 0;						// 积分

	this.mHistoricHighScore = 0;			// 历史最高积分
	this.mHistoricHighRows = 0;				// 历史最高行数
	this.mHistoricCumulativeRows = 0;		// 历史累计行数
	this.mHistoricTotalGames = 0;			// 历史游戏次数
	this.mHistoricRows = new Array( 20 );	// 历史行数


	this.mSTPieceNext = new STPiece();		// 下一个移动元素
	this.mSTPieceBestMove = new STPiece();	// 最佳移动元素


	this.mHintMode = 0;						// 提示模式


	this.mShowNextPiece = 0;				// 是否显示下一个图案


	this.mTotalElapsedTimeSeconds = 0;		// 总运行时间
	this.mIterationCountdownSeconds = 0;	// 倒计时时间

	this.mGameSpeedAdjustment = 0;			// 游戏速度


    this.mAnimateAIMovesEnable = 1;          // AI 直接下落
    this.mAnimateAIMovesPendingRotation = 0; // AI 挂起旋转次数
    this.mAnimateAIMovesPendingTranslation=0;// AI 挂起移动距离
    this.mAnimateAIMovesStartingY = 0;
    this.mAnimateAIMovesFinalSafeY = 0;
    this.mAnimateAITotalInitialCommands = 0;
    this.mAnimateAICommandsExecuted = 0;     // AI 已经执行的命令
    this.mAnimateAICommandsPerRow = 0.0;


	this.mOutputToRS232 = 0;
};


module.exports = STGameState;


