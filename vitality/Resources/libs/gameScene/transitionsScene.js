
var director = require( 'libs/util/director.js' ).director;

var transitionsScene = module.exports = {};

var TRANSITION_DURATION = 1.2;

transitionsScene.createTransition = [
	function (t, s) {
		t = t || TRANSITION_DURATION;
		return cc.TransitionJumpZoom.create(t, s);
	},

	function (t, s) {
		t = t || TRANSITION_DURATION;
		return cc.TransitionJumpZoom.create(t, s);
	},

	function (t, s) {
		t = t || TRANSITION_DURATION;
		return cc.TransitionProgressRadialCCW.create(t, s);
	},

	function (t, s) {
		t = t || TRANSITION_DURATION;
		return cc.TransitionProgressHorizontal.create(t, s);
	},

	function (t, s) {
		t = t || TRANSITION_DURATION;
		return cc.TransitionProgressVertical.create(t, s);
	},

	function (t, s) {
		t = t || TRANSITION_DURATION;
		return cc.TransitionProgressInOut.create(t, s);
	},

	function (t, s) {
		t = t || TRANSITION_DURATION;
		return cc.TransitionProgressOutIn.create(t, s);
	},

	function (t, s) {
		t = t || TRANSITION_DURATION;
		return cc.TransitionFade.create(t, s);
	},

	function (t, s) {
		return cc.TransitionFade.create(t, s, cc.c3b(255,255,255));
	},

	function (t, s) {
		return cc.TransitionFlipX.create(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
	},

	function (t, s) {
		return cc.TransitionFlipX.create(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
	},

	function (t, s) {
		return cc.TransitionFlipY.create(t, s, cc.TRANSITION_ORIENTATION_UP_OVER);
	},

	function (t, s) {
		return cc.TransitionFlipY.create(t, s, cc.TRANSITION_ORIENTATION_DOWN_OVER);
	},

	function (t, s) {
		return cc.TransitionFlipAngular.create(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
	},

	function (t, s) {
		return cc.TransitionFlipAngular.create(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
	},

	function (t, s) {
		return cc.TransitionZoomFlipX.create(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
	},

	function (t, s) {
		return cc.TransitionZoomFlipX.create(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
	},

	function (t, s) {
		return cc.TransitionZoomFlipY.create(t, s, cc.TRANSITION_ORIENTATION_UP_OVER);
	},

	function (t, s) {
		return cc.TransitionZoomFlipY.create(t, s, cc.TRANSITION_ORIENTATION_DOWN_OVER);
	},

	function (t, s) {
		return cc.TransitionZoomFlipAngular.create(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
	},

	function (t, s) {
		return cc.TransitionZoomFlipAngular.create(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
	},

	function (t, s) {
		return cc.TransitionShrinkGrow.create(t, s);
	},

	function (t, s) {
		return cc.TransitionRotoZoom.create(t, s);
	},

	function (t, s) {
		return cc.TransitionMoveInL.create(t, s);
	},

	function (t, s) {
		return cc.TransitionMoveInR.create(t, s);
	},

	function (t, s) {
		return cc.TransitionMoveInT.create(t, s);
	},

	function (t, s) {
		return cc.TransitionMoveInB.create(t, s);
	},

	function (t, s) {
		return cc.TransitionSlideInL.create(t, s);
	},

	function (t, s) {
		return cc.TransitionSlideInR.create(t, s);
	},

	function (t, s) {
		return cc.TransitionSlideInT.create(t, s);
	},

	function (t, s) {
		return cc.TransitionSlideInB.create(t, s);
	},

	function (t, s) {
		return cc.TransitionCrossFade.create(t, s);
	},

	function (t, s) {
		return cc.TransitionRadialCCW.create(t, s);
	},

	function (t, s) {
		return cc.TransitionRadialCW.create(t, s);
	},

	function (t, s) {
		director.setDepthTest(true);
		return cc.TransitionPageTurn.create(t, s, false);
	},

	function (t, s) {
		director.setDepthTest(true);
		return cc.TransitionPageTurn.create(t, s, true);
	},

	function (t, s) {
		return cc.TransitionFadeTR.create(t, s);
	},

	function (t, s) {
		return cc.TransitionFadeBL.create(t, s);
	},

	function (t, s) {
		return cc.TransitionFadeUp.create(t, s);
	},

	function (t, s) {
		return cc.TransitionFadeDown.create(t, s);
	},

	function (t, s) {
		return cc.TransitionTurnOffTiles.create(t, s);
	},

	function (t, s) {
		return cc.TransitionSplitRows.create(t, s);
	},

	function (t, s) {
		return cc.TransitionSplitCols.create(t, s);
	}
];