
/**
 * @fileOverview UIPoint
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */

/**
 * @author SPII
 * @constructor onCreate
 * @description point
 * @extends aBase
 */
var UIPoint = function(){
    this.x = 0.0;
    this.y = 0.0;
}; 
                    
var UIPointMake = function(x,y){
    var pt = new UIPoint();
    pt.x = x;
    pt.y = y;
    return pt;
};


/**
 * @fileOverview UISize
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */

/**
 * @author SPII
 * @constructor onCreate
 * @description size
 * @extends aBase
 */
var UISize = function(){
    this.width = 0.0;
    this.height = 0.0;
};

var UISizeMake = function(width,height){
    var sz = new UISize();
    sz.width = width;
    sz.height = height;
    return sz;
};


/**
 * @fileOverview UIRect
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */

/**
 * @author SPII
 * @constructor onCreate
 * @description rect
 * @extends aBase
 */
var UIRect = function(){
    this.origin = new UIPoint();
    this.size = new UISize();
};

var UIRectMake = function(origin,size){
    var rt = new UIRect();
    rt.origin.x = origin.x;
    rt.origin.y = origin.y;
    rt.size.width = size.width;
    rt.size.height = size.height;
    return rt;
};


/**
 * @fileOverview UIMath
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */

/**
 * @author SPII
 * @constructor onCreate
 * @description 
 * @extends aBase
 */
var gUIMath = {};

    gUIMath.vectorAdd = function(p1,p2){
        var v = new UIPoint();
        v.x = p1.x + p2.x;
        v.y = p1.y + p2.y;
        return v;
     };

    gUIMath.vectorSub = function(p1,p2){
        var v = new UIPoint();
        v.x = p1.x - p2.x;
        v.y = p1.y - p2.y;
        return v;
     };

    gUIMath.vectorMult = function(p1,s){
        var v = new UIPoint();
        v.x = p1.x * s;
        v.y = p1.y * s;
        return v;
     };

    gUIMath.max = function(v1,v2){
        if (v1 > v2){
        return v1;
        }
        return v2;
     };

    gUIMath.min = function(v1,v2){
        if (v1 < v2){
        return v1;
        }
        return v2;
     };

    gUIMath.fmod = function(v1,v2){
        return v1%v2;
    };

module.exports = {
    UIPoint: UIPoint,
    UIPointMake: UIPointMake,
    UISize: UISize,
    UISizeMake: UISizeMake,
    UIRect: UIRect,
    UIRectMake: UIRectMake,
    gUIMath: gUIMath
};