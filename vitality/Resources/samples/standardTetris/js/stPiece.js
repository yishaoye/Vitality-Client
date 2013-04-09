

var STPieceShape = {
		None: 0,
		O : 1,
		I : 2,
		S : 3,
		Z : 4,
		L : 5,
		J : 6,
		T : 7
};

var mPiecesXY_224 =
[
	// Index = 32*(kind-1) + 8*(orientation-1) + 2*(point-1) + (coordinate-1)
	//
	// Where:
	//   kind        = 1, 2, 3, 4, 5, 6, 7  (O,I,S,Z,L,J,T)
	//   orientation = 1, 2, 3, 4           (0,1/4,2/4,3/4-"turn")
	//   point       = 1, 2, 3, 4           (1,2,3,4)
	//   coordinate  = 1, 2                 (X,Y)

	// Piece 1 ("O": Box)
	-1, -1,   0, -1,   0,  0,  -1,  0,  // Orientation 0
	-1, -1,   0, -1,   0,  0,  -1,  0,  // Orientation 1 (redundant)
	-1, -1,   0, -1,   0,  0,  -1,  0,  // Orientation 2 (redundant)
	-1, -1,   0, -1,   0,  0,  -1,  0,  // Orientation 3 (redundant)

	// Piece 2 ("I": Line)
	-2,  0,  -1,  0,   0,  0,   1,  0,  // Orientation 0
	 0, -2,   0, -1,   0,  0,   0,  1,  // Orientation 1
	-2,  0,  -1,  0,   0,  0,   1,  0,  // Orientation 2 (redundant)
	 0, -2,   0, -1,   0,  0,   0,  1,  // Orientation 3 (redundant)

	// Piece 3 ("S": Step Up)
	-1, -1,   0, -1,   0,  0,   1,  0,  // Orientation 0
	 1, -1,   0,  0,   1,  0,   0,  1,  // Orientation 1
	-1, -1,   0, -1,   0,  0,   1,  0,  // Orientation 0 (redundant)
	 1, -1,   0,  0,   1,  0,   0,  1,  // Orientation 1 (redundant)

	// Piece 4 ("Z": Step Down)
	0, -1,   1, -1,  -1,  0,   0,  0,  // Orientation 0
	0, -1,   0,  0,   1,  0,   1,  1,  // Orientation 1
	0, -1,   1, -1,  -1,  0,   0,  0,  // Orientation 2 (redundant)
	0, -1,   0,  0,   1,  0,   1,  1,  // Orientation 3 (redundant)

	// Piece 5 ("L")
	-1, -1,  -1,  0,   0,  0,   1,  0,  // Orientation 0
	 0, -1,   1, -1,   0,  0,   0,  1,  // Orientation 1
	-1,  0,   0,  0,   1,  0,   1,  1,  // Orientation 2
	 0, -1,   0,  0,  -1,  1,   0,  1,  // Orientation 3

	// Piece 6 ("J")
	 1, -1,  -1,  0,   0,  0,   1,  0,  // Orientation 0
	 0, -1,   0,  0,   0,  1,   1,  1,  // Orientation 1
	-1,  0,   0,  0,   1,  0,  -1,  1,  // Orientation 2
	-1, -1,   0, -1,   0,  0,   0,  1,  // Orientation 3

	// Piece 7 ("T")
	 0, -1,  -1,  0,   0,  0,   1,  0,  // Orientation 0
	 0, -1,   0,  0,   1,  0,   0,  1,  // Orientation 1
	-1,  0,   0,  0,   1,  0,   0,  1,  // Orientation 2
	 0, -1,  -1,  0,   0,  0,   0,  1,  // Orientation 3
];


/**
 * 移动模块
 *
 * @memberOf  STPiece
 */
var STPiece = function(){
	this.mKind = 0;			// 1,2,3,4,5,6,7 (O,I,S,Z,L,J,T); 0==None
	this.mX = 0;				// X Origin; must be on the board
	this.mY = 0;				// Y Origin; must be on the board
	this.mOrientation = 0;	// 1,2,3,4 (0,1/4,2/4,3/4-"turn"); 0==None
	this.m_pSprites = [];
	this.gameObject = null;
};

module.exports = STPiece;


/**
 * 设置对应的gameObject
 *
 * @memberOf  STBoard
 */
