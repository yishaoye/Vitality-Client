

var STStrategyOne = require( 'samples/standardTetris/js/stStrategyOne.js' );

var STStrategyManager = module.exports = {};

var mListpSTStrategy = [];		// 策略列表
var mCurrentStrategyName = '';	// 当前策略名字

/**
 * 添加策略
 *
 * @memberOf  STStrategyManager
 */
STStrategyManager.addStrategy = function( pStrategy ){

	for( var key in mListpSTStrategy )
	{
		if( pStrategy.getStrategyName() === mListpSTStrategy[ key ].getStrategyName() )
		{
			return;
		}
	}

	mListpSTStrategy.push( pStrategy );
};

/**
 * 初始化策略系统
 *
 * @memberOf  STStrategyManager
 */
STStrategyManager.initialize = function( ){			
	STStrategyManager.addStrategy( new STStrategyOne() );
//	STStrategyManager.addStrategy( new STStrategyRogerLLimaLaurentBercotSebastienBlondeelOnePiece1996() );
//	STStrategyManager.addStrategy( new STStrategyUserDefined() );
//	STStrategyManager.addStrategy( new STStrategyColinFaheyTwoPiece2003() );
};

/**
 * 获取通用策略
 *
 * @memberOf  STStrategyManager
 */
STStrategyManager.getCurrentStrategy = function( ){
       
	var n = 0;
	n = mListpSTStrategy.length;

	if (n <= 0)
	{
		return( 0 );
	}

	var i = 0;
	for ( i = 0; i < n; i++ )
	{
		var pStrategy = mListpSTStrategy[i];

		if (pStrategy.getStrategyName() === mCurrentStrategyName)
		{
			return( pStrategy );
		}
	}

	// 如果策略列表中没有指定策略的话.我们使用列表中第一个策略
	var pStrategyDefault = mListpSTStrategy[0];

	mCurrentStrategyName = pStrategyDefault.getStrategyName();

	return( pStrategyDefault );
};

/**
 * 获取最优移动方案
 *
 * @memberOf  STStrategyManager
 */
STStrategyManager.getBestMoveOncePerPiece = function(currentBoard, currentPiece, 
												nextPieceFlag, nextPieceShape, 
												results ){

	var pStrategy = STStrategyManager.getCurrentStrategy();

	if ( pStrategy )
	{
		pStrategy.getBestMoveOncePerPiece
		(
			currentBoard,
			currentPiece,
			nextPieceFlag, // 0 == no next piece available or known
			nextPieceShape, // 0 == no piece available or known
			results
		);
	}
};


