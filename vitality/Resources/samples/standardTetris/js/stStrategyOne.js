
var STBoard = require( 'samples/standardTetris/js/stBoard.js' );
var STPiece = require( 'samples/standardTetris/js/stPiece.js' );

var STStrategyOne = function(){


};

module.exports = STStrategyOne;


STStrategyOne.prototype.getStrategyName = function( ){

    return "Pierre Dellacherie (one-piece, 2003)";
};


// WARNING: Moves requiring rotation must wait until piece has fallen by
// at least one row!
// Perform all rotations, and then perform translations.  This
// avoids the problem of getting the piece jammed on the sides
// of the board where rotation is impossible. ***
// Also, the following strategy does not take advantage of the
// possibility of using free-fall and future movements to
// slide under overhangs and fill them in.

STStrategyOne.prototype.getBestMoveOncePerPiece = function( board,piece, nextPieceFlag, nextPieceShape, results ){

    STStrategyOne.privateStrategy
        (
        0, // 0 == not called from parent ply; Just this one ply.
        board,
        piece,
        results
        );
};



STStrategyOne.privateStrategy = function( flagCalledFromParentPly, board, piece, results ){

    results.bestRotationDelta    = 0;
    results.bestTranslationDelta = 0;

    if (0 == board.IsValid()) 
    {
        return(0.0);
    }

    if (0 == piece.IsValid()) 
    {
        return(0.0);
    }


    var width  = 0;
    var height = 0;
    width  = board.getWidth();
    height = board.getHeight();




    var currentBestTranslationDelta  = 0;
    var currentBestRotationDelta = 0;
    var currentBestMerit = (-1.0e+20); // Really bad!
    var currentBestPriority = 0;

    var trialTranslationDelta = 0;
    var trialRotationDelta = 0;
    var trialMerit = 0.0;
    var trialPriority = 0;

    var moveAcceptable = 0;
    var count = 0;

    var tempBoard = new STBoard();
    var tempPiece = new STPiece();



    var maxOrientations = STPiece.getMaxOrientations( piece.getKind() );

    for 
        ( 
        trialRotationDelta = 0; 
        trialRotationDelta < maxOrientations;
        trialRotationDelta++ 
        )
    {

        // Make temporary copy of piece, and rotate the copy.
        tempPiece.copyFromPiece( piece );
        for ( count = 0; count < trialRotationDelta; count++ )
        {
            tempPiece.rotate();
        }


        // Determine the translation limits for this rotated piece.
        var data = {};
        board.determineAccessibleTranslationsForPieceOrientation
            (
            tempPiece,
            data
            );
        var moveIsPossible = data.ref_movePossible || 0;
        var minDeltaX      = data.ref_minDeltaX || 0;
        var maxDeltaX      = data.ref_maxDeltaX || 0;

        // Consider all allowed translations for the current rotation.
        if (0 != moveIsPossible)
        {
            for 
                ( 
                trialTranslationDelta = minDeltaX;
                trialTranslationDelta <= maxDeltaX;
                trialTranslationDelta++ 
                )
            {
                // Evaluate this move

                // 对 temp 进行旋转和移动
                tempPiece.copyFromPiece( piece );
                for ( count = 0; count < trialRotationDelta; count++ )
                {
                    tempPiece.rotate();
                }
                tempPiece.translate( trialTranslationDelta, 0 );

                moveAcceptable =
                    board.IsGoalAcceptable
                    (
                        tempPiece
                    );

                if (0 != moveAcceptable)
                {
                    // Since the piece can be (not necessarily GET) at the goal
                    // horizontal translation and orientation, it's worth trying
                    // out a drop and evaluating the move.
                    tempBoard.copyFromBoard( board );


                    tempBoard.fullDropAndAddPieceToBoard
                        ( 
                        tempPiece
                        );


                    // Pierre Dellacherie (France) Board & Piece Evaluation Function
                    var result = {};
                    STStrategyOne.privateStrategyEvaluate
                        ( 
                        tempBoard,
                        tempPiece,
                        result
                        );
                    trialMerit = result.rating || 0.0;
                    trialPriority = result.priority || 0;

                    // If this move is better than any move considered before,
                    // or if this move is equally ranked but has a higher priority,
                    // then update this to be our best move.
                    if 
                        ( 
                        (trialMerit > currentBestMerit) ||
                        ((trialMerit == currentBestMerit) && (trialPriority > currentBestPriority)) 
                        )
                    {
                        currentBestMerit            = trialMerit;
                        currentBestPriority         = trialPriority;
                        currentBestTranslationDelta = trialTranslationDelta;
                        currentBestRotationDelta    = trialRotationDelta;
                    }
                }
            }
        }

    }


    // Commit to this move
    results.bestTranslationDelta = currentBestTranslationDelta;
    results.bestRotationDelta    = currentBestRotationDelta;
    return( currentBestMerit );
};

