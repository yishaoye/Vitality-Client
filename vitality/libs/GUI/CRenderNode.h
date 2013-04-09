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

#ifndef SPII_CRenderNode_h
#define SPII_CRenderNode_h
#include "cocos2d.h"
#include "SPJSManager.h"

//#include "SPMath.h"
//#include "SPGameObject.h"
#include <vector>


namespace sp {

	class GLKVector4
	{
	public:
		float v[4];
		GLKVector4(JSObject* obj) {}
		GLKVector4()
		{
			//CREATE_JS_OBJECT(GLKVector4)
		}

		virtual ~GLKVector4()
		{
		}
		double getX()
		{
			return (double)v[0];
		}
		void setX(double value)
		{
			v[0] = (float)value;
		}

		double getY()
		{
			return v[1];
		}
		void setY(double value)
		{
			v[1] = value;
		}

		double getZ()
		{
			return v[2];
		}
		void setZ(double value)
		{
			v[2] = value;
		}

		double getW()
		{
			return v[3];
		}
		void setW(double value)
		{
			v[3] = value;
		}

	} ;

	static inline GLKVector4 GLKVector4Make(float x, float y, float z, float w)
	{
		GLKVector4 v ;
		v.v[0] = x;
		v.v[1] = y;
		v.v[2] = z;
		v.v[3] = w;
		return v;
	}


	typedef enum{
		NODE_NONE,//0
		NODE_CCNODE,//1
		NODE_CCSPRITE,//2
		NODE_CCLAYER,//3
		NODE_CCCOLORLAYER,//4
		NODE_TEXT,//5
		//Special
		NODE_TEXTFIELD,//6
		NODE_CLIPSPRITE,//7
		NODE_CLIPLAYERCOLOR,//8
        NODE_LABELATLAS,//9
        NODE_SCALE9SPRITE,//10
        NODE_TEXTAREA,//11
        NODE_EDITBOX//12
    } NodeType;

	class CRenderNode{
	public:
		CRenderNode();
		virtual ~CRenderNode();

		bool addRenderNode(CRenderNode* node);
		bool removeRenderNodeAndCleanUp(CRenderNode* node,bool cleanUp);
		bool removeAllRenderNodeAndCleanUp(bool cleanUp);
		bool removeFromParentAndCleanUp(bool cleanUp);
		//cocos property
		virtual void setVisible(bool visible);
		virtual bool getVisible();
		virtual void setOpacity(int opacity);
		virtual int getOpacity();
		virtual void setScale(float scale);
		virtual void setScaleX(float scaleX);
		virtual void setScaleY(float scaleY);
		virtual void setFlipX(bool flipX);
		virtual void setFlipY(bool filipY);
		virtual void setRotation(float rotation);
		virtual float getRotation();
        virtual void setPosition(GLKVector4*);
        virtual void setPositionXY(float x,float y);
        virtual GLKVector4* getPosition();
        virtual void setAnchorPoint(GLKVector4*);
        virtual void setAnchorPointXY(float x,float y);
        virtual GLKVector4* getAnchorPoint();
        virtual void setZOrder(int z);
        virtual int getZOrder();
        virtual void setNodeType(int type);
        virtual int getNodeType();
        virtual GLKVector4* getContentSize();
		virtual float getContentSizeWidth();
		virtual float getContentSizeHeight();

		virtual void initNode(int nodeType);




		//ccsprite
		virtual void setTextureWithFile(const char* fileName);
		virtual void setRect(float x,float y,float width,float height);
		//cclabel
		virtual void setStringValue(const char* value);
        virtual const char* getStringValue();
		virtual void setTextColor(int r,int g,int b);
		virtual void setFontSize(float size);
        virtual void setFontName(const char *name);
		//cctextfield
		virtual void openIME();
		virtual void closeIME();
        virtual void setPlaceHolder(const char* placeHolder);
        virtual void setTextFieldSize(float width,float height);
		//clipsprite
		virtual void setClipAble(bool able);
		virtual void setClipRect(float x,float y,float width,float height);
		//cliplayercolor
		virtual void setColorAndSize(int r,int g,int b,int o,float width,float height);
                virtual void setSize(float width,float height);
        virtual GLKVector4* convertToWorldSpace();
        //cclabelatlas
        virtual void setLabelAtlasProperty(const char *string, const char *charMapFile,  int itemWidth,  int itemHeight,  const char* startCharMap);
        //scale9sprite
        virtual void setScale9Size(float width,float height);
        virtual void setScale9FileAndCapInsets(const char* fileName,float x,float y,float width,float height);
        //textarea
        void setTextAreaSize(float width,float height);
        void setTextHorizontalAlignment(int alignment);
        void setTextVerticalAlignment(int alignment);

