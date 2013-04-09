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

#include "CLabelAtlas.h"

using namespace cocos2d;

namespace sp {
    
    CLabelAtlas::CLabelAtlas()
    {
        
    }
    
    CLabelAtlas::~CLabelAtlas()
    {
        
    }
    
    CLabelAtlas* CLabelAtlas::create()
    {
        // && pRet->initWithString(string, charMapFile, itemWidth, itemHeight, startCharMap)
        CLabelAtlas *pRet = new CLabelAtlas();
        if(pRet)
        {
            //        pRet->initWithString("122223.12", "gui/New/labelatlasimg.png", 12, 32, '.');
            pRet->autorelease();
            return pRet;
        }
        CC_SAFE_DELETE(pRet);
        
        return NULL;
    }
    
    void CLabelAtlas::setProperty(const char *string, const char *charMapFile, unsigned int itemWidth, unsigned int itemHeight, unsigned int startCharMap)
    {
        this->initWithString(string, charMapFile, itemWidth, itemHeight, startCharMap);
    }

}
