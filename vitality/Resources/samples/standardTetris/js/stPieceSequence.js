


/**
 * 元素序列表
 *
 * @memberOf  STPieceSequence
 */
var STPieceSequence = function(){

	this.mPieceSelectionSource = 0;		// 元素产生类型

	this.mCachedSelectedPieceShapeCurrent = 0;	// 缓存当前元素
	this.mCachedSelectedPieceShapeNext = 0;		// 缓存下一个元素
};

module.exports = STPieceSequence;

/**
 * 获取当前元素
 *
 * @memberOf  STPieceSequence
 */
STPieceSequence.prototype.clientPeekSelectedPieceCurrent = function( ){

	return this.mCachedSelectedPieceShapeCurrent;
};



/**
 * 获取下一个元素
 *
 * @memberOf  STPieceSequence
 */
STPieceSequence.prototype.clientPeekSelectedPieceNext = function( ){

	return this.mCachedSelectedPieceShapeNext;
};

/**
 * 更新数据
 *
 * @memberOf  STPieceSequence
 */
STPieceSequence.prototype.clientRequestSelectionUpdate = function( ){

	this.mCachedSelectedPieceShapeCurrent = 0;
	this.mCachedSelectedPieceShapeNext = 0;

//	switch( this.mPieceSelectionSource )
//	{
//	case STPieceSelectionSourceRandom:
//		{
			this.privateAdvanceRandom( );
//		}
//		break;
//
//	case STPieceSelectionSourceAlternatingSAndZ:
//		{
//			this.privateAdvanceAlternatingSZ( );
//		}
//		break;
//
//	case STPieceSelectionSourceQueue:
//		{
//			this.privateAdvanceQueue( );
//		}
//		break;
//
//	default:
//		{
//		}
//		break;
//	}
};


/**
 * 随机产生数据
 *
 * @memberOf  STPieceSequence
 */
STPieceSequence.prototype.privateAdvanceRandom = function( ){

	var pieceShapeIndexCurrent = 0;
	pieceShapeIndexCurrent = parseInt((Math.random()*100) % 7) + 1;

	var pieceShapeIndexNext = 0;
	pieceShapeIndexNext = parseInt((Math.random()*100) % 7) + 1;


	// 设置当前和下一个状态的数据
	this.mCachedSelectedPieceShapeCurrent = pieceShapeIndexCurrent;

	this.mCachedSelectedPieceShapeNext = pieceShapeIndexNext;
};