STPiece.prototype.setObject = function( object ){

	this.gameObject = object;
};

/**
 * 清除数据
 *
 * @memberOf  STPiece
 */
STPiece.prototype.clear = function(){

	this.mKind = 0;			
	this.mX = 0;				
	this.mY = 0;				
	this.mOrientation = 0;
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
 * 拷贝数据
 *
 * @memberOf  STPiece
 */
STPiece.prototype.copyFromPiece = function( piece ){

	this.mKind = piece.mKind;			
	this.mX = piece.mX;				
	this.mY = piece.mY;				
	this.mOrientation = piece.mOrientation;
};

/**
 * 获取种类
 *
 * @memberOf  STPiece
 */
STPiece.prototype.getKind = function( ){

	// 1,2,3,4,5,6,7 (O,I,S,Z,L,J,T); 0==None
	if ((this.mKind < 0) || (this.mKind > 7))
	{
		this.mKind = 0;
	}
	return( this.mKind );
};

/**
 * 设置种类
 *
 * @memberOf  STPiece
 */
STPiece.prototype.setKind = function( kind ){  // Kind=1,2,3,4,5,6,7

	this.mKind = kind;
	if ((this.mKind < 0) || (this.mKind > 7))
	{
		this.mKind = 0;
	}
	if( this.gameObject )
	{
		var point       = 0;
		var totalPoints = 0;

		totalPoints = STPiece.getTotalPoints();

		for ( point = 1; point <= totalPoints; point++ )
		{
			var cellX = 0;
			var cellY = 0;

			cellX = this.getAbsolutePointX( point );
			cellY = this.getAbsolutePointY( point );
			var opt = {};
			opt.x = cellX * 38;
			opt.y = cellY * 38;
			this.m_pSprites[ point ] = this.gameObject.addNewSprite( opt );
		}
	}
};

/**
 * 获取 x
 *
 * @memberOf  STPiece
 */
STPiece.prototype.getX = function( ){

	return this.mX;
};

/**
 * 获取 y
 *
 * @memberOf  STPiece
 */
STPiece.prototype.getY = function( ){

	return this.mY;
};
/**
 * 设置 x
 *
 * @memberOf  STPiece
 */
STPiece.prototype.setX = function( x ){

	this.mX = x;
};
/**
 * 设置 y
 *
 * @memberOf  STPiece
 */
STPiece.prototype.setY = function( y ){

	this.mY = y;
};

/**
 * 获取方向
 *
 * @memberOf  STPiece
 */
STPiece.prototype.getOrientation = function( ){

	// 1,2,3,4 (0,1/4,2/4,3/4-"turn"); 0==None
	if ((this.mOrientation < 0) || (this.mOrientation > 4))
	{
		this.mOrientation = 0;
	}
	return( this.mOrientation );
};

/**
 * 设置方向
 *
 * @memberOf  STPiece
 */
STPiece.prototype.setOrientation = function( orientation ){  // Orientation=1,2,3,4

	this.mOrientation = orientation;

	if ((this.mOrientation < 0) || (this.mOrientation > 4))
	{
		this.mOrientation = 0;
	}
	if( this.gameObject )
	{
		var point       = 0;
		var totalPoints = 0;

		totalPoints = STPiece.getTotalPoints();
		for ( point = 1; point <= totalPoints; point++ )
		{
			var cellX = 0;
			var cellY = 0;

			cellX = this.getAbsolutePointX( point );
			cellY = this.getAbsolutePointY( point );
			var opt = {};
			opt.x = cellX * 38;
			opt.y = cellY * 38;
			this.m_pSprites[ point ].setPosition( opt );
		}
	}
};

/**
 * 获取总点数
 *
 * @memberOf  STPiece
 */
STPiece.getTotalPoints = function( ) { 
	
	return(4); 
};

/**
 * 获取绝对点 x
 *
 * @memberOf  STPiece
 */
STPiece.prototype.getAbsolutePointX = function( point ){  // Point=1,2,3,4

	if (point < 1){
		return(0);
	}
	if (point > 4){
		return(0);
	}
	return( this.mX + STPiece.getCellOffsetX(this.mKind, this.mOrientation, point) );
};

/**
 * 获取绝对点 y
 *
 * @memberOf  STPiece
 */
STPiece.prototype.getAbsolutePointY = function( point ){  // Point=1,2,3,4

	if (point < 1){
		return(0);
	}
	if (point > 4){
		return(0);
	}
	return( this.mY + STPiece.getCellOffsetY(this.mKind, this.mOrientation, point) );
};

/**
 * 
 *
 * @memberOf  STPiece
 */
STPiece.prototype.getAbsoluteXMin = function( ){

	if (0 == this.IsValid()){
		return(0);
	}

	var totalPoints = 0;
	totalPoints = STPiece.getTotalPoints();
	if (totalPoints < 1) {
		return(0);  // No points!
	}

	// Get absolute X coordinate of first point.
	var x    = 0;
	x = this.getAbsolutePointX( 1 );

	// Set minimum to first X value, as a hypothesis.
	var xMin = 0;
	xMin = x;

	// Loop through remaining points to find minimum absolute X.
	var point = 0;
	for ( point = 2; point <= totalPoints; point++ )
	{
		x = this.getAbsolutePointX( point );
		if (x < xMin){
			xMin = x;
		}
	}

	return( xMin );
};
/**
 * 
 *
 * @memberOf  STPiece
 */
STPiece.prototype.getAbsoluteXMax = function( ){

	if (0 == this.IsValid()) {
		return(0);
	}

	var totalPoints = 0;
	totalPoints = STPiece.getTotalPoints();
	if (totalPoints < 1){
		return(0);  // No points!
	}

	// Get absolute X coordinate of first point.
	var x    = 0;
	x = this.getAbsolutePointX( 1 );

	// Set maximum to first X value, as a hypothesis.
	var xMax = 0;
	xMax = x;

	// Loop through remaining points to find maximum absolute X.
	var point = 0;
	for ( point = 2; point <= totalPoints; point++ )
	{
		x = this.getAbsolutePointX( point );
		if (x > xMax)  xMax = x;
	}

	return( xMax );
};
/**
 * 
 *
 * @memberOf  STPiece
 */
STPiece.prototype.getAbsoluteYMin = function( ){

	if (0 == this.IsValid()) {
		return(0);
	}

	var totalPoints = 0;
	totalPoints = STPiece.getTotalPoints();
	if (totalPoints < 1) {
		return(0);  // No points!
	}

	// Get absolute Y coordinate of first point.
	var y    = 0;
	y = this.getAbsolutePointY( 1 );

	// Set minimum to first Y value, as a hypothesis.
	var yMin = 0;
	yMin = y;

	// Loop through remaining points to find minimum absolute Y.
	var point = 0;
	for ( point = 2; point <= totalPoints; point++ )
	{
		y = this.getAbsolutePointY( point );
		if (y < yMin) {
			yMin = y;
		}
	}

	return( yMin );
};
/**
 * 
 *
 * @memberOf  STPiece
 */
STPiece.prototype.getAbsoluteYMax = function( ){

	if (0 == this.IsValid()){
		return(0);
	}

	var totalPoints = 0;
	totalPoints = STPiece.getTotalPoints();
	if (totalPoints < 1){
		return(0);  // No points!
	}

	// Get absolute Y coordinate of first point.
	var y    = 0;
	y = this.getAbsolutePointY( 1 );

	// Set maximum to first Y value, as a hypothesis.
	var yMax = 0;
	yMax = y;

	// Loop through remaining points to find maximum absolute Y.
	var point = 0;
	for ( point = 2; point <= totalPoints; point++ )
	{
		y = this.getAbsolutePointY( point );
		if (y > yMax){
			yMax = y;
		}
	}

	return( yMax );
};

/**
 * 是否有效
 *
 * @memberOf  STPiece
 */
STPiece.prototype.IsValid = function(){

	if ((this.mKind < 1) || (this.mKind > 7)){
		return(0);
	}

	if ((this.mOrientation < 1) || (this.mOrientation > 4)) {
		return(0);
	}
	return(1);
};

/**
 * 旋转
 *
 * @memberOf  STPiece
 */
STPiece.prototype.rotate = function( ){ // Advance orientation by one step, modulo max orientations

	if (0 == this.IsValid()){
		return;
	}

	// First, retrieve maximum non-redundant orientation values
	var maxOrientations = 0;
	maxOrientations = STPiece.getMaxOrientations( this.mKind );
	if (0 == maxOrientations) {
		return;
	}

	// Modulo the maximum number of non-redundant orientations, we increment.
	this.mOrientation = ((this.mOrientation % maxOrientations) + 1);
	// NOTE: This formula is essentially (((i++)-1)%N)+1 = (i%N)+1.
};

/**
 * 多次旋转
 *
 * @memberOf  STPiece
 */
STPiece.prototype.rotateByCount = function( count ){ // Essentially multiple Rotate commands

	var step  = 0;
	var total = 0;

	total = count;  // Copy number (can be negative, zero, or positive)
	total %= 4; // Modulo 4 (-3,-2,-1,0,1,2,3)
	total += 4; // Add    4 ( 1, 2, 3,4,5,6,7)
	total %= 4; // Modulo 4 ( 1, 2, 3,0,1,2,3)

	for ( step = 0; step < total; step++ )
		this.rotate();

};

/**
 * 调动位置
 *
 * @memberOf  STPiece
 */
STPiece.prototype.translate = function( deltaX, deltaY ){
	 this.mX += deltaX;
	 this.mY += deltaY;
	if( this.gameObject )
	{
		var point       = 0;
		var totalPoints = 0;

		totalPoints = STPiece.getTotalPoints();

		for ( point = 1; point <= totalPoints; point++ )
		{
			var cellX = 0;
			var cellY = 0;

			cellX = this.getAbsolutePointX( point );
			cellY = this.getAbsolutePointY( point );
			var opt = {};
			opt.x = cellX * 38;
			opt.y = cellY * 38;
			this.m_pSprites[ point ].setPosition( opt );
		}
	}
 };

/**
 * 获取最多方向
 *
 * @memberOf  STPiece
 */
STPiece.getMaxOrientations = function( kind ){

	if (1 == kind) {
		return( 1 );
	}

	if (2 == kind) {
		return( 2 );
	}

	if (3 == kind) {
		return( 2 );
	}

	if (4 == kind) {
		return( 2 );
	}

	if (5 == kind) {
		return( 4 );
	}

	if (6 == kind) {
		return( 4 );
	}

	if (7 == kind) {
		return( 4 );
	}
};

/**
 *
 *
 * @memberOf  STPiece
 */
STPiece.getCellOffsetX = function( kind, orientation, point ){
	
	if (kind <=  0) {
		return(0);
	}
	if (kind > 7) {
		return(0);
	}
	if (orientation <= 0) {
		return(0);
	}
	if (orientation > 4){
		return(0);
	}
	if (point <= 0){
		return(0);
	}
	if (point > 4){
		return(0);
	}

	var index = 0;
	index = 32*(kind-1) + 8*(orientation-1) + 2*(point-1);
	if (index < 0) {
		return(0);
	}
	if (index >= 224 ) {
		return(0);
	}

	return( mPiecesXY_224[ index ] );  

};

/**
 *
 *
 * @memberOf  STPiece
 */
STPiece.getCellOffsetY = function( kind, orientation, point ){

	if (kind <=  0) {
		return(0);
	}
	if (kind > 7) {
		return(0);
	}
	if (orientation <= 0) {
		return(0);
	}
	if (orientation > 4){
		return(0);
	}
	if (point <= 0){
		return(0);
	}
	if (point > 4){
		return(0);
	}

	var index = 0;
	index = 32*(kind-1) + 8*(orientation-1) + 2*(point-1) + 1;
	if (index < 0) {
		return(0);
	}
	if (index >= 224 ) {
		return(0);
	}

	return( mPiecesXY_224[ index ] );  

};

/**
 *
 *
 * @memberOf  STPiece
 */
STPiece.IsOffsetCellOccupied = function( kind, orientation, x, y ){

	// This function will indicates if a cell relative to the piece origin
	// is occupied by this piece.
	if (kind <=  0) {
		return(0);
	}
	if (kind > 7) {
		return(0);
	}
	if (orientation <= 0) {
		return(0);
	}
	if (orientation > 4){
		return(0);
	}

	// Loop through all points and test against supplied point.
	var totalPoints = 0;
	totalPoints = STPiece.getTotalPoints();
	var point = 0;
	for ( point = 1; point <= totalPoints; point++ )
	{
		if ( (x == STPiece.getCellOffsetX( kind, orientation, point )) &&
			(y == STPiece.getCellOffsetY( kind, orientation, point )) )
		{
			return(1);
		}
	}
	return(0);
};
