/**
 * 评估策略
 *
 * @memberOf  STStrategyOne
 */
STStrategyOne.privateStrategyEvaluate = function( board, piece, result ){

    var rating = 0.0;
    var priority = 0;

    if (0 == board.IsValid()) 
    {
        return;
    }

    if (0 == piece.IsValid()) 
    {
        return;
    }



    var boardWidth = 0;
    var boardHeight = 0;
    boardWidth = board.getWidth();
    boardHeight = board.getHeight();




    var   erodedPieceCellsMetric = 0;
    var   boardRowTransitions    = 0;
    var   boardColTransitions    = 0;
    var   boardBuriedHoles       = 0;
    var   boardWells             = 0;

    var   pileHeight             = 0;
    var   x                      = 0;
    var   y                      = 0;






    // Landing Height (vertical midpovar)

    var landingHeight = 0.5 * piece.getAbsoluteYMin() + piece.getAbsoluteYMax();



    var completedRows = 0;
    completedRows = board.getTotalCompletedRows();

    if (completedRows > 0)
    {
        // Count piece cells eroded by completed rows before doing collapse on pile.
        var pieceCellsEliminated = 0;
        pieceCellsEliminated = board.countPieceCellsEliminated( piece );

        // Now it's okay to collapse completed rows
        board.collapseAnyCompletedRows();

        // Weight eroded cells by completed rows
        erodedPieceCellsMetric = (completedRows * pieceCellsEliminated);
    }





    // Note that this evaluation of pile height is AFTER collapsing
    // any completed rows.
    pileHeight  = board.pileMaxHeight();
    // Each empty row (above pile height) has two (2) "transitions"
    // (We could call board.GetTransitionCountForRow( y ) for
    // these unoccupied rows, but this is an optimization.)
    boardRowTransitions = 2 * (boardHeight - pileHeight);
    // Only go up to the pile height, and later we'll account for the
    // remaining rows transitions (2 per empty row).
    for ( y = 1; y <= pileHeight; y++ )
    {
        boardRowTransitions += (board.getTransitionCountForRow( y ));
    }






    for ( x = 1; x <= boardWidth; x++ )
    {
        boardColTransitions += (board.getTransitionCountForColumn( x ));
        boardBuriedHoles    += (board.getBuriedHolesForColumn( x ));
        boardWells          += (board.getAllWellsForColumn( x ));
    }







    // Final Rating

    rating   =  ( 0.0);
    rating  += ((-1.0) * (landingHeight));
    rating  += (( 1.0) * (erodedPieceCellsMetric));
    rating  += ((-1.0) * (boardRowTransitions));
    rating  += ((-1.0) * (boardColTransitions));
    rating  += ((-4.0) * (boardBuriedHoles));
    rating  += ((-1.0) * (boardWells));

    // EXPLANATION:
    //   [1] Punish landing height
    //   [2] Reward eroded piece cells
    //   [3] Punish row    transitions
    //   [4] Punish column transitions
    //   [5] Punish buried holes (cellars)
    //   [6] Punish wells



    // PRIORITY:  
    //   Priority is further differentiation between possible moves.
    //   We further rate moves accoding to the following:
    //            * Reward deviation from center of board
    //            * Reward pieces to the left of center of the board
    //            * Punish rotation
    //   Priority is less important than the rating, but among equal
    //   ratings we select the option with the greatest priority.
    //   In principle we could simply factor priority in to the rating,
    //   as long as the priority was less significant than the smallest
    //   variations in rating, but for large board widths (>100), the
    //   risk of loss of precision in the lowest bits of the rating
    //   is too much to tolerate.  So, this priority is stored in a
    //   separate variable.

    priority = 0;

    priority += 100 * Math.abs( piece.getX() - board.getPieceSpawnX() );

    if (piece.getX() < board.getPieceSpawnX()) 
    {
        priority += 10;
    }
    priority -= (piece.getOrientation() - 1);

    result.rating = rating;
    result.priority = priority;
};