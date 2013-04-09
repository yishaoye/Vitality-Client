/*
 * Copyright (c) 2012 Chukong Technologies, Inc.
 *
 * http://www.sweetpome.com
 * http://tools.cocoachina.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

#include "CRenderNode.h"
#include "CTextField.h"
#include "CClipAbleSprite.h"
#include "CClipAbleLayerColor.h"
#include "CLabelAtlas.h"
#include "CCScale9Sprite.h"
#include "cocos2dx.hpp"

using namespace cocos2d;

namespace sp{

CRenderNode::CRenderNode() :
m_nodeType(NODE_NONE),
	m_bVisible(true),
	m_nOpacity(255),
    m_pos(GLKVector4Make(0.0f, 0.0f, 0.1f, 0.1f)),
    m_acPt(GLKVector4Make(0.5f, 0.5f, 0.1f, 0.1f)),
    m_size(GLKVector4Make(0.0f, 0.0f, 0.1f, 0.1f)),
    m_fScale(1.0f),
	m_fScaleX(1.0f),
	m_fScaleY(1.0f),
	m_fRotation(0.0f),
	m_nZOrder(1),
	m_pParent(NULL),
	m_pRenderNode(NULL)
{
	this->m_pRenderNode = cocos2d::CCNode::create();
	m_pRenderNode->retain();
	this->m_position = &m_pos;
	this->m_anchorPoint = &m_acPt;
	this->m_contentSize = &m_size;
	this->m_worldPosition = &m_wdPos;

	//CREATE_JS_OBJECT(CRenderNode)
}

CRenderNode::~CRenderNode()
{
	removeAllRenderNodeAndCleanUp(true);
	m_pRenderNode->removeFromParentAndCleanup(true);
	m_pRenderNode->release();
	printf("delete crendernode\n");
}

void CRenderNode::initNode(int nodeType)
{
	this->setNodeType(nodeType);
	switch (nodeType) {
	case NODE_CCNODE://1
		this->m_pRenderNode = cocos2d::CCNode::create();
		break;
	case NODE_CCLAYER://2
		this->m_pRenderNode = cocos2d::CCLayer::create();
		break;
	case NODE_CCSPRITE://3
		this->m_pRenderNode = cocos2d::CCSprite::create();
		break;
	case NODE_CCCOLORLAYER://4
		this->m_pRenderNode = cocos2d::CCLayerColor::create();
		break;
	case NODE_TEXT://5
		this->m_pRenderNode = cocos2d::CCLabelTTF::create();
		break;
	case NODE_TEXTFIELD://6
		this->m_pRenderNode = CCTextFieldTTF::textFieldWithPlaceHolder("input words here", "宋体", 20);
		break;
	case NODE_CLIPSPRITE://7
		this->m_pRenderNode = CClipAbleSprite::create();
		break;
	case NODE_CLIPLAYERCOLOR://8
		this->m_pRenderNode = CClipAbleLayerColor::create();
		break;
	case NODE_LABELATLAS://9
		this->m_pRenderNode = CLabelAtlas::create();
		break;
	case NODE_SCALE9SPRITE://10
		this->m_pRenderNode = cocos2d::extension::CCScale9Sprite::create();
		break;
	case NODE_TEXTAREA://11
		this->m_pRenderNode = cocos2d::CCLabelTTF::create("", "Thonburi", 20, CCSizeMake(0, 0), kCCTextAlignmentCenter, kCCVerticalTextAlignmentCenter);
		break;
	case NODE_EDITBOX:
		//            this->m_pRenderNode = cocos2d::extension::cced
		break;
	default:
		break;
	}
	this->m_pRenderNode->retain();
	//    float a = fmodf(2, 1);
	//    float a = 1%1;
	//    int b = 0;
	//    this->m_pRenderNode->setAnchorPoint(ccp(0.5f,0.5f));
}

    bool CRenderNode::addRenderNode(CRenderNode *node)
{
	if (node == NULL) {
		return false;
	}
	for (std::vector<CRenderNode*>::iterator i = m_children.begin(); i!=m_children.end(); i++) {
		if(*i == node)
			return false;
	}

	m_children.push_back(node);
	node->setParent(this);
	this->m_pRenderNode->addChild(node->getRenderNode());
	return true;
}

    bool CRenderNode::removeRenderNodeAndCleanUp(CRenderNode *node,bool cleanUp)
{
	if (node == NULL) {
		return NULL;
	}
	if (cleanUp) {
		for (std::vector<CRenderNode*>::iterator i = m_children.begin(); i!=m_children.end(); i++) {
			if(*i == node) {
				this->m_children.erase(i);
				node->setParent(NULL);
				delete node;
				node = NULL;
				return true;
			}
		}
	}
	else {
		for (std::vector<CRenderNode*>::iterator i = m_children.begin(); i!=m_children.end(); i++) {
			if(*i == node) {
				this->m_children.erase(i);
				node->getRenderNode()->removeFromParentAndCleanup(false);
				node->setParent(NULL);
				return true;
			}
		}
	}
	return false;
}

bool CRenderNode::removeAllRenderNodeAndCleanUp(bool cleanUp)
{
	if (cleanUp) {
		for (std::vector<CRenderNode*>::iterator i = m_children.begin(); i!=m_children.end(); i++) {
			CRenderNode* child = *i;
			child->setParent(NULL);
			delete child;
			child = NULL;
		}
	}
	else {
		for (std::vector<CRenderNode*>::iterator i = m_children.begin(); i!=m_children.end(); i++) {
			CRenderNode* child = *i;
			child->getRenderNode()->removeFromParentAndCleanup(false);
			child->setParent(NULL);
		}
	}
	m_children.clear();
	return true;
}

bool CRenderNode::removeFromParentAndCleanUp(bool cleanUp)
{
	if (this->m_pParent) {
		return  this->m_pParent->removeRenderNodeAndCleanUp(this,cleanUp);
	}else{
		delete this;
	}
	return false;
}

//cocos property
void CRenderNode::setVisible(bool visible)
{
	if (this->m_bVisible == visible) {
		return;
	}
	this->m_bVisible = visible;
	if (this->m_pRenderNode) {
		this->m_pRenderNode->setVisible(visible);
	}
}

bool CRenderNode::getVisible()
{
	return this->m_bVisible;
}

void CRenderNode::setOpacity(int opacity)
{
	this->m_nOpacity = opacity;
	switch (this->m_nodeType) {
	case NODE_CCSPRITE:
		((CCSprite*)(this->m_pRenderNode))->setOpacity(opacity);
		break;
	case NODE_CLIPSPRITE:
		((CClipAbleSprite*)(this->m_pRenderNode))->setOpacity(opacity);
	default:
		break;
	}
	//    this->m_pRenderNode->set
}

int CRenderNode::getOpacity()
{
	return this->m_nOpacity;
}

void CRenderNode::setScale(float scale)
{
	this->m_fScale = scale;
	this->m_pRenderNode->setScale(this->m_fScale);
}

void CRenderNode::setScaleX(float scaleX)
{
	this->m_fScaleX = scaleX;
	this->m_pRenderNode->setScaleX(this->m_fScaleX);
}

void CRenderNode::setScaleY(float scaleY)
{
	this->m_fScaleY = scaleY;
	this->m_pRenderNode->setScaleY(this->m_fScaleY);
}

void CRenderNode::setFlipX(bool flipX){
	this->m_bFlipX = flipX;
	switch (this->m_nodeType) {
	case NODE_CCNODE:
		break;
	case NODE_CCLAYER:
		break;
	case NODE_CCSPRITE:
		((CCSprite*)(this->m_pRenderNode))->setFlipX(flipX);
		break;
	case NODE_CCCOLORLAYER:
		break;
	case NODE_TEXT:
		((CCLabelTTF*)(this->m_pRenderNode))->setFlipX(flipX);
		break;
	default:
		break;
	}
}

void CRenderNode::setFlipY(bool flipY){
	this->m_bFlipY = flipY;
	switch (this->m_nodeType) {
	case NODE_CCNODE:
		break;
	case NODE_CCLAYER:
		break;
	case NODE_CCSPRITE:
		((CCSprite*)(this->m_pRenderNode))->setFlipY(flipY);
		break;
	case NODE_CCCOLORLAYER:
		break;
	case NODE_TEXT:
		((CCLabelTTF*)(this->m_pRenderNode))->setFlipY(flipY);
		break;
	default:
		break;
	}
}

void CRenderNode::setRotation(float rotation)
{
	this->m_fRotation = rotation;
	this->m_pRenderNode->setRotation(rotation);
}

float CRenderNode::getRotation()
{
	return this->m_fRotation;
}

    void CRenderNode::setPosition(GLKVector4* pos)
{
	*m_position = *pos;
	if (this->m_pRenderNode) {
		cocos2d::CCPoint ccPosition = ccp(pos->v[0],pos->v[1]);
		this->m_pRenderNode->setPosition(ccPosition);
	}
}

void CRenderNode::setPositionXY(float x,float y)
{
	m_position->v[0] = x;
	m_position->v[1] = y;

	if (this->m_pRenderNode) {
		cocos2d::CCPoint ccPosition = ccp(x,y);
		this->m_pRenderNode->setPosition(ccPosition);
	}
	//    CCPoint p = this->m_pRenderNode->convertToWorldSpace(ccp(0,0));
	//    int a =0;
}

    GLKVector4* CRenderNode::getPosition()
{
	return this->m_position;
}

    void CRenderNode::setAnchorPoint(GLKVector4* point)
{
	*m_anchorPoint = *point;
	if (this->m_pRenderNode) {
		cocos2d::CCPoint ccPoint = ccp(point->v[0],point->v[1]);
		this->m_pRenderNode->setAnchorPoint(ccPoint);
	}
}

void CRenderNode::setAnchorPointXY(float x,float y)
{
	m_anchorPoint->v[0] = x;
	m_anchorPoint->v[1] = y;
	if (this->m_pRenderNode) {
		cocos2d::CCPoint ccPoint = ccp(x,y);
		this->m_pRenderNode->setAnchorPoint(ccPoint);
	}
}

    GLKVector4*  CRenderNode::getAnchorPoint()
{
	return this->m_anchorPoint;
}

void CRenderNode::setZOrder(int z)
{
	this->m_nZOrder = z;
	if (this->m_pRenderNode) {

	}
}

int CRenderNode::getZOrder()
{
	return this->m_nZOrder;
}

cocos2d::CCNode* CRenderNode::getRenderNode()
{
	return this->m_pRenderNode;
}

    void CRenderNode::setParent(CRenderNode *parent)
{
	this->m_pParent = parent;
}

CRenderNode* CRenderNode::getParent()
{
	return this->m_pParent;
}

void CRenderNode::setNodeType(int type)
{
	if (this->m_nodeType == type) {
		return;
	}
	this->m_nodeType = (NodeType)type;
}

int CRenderNode::getNodeType()
{
	return (int)(this->m_nodeType);
}

    GLKVector4* CRenderNode::getContentSize()
{
	CCSize nodeSize = this->m_pRenderNode->getContentSize();
	m_contentSize->v[0] = nodeSize.width;
	m_contentSize->v[1] = nodeSize.height;
	return m_contentSize;
}

float CRenderNode::getContentSizeWidth()
{
	CCSize nodeSize = this->m_pRenderNode->getContentSize();
	return nodeSize.width;
}

float CRenderNode::getContentSizeHeight()
{
	CCSize nodeSize = this->m_pRenderNode->getContentSize();
	return nodeSize.height;
}

void CRenderNode::setTextureWithFile(const char *fileName)
{
	m_strTextureName = fileName;
	switch (this->m_nodeType) {
	case NODE_CCSPRITE:
		((cocos2d::CCSprite*)(this->m_pRenderNode))->initWithFile(fileName);
		break;
	case NODE_CLIPSPRITE:
		((CClipAbleSprite*)(this->m_pRenderNode))->initWithFile(fileName);
		break;
	case NODE_SCALE9SPRITE:
		//            ((cocos2d::extension::CCScale9Sprite*)(this->m_pRenderNode))->initWithFile(fileName);
		break;
	default:
		break;
	}
}

void CRenderNode::setScale9FileAndCapInsets(const char *fileName, float x, float y, float width, float height)
{
	if (this->m_nodeType != NODE_SCALE9SPRITE){
		return;
	}
	((cocos2d::extension::CCScale9Sprite*)(this->m_pRenderNode))->initWithFile(fileName, CCRectZero, CCRectMake(x, y, width, height));
}

void CRenderNode::setClipAble(bool able)
{
	switch (this->m_nodeType) {
	case NODE_CLIPSPRITE:
		((CClipAbleSprite*)(this->m_pRenderNode))->setClipAble(able);
		break;
	case NODE_CLIPLAYERCOLOR:
		((CClipAbleLayerColor*)(this->m_pRenderNode))->setClipAble(able);
		break;
	default:
		break;
	}
}

void CRenderNode::setClipRect(float x, float y, float width, float height)
{
	switch (this->m_nodeType) {
	case NODE_CLIPSPRITE:
		((CClipAbleSprite*)(this->m_pRenderNode))->setClipRect(x, y, width, height);
		break;
	case NODE_CLIPLAYERCOLOR:
		((CClipAbleLayerColor*)(this->m_pRenderNode))->setClipRect(x, y, width, height);
		break;
	default:
		break;
	}
}

void CRenderNode::setColorAndSize(int r, int g, int b, int o, float width, float height)
{
	switch (this->m_nodeType) {
	case NODE_CLIPLAYERCOLOR:
		((CClipAbleLayerColor*)(this->m_pRenderNode))->initWithColor(ccc4(r, g, b, o), width, height);
		break;
	default:
		break;
	}    
}

void CRenderNode::setSize(float width,float height)
{
	switch (this->m_nodeType) {
	case NODE_CLIPLAYERCOLOR:
		((CClipAbleLayerColor*)(this->m_pRenderNode))->setContentSize(CCSizeMake(width, height));
		break;
	default:
		break;
	}
}

void CRenderNode::setLabelAtlasProperty(const char *string, const char *charMapFile, int itemWidth, int itemHeight, const char* startCharMap)
{
	if (this->m_nodeType != NODE_LABELATLAS) {
		return;
	}
	((CLabelAtlas*)(this->m_pRenderNode))->setProperty(string, charMapFile, itemWidth, itemHeight, (int)(startCharMap[0]));
}
    GLKVector4* CRenderNode::convertToWorldSpace()
{
	CCPoint p = this->m_pRenderNode->convertToWorldSpace(ccp(0,0));
	this->m_worldPosition->v[0] = p.x;
	this->m_worldPosition->v[1] = p.y;
	return m_worldPosition;
}

void CRenderNode::setStringValue(const char *value)
{
	if(NULL == value || strcmp(value, "") == 0)
	{
		return;
	}
	m_strTextValue = value;

	switch (this->m_nodeType) {
	case NODE_TEXT:
	case NODE_TEXTAREA:
		((cocos2d::CCLabelTTF*)(this->m_pRenderNode))->setString(value);
		break;
	case NODE_TEXTFIELD:
		((CCTextFieldTTF*)(this->m_pRenderNode))->setString(value);
		break;
	case NODE_LABELATLAS:
		((CCLabelAtlas*)(this->m_pRenderNode))->setString(value);
		break;
	default:
		break;
	}
}

const char* CRenderNode::getStringValue()
{
	const char* res = NULL;
	switch (this->m_nodeType) {
	case NODE_TEXT:
	case NODE_TEXTAREA:
		res = ((cocos2d::CCLabelTTF*)(this->m_pRenderNode))->getString();
		break;
	case NODE_TEXTFIELD:
		res = ((CCTextFieldTTF*)(this->m_pRenderNode))->getString();
		break;
            case NODE_LABELATLAS:
                res = ((CCLabelAtlas *)(this->m_pRenderNode))->getString();
                break;
	default:
		break;
	}
	return res;
}

void CRenderNode::setTextColor(int r, int g, int b)
{
	switch (this->m_nodeType) {
	case NODE_TEXT:
	case NODE_TEXTAREA:
		((cocos2d::CCLabelTTF*)(this->m_pRenderNode))->setColor(ccc3(r, g, b));
		break;
	case NODE_TEXTFIELD:
		((CCTextFieldTTF*)(this->m_pRenderNode))->setColor(ccc3(r, g, b));
		break;
	default:
		break;
	}
}

void CRenderNode::setFontSize(float size)
{
	switch (this->m_nodeType) {
	case NODE_TEXT:
	case NODE_TEXTAREA:
		((cocos2d::CCLabelTTF*)(this->m_pRenderNode))->setFontSize(size);
		break;
	case NODE_TEXTFIELD:
		((CCTextFieldTTF*)(this->m_pRenderNode))->setFontSize(size);
		break;
	default:
		break;
	}
}
    void CRenderNode::setFontName(const char *name)
    {
        switch (this->m_nodeType)
        {
            case NODE_TEXT:
            case NODE_TEXTAREA:
                ((cocos2d::CCLabelTTF *)(this->m_pRenderNode))->setFontName(name);
                break;
            
            case NODE_TEXTFIELD:
                ((CCTextFieldTTF *)(this->m_pRenderNode))->setFontName(name);
                break;
                
            default:
                break;
        }
    }
    
void CRenderNode::setTextAreaSize(float width, float height)
{
	switch (this->m_nodeType) {
	case NODE_TEXTAREA:
		((cocos2d::CCLabelTTF*)(this->m_pRenderNode))->setDimensions(CCSizeMake(width, height));
		break;
	default:
		break;
	}
}

void CRenderNode::setTextFieldSize(float width, float height)
{
	switch (this->m_nodeType) {
	case NODE_TEXTFIELD:
		((cocos2d::CCTextFieldTTF*)(this->m_pRenderNode))->setDimensions(CCSizeMake(width, height));
		((cocos2d::CCTextFieldTTF*)(this->m_pRenderNode))->setHorizontalAlignment(kCCTextAlignmentCenter);
		((cocos2d::CCTextFieldTTF*)(this->m_pRenderNode))->setVerticalAlignment(kCCVerticalTextAlignmentCenter);
		break;
	default:
		break;
	}
}

void CRenderNode::setTextHorizontalAlignment(int alignment)
{
	switch (this->m_nodeType) {
	case NODE_TEXTAREA:
		((cocos2d::CCLabelTTF*)(this->m_pRenderNode))->setHorizontalAlignment((CCTextAlignment)alignment);
		break;
	default:
		break;
	}
}

void CRenderNode::setTextVerticalAlignment(int alignment)
{
	switch (this->m_nodeType) {
	case NODE_TEXTAREA:
		((cocos2d::CCLabelTTF*)(this->m_pRenderNode))->setVerticalAlignment((CCVerticalTextAlignment)alignment);
		break;
	default:
		break;
	}
}

void CRenderNode::setRect(float x,float y,float width,float height)
{
	if (this->m_nodeType != NODE_CCSPRITE){
		return;
	}
	((cocos2d::CCSprite*)(this->m_pRenderNode))->setTextureRect(CCRectMake(x, y, width, height));
}

void CRenderNode::openIME()
{
	if (this->m_nodeType != NODE_TEXTFIELD){
		return;
	}
	((CCTextFieldTTF*)(this->m_pRenderNode))->attachWithIME();
}

void CRenderNode::closeIME()
{
	if (this->m_nodeType != NODE_TEXTFIELD){
		return;
	}
	((CCTextFieldTTF*)(this->m_pRenderNode))->detachWithIME();
}

void CRenderNode::setPlaceHolder(const char *placeHolder)
{
	if (this->m_nodeType != NODE_TEXTFIELD){
		return;
	}
	((CCTextFieldTTF*)(this->m_pRenderNode))->setPlaceHolder(placeHolder);
}

void CRenderNode::setScale9Size(float width, float height)
{
	if (this->m_nodeType != NODE_SCALE9SPRITE){
		return;
	}
	((cocos2d::extension::CCScale9Sprite*)(this->m_pRenderNode))->setContentSize(CCSizeMake(width, height));
}

CRenderNode::CRenderNode(JSObject* obj) :
m_nodeType(NODE_NONE),
	m_bVisible(true),
	m_nOpacity(255),
	m_pos(GLKVector4Make(0.0f, 0.0f, 0.1f, 0.1f)),
	m_acPt(GLKVector4Make(0.5f, 0.5f, 0.1f, 0.1f)),
	m_size(GLKVector4Make(0.0f, 0.0f, 0.1f, 0.1f)),
	m_fScale(1.0f),
	m_fScaleX(1.0f),
	m_fScaleY(1.0f),
	m_fRotation(0.0f),
	m_nZOrder(1),
	m_pParent(NULL),
	m_pRenderNode(NULL)
{
	//    this->m_pRenderNode = cocos2d::CCNode::create();
	//    m_pRenderNode->retain();
	this->m_position = &m_pos;
	this->m_anchorPoint = &m_acPt;
	this->m_contentSize = &m_size;
	this->m_worldPosition = &m_wdPos;
	//    //test
	//    cocos2d::CCSprite* test = cocos2d::CCSprite::create("Icon-72.png");
	//    m_pRenderNode->addChild(test);
}

JSObject* CRenderNode::s_pJSObject = NULL ; 
JSClass*  CRenderNode::CJSProxyClass = NULL;

void js_CRender_finalize(JSFreeOp *fop, JSObject *obj) {
}

JSObject* CRenderNode::JSInit(JSContext *cx, JSObject *obj) 
{
	CRenderNode::CJSProxyClass = (JSClass *)calloc(1, sizeof(JSClass));
	CRenderNode::CJSProxyClass->name = "CRenderNode";
	CRenderNode::CJSProxyClass->addProperty = JS_PropertyStub;
	CRenderNode::CJSProxyClass->delProperty = JS_PropertyStub;
	CRenderNode::CJSProxyClass->getProperty = JS_PropertyStub;
	CRenderNode::CJSProxyClass->setProperty = JS_StrictPropertyStub;
	CRenderNode::CJSProxyClass->enumerate = JS_EnumerateStub;
	CRenderNode::CJSProxyClass->resolve = JS_ResolveStub;
	CRenderNode::CJSProxyClass->convert = JS_ConvertStub;
	CRenderNode::CJSProxyClass->finalize = js_CRender_finalize;
	CRenderNode::CJSProxyClass->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	CRenderNode::s_pJSObject = JS_InitClass(
		cx, obj, 
		NULL, 
		CRenderNode::CJSProxyClass, 
		CRenderNode::JSConstructor, 0, 
		CRenderNode::s_arrJSProperties, 
		CRenderNode::s_arrJSMethods, 
		NULL, 
		st_funcs) ;

	JSBool found;
	JS_SetPropertyAttributes(cx, obj, "CRenderNode", JSPROP_ENUMERATE | JSPROP_READONLY, &found);

	// add the proto and JSClass to the type->js info hash table
	TypeTest<CRenderNode> t;
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	if (!p) {
		p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
		p->type = typeId;
		p->jsclass = CRenderNode::CJSProxyClass;
		p->proto = CRenderNode::s_pJSObject;
		p->parentProto = NULL;
		HASH_ADD_INT(_js_global_type_ht, type, p);
	}

	return CRenderNode::s_pJSObject ; 
}

JSBool CRenderNode::JSConstructor(JSContext* cx, uint32_t argc, jsval* vp)
{
	if (argc == 0) {
		CRenderNode* cobj = new CRenderNode();
#ifdef COCOS2D_JAVASCRIPT
		cocos2d::CCObject *_ccobj = dynamic_cast<cocos2d::CCObject *>(cobj);
		if (_ccobj) {
			_ccobj->autorelease();
		}
#endif
		TypeTest<CRenderNode> t;
		js_type_class_t *typeClass;
		uint32_t typeId = t.s_id();
		HASH_FIND_INT(_js_global_type_ht, &typeId, typeClass);
		assert(typeClass);
		JSObject *obj = JS_NewObject(cx, typeClass->jsclass, typeClass->proto, typeClass->parentProto);
		JS_SET_RVAL(cx, vp, OBJECT_TO_JSVAL(obj));
		// link the native object with the javascript object
		js_proxy_t *p;
		JS_NEW_PROXY(p, cobj, obj);
#ifdef COCOS2D_JAVASCRIPT
		JS_AddNamedObjectRoot(cx, &p->obj, "CRenderNode");
#endif
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_TRUE;
}

JSBool CRenderNode::initNode( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double dp;
	JS_ValueToNumber(cx, argv[ 0 ], &dp);
	int nodeType = (int)dp;
	p->initNode( nodeType );
	return JS_TRUE;
}
JSBool CRenderNode::addRenderNode( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	JSObject* pObj = JSVAL_TO_OBJECT( argv[ 0 ] );
	js_proxy_t *proxy1; JS_GET_NATIVE_PROXY(proxy1, pObj);
	CRenderNode* node = (CRenderNode *)(proxy1 ? proxy1->ptr : NULL);
	bool b = p->addRenderNode( node );
	jsval rval = BOOLEAN_TO_JSVAL( b );
	JS_SET_RVAL(cx, vp, rval);
	return JS_TRUE;
}
JSBool CRenderNode::removeRenderNodeAndCleanUp( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	JSObject* pObj = JSVAL_TO_OBJECT( argv[ 0 ] );
	js_proxy_t *proxy1; JS_GET_NATIVE_PROXY(proxy1, pObj);
	CRenderNode* node = (CRenderNode *)(proxy1 ? proxy1->ptr : NULL);
	bool cleanUp = JSVAL_TO_BOOLEAN( argv[ 1 ] );
	bool b = p->removeRenderNodeAndCleanUp( node, cleanUp );
	jsval rval = BOOLEAN_TO_JSVAL( b );
	JS_SET_RVAL(cx, vp, rval);
	return JS_TRUE;
}
JSBool CRenderNode::removeAllRenderNodeAndCleanUp( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	bool cleanUp = JSVAL_TO_BOOLEAN( argv[ 0 ] );
	bool b = p->removeAllRenderNodeAndCleanUp( cleanUp );
	jsval rval = BOOLEAN_TO_JSVAL( b );
	JS_SET_RVAL(cx, vp, rval);
	return JS_TRUE;
}
JSBool CRenderNode::removeFromParentAndCleanUp( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	bool cleanUp = JSVAL_TO_BOOLEAN( argv[ 0 ] );
	bool b = p->removeFromParentAndCleanUp( cleanUp );
	jsval rval = BOOLEAN_TO_JSVAL( b );
	JS_SET_RVAL(cx, vp, rval);
	return JS_TRUE;
}
JSBool CRenderNode::setVisible( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	bool visible = JSVAL_TO_BOOLEAN( argv[ 0 ] );
	p->setVisible( visible );
	return JS_TRUE;
}
JSBool CRenderNode::getVisible( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	bool b = p->getVisible();
	jsval rval = BOOLEAN_TO_JSVAL( b );
	JS_SET_RVAL(cx, vp, rval);
	return JS_TRUE;
}
JSBool CRenderNode::setOpacity( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	bool opacity = JSVAL_TO_BOOLEAN( argv[ 0 ] );
	p->setOpacity( opacity );
	return JS_TRUE;
}
JSBool CRenderNode::getOpacity( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	int n = p->getOpacity();
	jsval rval = UINT_TO_JSVAL( n );
	JS_SET_RVAL(cx, vp, rval);
	return JS_TRUE;
}
JSBool CRenderNode::setPosition( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);

	JSObject *tmp;
	jsval jsx, jsy;
	double x, y;
	JSBool ok = JS_ValueToObject(cx, argv[ 0 ], &tmp) &&
		JS_GetProperty(cx, tmp, "x", &jsx) &&
		JS_GetProperty(cx, tmp, "y", &jsy) &&
		JS_ValueToNumber(cx, jsx, &x) &&
		JS_ValueToNumber(cx, jsy, &y);
	if ( ok )
	{
		GLKVector4 pos;
		pos.setX( x );
		pos.setY( y );
		p->setPosition( &pos );
	}

	return JS_TRUE;
}
JSBool CRenderNode::setPositionXY( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double dx, dy;
	JS_ValueToNumber(cx, argv[ 0 ], &dx);
	JS_ValueToNumber(cx, argv[ 1 ], &dy);
	p->setPositionXY( (float)dx, (float)dy );
	return JS_TRUE;
}
JSBool CRenderNode::getPosition( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);

	GLKVector4* pos = p->getPosition();

	JSObject *tmp = JS_NewObject(cx, NULL, NULL, NULL);

	JSBool ok = JS_DefineProperty(cx, tmp, "x", DOUBLE_TO_JSVAL(pos->getX()), NULL, NULL, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
		JS_DefineProperty(cx, tmp, "y", DOUBLE_TO_JSVAL(pos->getY()), NULL, NULL, JSPROP_ENUMERATE | JSPROP_PERMANENT);
	if (ok) {
		jsval rval = OBJECT_TO_JSVAL(tmp);
		JS_SET_RVAL(cx, vp, rval);
	}

	return JS_TRUE;
}
JSBool CRenderNode::setAnchorPoint( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	JSObject *tmp;
	jsval jsx, jsy;
	double x, y;
	JSBool ok = JS_ValueToObject(cx, argv[ 0 ], &tmp) &&
		JS_GetProperty(cx, tmp, "x", &jsx) &&
		JS_GetProperty(cx, tmp, "y", &jsy) &&
		JS_ValueToNumber(cx, jsx, &x) &&
		JS_ValueToNumber(cx, jsy, &y);
	if ( ok )
	{
		GLKVector4 pos;
		pos.setX( x );
		pos.setY( y );
		p->setAnchorPoint( &pos );
	}
	return JS_TRUE;
}
JSBool CRenderNode::setAnchorPointXY( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double dx, dy;
	JS_ValueToNumber(cx, argv[ 0 ], &dx);
	JS_ValueToNumber(cx, argv[ 1 ], &dy);
	p->setAnchorPointXY( (float)dx, (float)dy );
	return JS_TRUE;
}
JSBool CRenderNode::getAnchorPoint( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	GLKVector4* pos = p->getAnchorPoint();

	JSObject *tmp = JS_NewObject(cx, NULL, NULL, NULL);

	JSBool ok = JS_DefineProperty(cx, tmp, "x", DOUBLE_TO_JSVAL(pos->getX()), NULL, NULL, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
		JS_DefineProperty(cx, tmp, "y", DOUBLE_TO_JSVAL(pos->getY()), NULL, NULL, JSPROP_ENUMERATE | JSPROP_PERMANENT);
	if (ok) {
		jsval rval = OBJECT_TO_JSVAL(tmp);
		JS_SET_RVAL(cx, vp, rval);
	}
	return JS_TRUE;
}
JSBool CRenderNode::setZOrder( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	int z = JSVAL_TO_INT( argv[ 0 ] );
	p->setZOrder( z );
	return JS_TRUE;
}
JSBool CRenderNode::getZOrder( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	int z = p->getZOrder();
	jsval rval = INT_TO_JSVAL(z);
	JS_SET_RVAL(cx, vp, rval);
	return JS_TRUE;
}
JSBool CRenderNode::setNodeType( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	int type = JSVAL_TO_INT( argv[ 0 ] );
	p->setNodeType( type );
	return JS_TRUE;
}
JSBool CRenderNode::getNodeType( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	int z = p->getNodeType();
	jsval rval = INT_TO_JSVAL(z);
	JS_SET_RVAL(cx, vp, rval);
	return JS_TRUE;
}
JSBool CRenderNode::getContentSize( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	GLKVector4* pos = p->getContentSize();

	JSObject *tmp = JS_NewObject(cx, NULL, NULL, NULL);

	JSBool ok = JS_DefineProperty(cx, tmp, "x", DOUBLE_TO_JSVAL(pos->getX()), NULL, NULL, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
		JS_DefineProperty(cx, tmp, "y", DOUBLE_TO_JSVAL(pos->getY()), NULL, NULL, JSPROP_ENUMERATE | JSPROP_PERMANENT);
	if (ok) {
		jsval rval = OBJECT_TO_JSVAL(tmp);
		JS_SET_RVAL(cx, vp, rval);
	}
	return JS_TRUE;
}
JSBool CRenderNode::getContentSizeWidth( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	float f = p->getContentSizeWidth();
	jsval rval = DOUBLE_TO_JSVAL(f);
	JS_SET_RVAL(cx, vp, rval);
	return JS_TRUE;
}
JSBool CRenderNode::getContentSizeHeight( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	float f = p->getContentSizeHeight();
	jsval rval = DOUBLE_TO_JSVAL(f);
	JS_SET_RVAL(cx, vp, rval);
	return JS_TRUE;
}
JSBool CRenderNode::setScale( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double d;
	JS_ValueToNumber(cx, argv[ 0 ], &d);
	p->setScale( (float)d );
	return JS_TRUE;
}
JSBool CRenderNode::setScaleX( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double d;
	JS_ValueToNumber(cx, argv[ 0 ], &d);
	p->setScaleX( (float)d );
	return JS_TRUE;
}
JSBool CRenderNode::setScaleY( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double d;
	JS_ValueToNumber(cx, argv[ 0 ], &d);
	p->setScaleY( (float)d );
	return JS_TRUE;
}
JSBool CRenderNode::setFlipX( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	bool b = JSVAL_TO_BOOLEAN( argv[ 0 ] );
	p->setFlipX( b );
	return JS_TRUE;
}
JSBool CRenderNode::setFlipY( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	bool b = JSVAL_TO_BOOLEAN( argv[ 0 ] );
	p->setFlipY( b );
	return JS_TRUE;
}
JSBool CRenderNode::setRotation( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double d;
	JS_ValueToNumber(cx, argv[ 0 ], &d);
	p->setRotation( (float)d );
	return JS_TRUE;
}
JSBool CRenderNode::getRotation( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	float f = p->getRotation();
	jsval rval = DOUBLE_TO_JSVAL(f);
	JS_SET_RVAL(cx, vp, rval);
	return JS_TRUE;
}

JSBool CRenderNode::setTextureWithFile( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	JSString *tmp = JS_ValueToString(cx, argv[ 0 ]);
	char* str = JS_EncodeString(cx, tmp);
	p->setTextureWithFile( str );
	JS_free( cx, str );
	return JS_TRUE;
}
JSBool CRenderNode::setStringValue( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	JSString *tmp = JS_ValueToString(cx, argv[ 0 ]);
	char* str = JS_EncodeString(cx, tmp);
	p->setStringValue( str );
	JS_free( cx, str );
	return JS_TRUE;
}
JSBool CRenderNode::setFontSize( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double d;
	JS_ValueToNumber(cx, argv[ 0 ], &d);
	p->setFontSize( (float)d );
	return JS_TRUE;
}
JSBool CRenderNode::setFontName( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	JSString *tmp = JS_ValueToString(cx, argv[ 0 ]);
	char* str = JS_EncodeString(cx, tmp);
	p->setFontName( str );
	JS_free( cx, str );
	return JS_TRUE;
}
JSBool CRenderNode::setTextColor( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double r, g, b;
	JS_ValueToNumber(cx, argv[ 0 ], &r);
	JS_ValueToNumber(cx, argv[ 1 ], &g);
	JS_ValueToNumber(cx, argv[ 2 ], &b);
	p->setTextColor( (float)r, (float)g, (float)b );
	return JS_TRUE;
}
JSBool CRenderNode::setRect( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double x, y, w, h;
	JS_ValueToNumber(cx, argv[ 0 ], &x);
	JS_ValueToNumber(cx, argv[ 1 ], &y);
	JS_ValueToNumber(cx, argv[ 2 ], &w);
	JS_ValueToNumber(cx, argv[ 3 ], &h);
	p->setRect( (float)x, (float)y, (float)w, (float)h );
	return JS_TRUE;
}
JSBool CRenderNode::openIME( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	p->openIME();
	return JS_TRUE;
}
JSBool CRenderNode::closeIME( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	p->closeIME();
	return JS_TRUE;
}
JSBool CRenderNode::setPlaceHolder( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	JSString *tmp = JS_ValueToString(cx, argv[ 0 ]);
	char* str = JS_EncodeString(cx, tmp);
	p->setPlaceHolder( str );
	JS_free( cx, str );
	return JS_TRUE;
}
JSBool CRenderNode::getStringValue( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	const char* str = p->getStringValue();
	jsval rval = STRING_TO_JSVAL( JS_NewStringCopyZ( cx, str ) );
	JS_SET_RVAL(cx, vp, rval);
	return JS_TRUE;
}
JSBool CRenderNode::setTextFieldSize( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double w, h;
	JS_ValueToNumber(cx, argv[ 0 ], &w);
	JS_ValueToNumber(cx, argv[ 1 ], &h);
	p->setTextFieldSize( (float)w, (float)h );
	return JS_TRUE;
}
JSBool CRenderNode::setClipAble( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	bool b = JSVAL_TO_BOOLEAN( argv[ 0 ] );
	p->setClipAble( b );
	return JS_TRUE;
}
JSBool CRenderNode::setClipRect( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double x, y, w, h;
	JS_ValueToNumber(cx, argv[ 0 ], &x);
	JS_ValueToNumber(cx, argv[ 1 ], &y);
	JS_ValueToNumber(cx, argv[ 2 ], &w);
	JS_ValueToNumber(cx, argv[ 3 ], &h);
	p->setClipRect( (float)x, (float)y, (float)w, (float)h );
	return JS_TRUE;
}
JSBool CRenderNode::setColorAndSize( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double r, g, b, o, w, h;
	JS_ValueToNumber(cx, argv[ 0 ], &r);
	JS_ValueToNumber(cx, argv[ 1 ], &g);
	JS_ValueToNumber(cx, argv[ 2 ], &b);
	JS_ValueToNumber(cx, argv[ 3 ], &o);
	JS_ValueToNumber(cx, argv[ 4 ], &w);
	JS_ValueToNumber(cx, argv[ 5 ], &h);
	p->setColorAndSize( (float)r, (float)g, (float)b, (float)o, (float)w, (float)h );
	return JS_TRUE;
}
JSBool CRenderNode::setSize( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double w, h;
	JS_ValueToNumber(cx, argv[ 0 ], &w);
	JS_ValueToNumber(cx, argv[ 1 ], &h);
	p->setSize( (float)w, (float)h );
	return JS_TRUE;
}
JSBool CRenderNode::convertToWorldSpace( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	GLKVector4* pos = p->convertToWorldSpace();

	JSObject *tmp = JS_NewObject(cx, NULL, NULL, NULL);

	JSBool ok = JS_DefineProperty(cx, tmp, "x", DOUBLE_TO_JSVAL(pos->getX()), NULL, NULL, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
		JS_DefineProperty(cx, tmp, "y", DOUBLE_TO_JSVAL(pos->getY()), NULL, NULL, JSPROP_ENUMERATE | JSPROP_PERMANENT);
	if (ok) {
		jsval rval = OBJECT_TO_JSVAL(tmp);
		JS_SET_RVAL(cx, vp, rval);
	}
	return JS_TRUE;
}
JSBool CRenderNode::setLabelAtlasProperty( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	JSString* str1 = JS_ValueToString( cx, argv[ 0 ] );
	char *string = JS_EncodeString(cx, str1);
	JSString* str2 = JS_ValueToString( cx, argv[ 1 ] );
	char *charMapFile = JS_EncodeString(cx, str1);
	double w, h;
	JS_ValueToNumber(cx, argv[ 2 ], &w);
	JS_ValueToNumber(cx, argv[ 3 ], &h);
	JSString* str3 = JS_ValueToString( cx, argv[ 4 ] );
	char *startCharMap = JS_EncodeString(cx, str3);
	p->setLabelAtlasProperty( string, charMapFile, w, h, startCharMap );
	JS_free( cx, string);
	JS_free( cx, charMapFile );
	JS_free( cx, startCharMap );
	return JS_TRUE;
}
JSBool CRenderNode::setScale9Size( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double w, h;
	JS_ValueToNumber(cx, argv[ 0 ], &w);
	JS_ValueToNumber(cx, argv[ 1 ], &h);
	p->setScale9Size( (float)w, (float)h );
	return JS_TRUE;
}
JSBool CRenderNode::setScale9FileAndCapInsets( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	JSString* str1 = JS_ValueToString( cx, argv[ 0 ] );
	char *fileName = JS_EncodeString(cx, str1);
	double x, y, w, h;
	JS_ValueToNumber(cx, argv[ 1 ], &x);
	JS_ValueToNumber(cx, argv[ 2 ], &y);
	JS_ValueToNumber(cx, argv[ 3 ], &w);
	JS_ValueToNumber(cx, argv[ 4 ], &h);
	p->setScale9FileAndCapInsets( fileName, (float)x, (float)y, (float)w, (float)h );
	JS_free( cx, fileName );
	return JS_TRUE;
}
JSBool CRenderNode::setTextAreaSize( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double w, h;
	JS_ValueToNumber(cx, argv[ 0 ], &w);
	JS_ValueToNumber(cx, argv[ 1 ], &h);
	p->setTextAreaSize( (float)w, (float)h );
	return JS_TRUE;
}
JSBool CRenderNode::setTextHorizontalAlignment( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double a;
	JS_ValueToNumber( cx, argv[ 0 ], &a );
	p->setTextHorizontalAlignment( (int)a );
	return JS_TRUE;
}
JSBool CRenderNode::setTextVerticalAlignment( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	jsval* argv = JS_ARGV(cx, vp);
	double a;
	JS_ValueToNumber( cx, argv[0], &a );
	p->setTextVerticalAlignment( (int)a );
	return JS_TRUE;
}

JSBool CRenderNode::getRenderNode( JSContext* cx, uint32_t argc, jsval* vp )
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	CRenderNode* p = (CRenderNode *)(proxy ? proxy->ptr : NULL);
	cocos2d::CCNode* ret = p->getRenderNode();
	jsval jsret;
	do {
		if (ret) {
			js_proxy_t *proxy = js_get_or_create_proxy<cocos2d::CCNode>(cx, ret);
			jsret = OBJECT_TO_JSVAL(proxy->obj);
		} else {
			jsret = JSVAL_NULL;
		}
	} while (0);
	JS_SET_RVAL(cx, vp, jsret);
	return JS_TRUE;
}

JSFunctionSpec CRenderNode::st_funcs[] = { 
	JS_FS_END 
};

JSPropertySpec CRenderNode::s_arrJSProperties[] = {
	{0, 0, 0, 0, 0}
};

JSFunctionSpec CRenderNode::s_arrJSMethods[] = {
	JS_FN( "initNode", CRenderNode::initNode, 1, 0 ),
	JS_FN( "addRenderNode", CRenderNode::addRenderNode, 1, 0 ),
	JS_FN( "removeRenderNodeAndCleanUp", CRenderNode::removeRenderNodeAndCleanUp, 2, 0 ),
	JS_FN( "removeAllRenderNodeAndCleanUp", CRenderNode::removeAllRenderNodeAndCleanUp, 1, 0 ),
	JS_FN( "removeFromParentAndCleanUp", CRenderNode::removeFromParentAndCleanUp, 1, 0 ),
	JS_FN( "setVisible", CRenderNode::setVisible, 1, 0 ),
	JS_FN( "getVisible", CRenderNode::getVisible, 0, 0 ),
	JS_FN( "setOpacity", CRenderNode::setOpacity, 1, 0 ),
	JS_FN( "getOpacity", CRenderNode::getOpacity, 0, 0 ),
	JS_FN( "setPosition", CRenderNode::setPosition, 1, 0 ),
	JS_FN( "setPositionXY", CRenderNode::setPositionXY, 2, 0 ),
	JS_FN( "getPosition", CRenderNode::getPosition, 0, 0 ),
	JS_FN( "setAnchorPoint", CRenderNode::setAnchorPoint, 1, 0 ),
	JS_FN( "setAnchorPointXY", CRenderNode::setAnchorPointXY, 2, 0 ),
	JS_FN( "getAnchorPoint", CRenderNode::getAnchorPoint, 0, 0 ),
	JS_FN( "getContentSize", CRenderNode::getContentSize, 0, 0 ),
	JS_FN( "getContentSizeWidth", CRenderNode::getContentSizeWidth, 0, 0 ),
	JS_FN( "getContentSizeHeight", CRenderNode::getContentSizeHeight, 0, 0 ),
	JS_FN( "setZOrder", CRenderNode::setZOrder, 1, 0 ),
	JS_FN( "getZOrder", CRenderNode::getZOrder, 0, 0 ),
	JS_FN( "setNodeType", CRenderNode::setNodeType, 1, 0 ),
	JS_FN( "getNodeType", CRenderNode::getNodeType, 0, 0 ),
	JS_FN( "setTextureWithFile", CRenderNode::setTextureWithFile, 1, 0 ),
	JS_FN( "setStringValue", CRenderNode::setStringValue, 1, 0 ),
	JS_FN( "getStringValue", CRenderNode::getStringValue, 0, 0),
	JS_FN( "setFontSize", CRenderNode::setFontSize, 1, 0 ),
	JS_FN( "setFontName", CRenderNode::setFontName, 1, 0 ),
	JS_FN( "setScale", CRenderNode::setScale, 1, 0 ),
	JS_FN( "setScaleX", CRenderNode::setScaleX, 1, 0 ),
	JS_FN( "setScaleY", CRenderNode::setScaleY, 1, 0 ),
	JS_FN( "setTextColor", CRenderNode::setTextColor, 3, 0 ),
	JS_FN( "setRect", CRenderNode::setRect, 4, 0 ),
	JS_FN( "setFlipX", CRenderNode::setFlipX, 1, 0 ),
	JS_FN( "setFlipY", CRenderNode::setFlipY, 1, 0 ),
	JS_FN( "setRotation", CRenderNode::setRotation, 1, 0 ),
	JS_FN( "getRotation", CRenderNode::getRotation, 0, 0 ),
	//textfield
	JS_FN( "openIME", CRenderNode::openIME, 0, 0 ),
	JS_FN( "closeIME", CRenderNode::closeIME, 0, 0 ),
	JS_FN( "setPlaceHolder", CRenderNode::setPlaceHolder, 1, 0 ),
	JS_FN( "setTextFieldSize", CRenderNode::setTextFieldSize, 2, 0 ),
	//clipSprite
	JS_FN( "setClipAble", CRenderNode::setClipAble, 1, 0 ),
	JS_FN( "setClipRect", CRenderNode::setClipRect, 4, 0 ),
	//cliplayercolor
	JS_FN( "setColorAndSize", CRenderNode::setColorAndSize, 6, 0 ),
	JS_FN( "setSize", CRenderNode::setSize, 2, 0 ),
	JS_FN( "convertToWorldSpace", CRenderNode::convertToWorldSpace, 0, 0 ),
	//clabelatlas
	JS_FN( "setLabelAtlasProperty", CRenderNode::setLabelAtlasProperty, 5, 0 ),
	//scale9sprite
	JS_FN( "setScale9Size", CRenderNode::setScale9Size, 2, 0 ),
	JS_FN( "setScale9FileAndCapInsets", CRenderNode::setScale9FileAndCapInsets,5, 0 ),
	//textarea
	JS_FN( "setTextAreaSize", CRenderNode::setTextAreaSize, 2, 0 ),
	JS_FN( "setTextHorizontalAlignment", CRenderNode::setTextHorizontalAlignment, 1, 0 ),
	JS_FN( "setTextVerticalAlignment", CRenderNode::setTextVerticalAlignment, 1, 0 ),
	JS_FN( "getRenderNode", CRenderNode::getRenderNode, 1, 0 ),
	JS_FS_END 
};

}