		virtual cocos2d::CCNode* getRenderNode();
		virtual void setParent(CRenderNode* parent);
		virtual CRenderNode* getParent();
	protected:
		cocos2d::CCNode* m_pRenderNode;
		CRenderNode* m_pParent;
		std::vector<CRenderNode*> m_children;
		NodeType m_nodeType;

		//ccsprite
		std::string m_strTextureName;
		//cclabel
		std::string m_strTextValue;


		//cocos property
		bool m_bVisible;
		int m_nOpacity;
		float m_fScaleX;
		float m_fScaleY;
		float m_fScale;
		bool m_bFlipX;
		bool m_bFlipY;
		float m_fRotation;

        GLKVector4* m_position;
        GLKVector4* m_anchorPoint;
        GLKVector4 m_pos;
        GLKVector4 m_acPt;
        GLKVector4* m_contentSize;
        GLKVector4 m_size;
        GLKVector4* m_worldPosition;
        GLKVector4 m_wdPos;

		int m_nZOrder;

	public:
		JSObject* m_pJSObject ; 
		static JSObject* s_pJSObject ; 
		static JSClass* CJSProxyClass ; 
		static JSPropertySpec s_arrJSProperties[] ; 
		static JSFunctionSpec s_arrJSMethods[] ; 
		static JSFunctionSpec st_funcs[] ; 
	public:
		CRenderNode( JSObject* pObj );
		static JSObject* JSInit(JSContext *cx, JSObject *obj) ; 
		static JSBool JSConstructor( JSContext* cx, uint32_t argc, jsval* vp ) ;

		static JSBool initNode( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool addRenderNode( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool removeRenderNodeAndCleanUp( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool removeAllRenderNodeAndCleanUp( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool removeFromParentAndCleanUp( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setVisible( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool getVisible( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setOpacity( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool getOpacity( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setPosition( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setPositionXY( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool getPosition( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setAnchorPoint( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setAnchorPointXY( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool getAnchorPoint( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setZOrder( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool getZOrder( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setNodeType( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool getNodeType( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool getContentSize( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool getContentSizeWidth( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool getContentSizeHeight( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setScale( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setScaleX( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setScaleY( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setFlipX( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setFlipY( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setRotation( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool getRotation( JSContext* cx, uint32_t argc, jsval* vp );

		static JSBool setTextureWithFile( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setStringValue( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setFontSize( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setFontName( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setTextColor( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setRect( JSContext* cx, uint32_t argc, jsval* vp );
		//textfield
		static JSBool openIME( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool closeIME( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setPlaceHolder( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool getStringValue( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setTextFieldSize( JSContext* cx, uint32_t argc, jsval* vp );
		//clipsprite
		static JSBool setClipAble( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setClipRect( JSContext* cx, uint32_t argc, jsval* vp );
		//cliplayercolor
		static JSBool setColorAndSize( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool setSize( JSContext* cx, uint32_t argc, jsval* vp );
		static JSBool convertToWorldSpace( JSContext* cx, uint32_t argc, jsval* vp );
        //clabelatlas
        static JSBool setLabelAtlasProperty( JSContext* cx, uint32_t argc, jsval* vp );
        //scale9sprite
        static JSBool setScale9Size( JSContext* cx, uint32_t argc, jsval* vp );
        static JSBool setScale9FileAndCapInsets( JSContext* cx, uint32_t argc, jsval* vp );
        //textarea
        static JSBool setTextAreaSize( JSContext* cx, uint32_t argc, jsval* vp );
        static JSBool setTextHorizontalAlignment( JSContext* cx, uint32_t argc, jsval* vp );
        static JSBool setTextVerticalAlignment( JSContext* cx, uint32_t argc, jsval* vp );

        static JSBool getRenderNode( JSContext* cx, uint32_t argc, jsval* vp );
	};

}

#endif
