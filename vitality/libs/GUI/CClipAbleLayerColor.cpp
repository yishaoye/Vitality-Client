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

#include "CClipAbleLayerColor.h"

using namespace cocos2d;

namespace sp {
    
    CClipAbleLayerColor* CClipAbleLayerColor::create(ccColor4B color, float width, float height){
        CClipAbleLayerColor * pLayer = new CClipAbleLayerColor();
        if( pLayer && pLayer->initWithColor(color,width,height))
        {
            pLayer->autorelease();
            return pLayer;
        }
        CC_SAFE_DELETE(pLayer);
        return NULL;
    }
    
    CClipAbleLayerColor* CClipAbleLayerColor::create(){
        CClipAbleLayerColor * pLayer = new CClipAbleLayerColor();
        if( pLayer && pLayer->init())
        {
            pLayer->autorelease();
            return pLayer;
        }
        CC_SAFE_DELETE(pLayer);
        return NULL;
    }
    
    void CClipAbleLayerColor::visit(){
        if (this->m_bClipAble) {
            glEnable(GL_SCISSOR_TEST);
            CCPoint local = this->convertToWorldSpace(ccp(0,0));
            CCPoint p = this->getPosition();
            CCSize s = this->getContentSize();
            CCEGLView::sharedOpenGLView()->setScissorInPoints(local.x, local.y, s.width, s.height);
            CCLayerColor::visit();
            glDisable(GL_SCISSOR_TEST);
        }else {
            CCLayerColor::visit();
        }
    }
    
    void CClipAbleLayerColor::setClipAble(bool able){
        this->m_bClipAble = able;
    }
    
    void CClipAbleLayerColor::setClipRect(float x, float y, float width, float height){
        
    }

}
