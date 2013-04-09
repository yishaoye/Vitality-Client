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

#include "SPJSManager.h"
#include "SPJSProcess.h"
#include "cocos2d.h"
#include "CRenderNode.h"

namespace SP_JSBind
{

	bool  ExecuteJSFunctionFromName( const char* strFunction )
	{
		JSContext *cx = CJSManager::Instance()->GetContext();
		JSObject* pJSObject = CJSManager::Instance()->GetCallbackObj();
		if (pJSObject) {
			JSBool hasMethod;
			JS_HasProperty(cx, pJSObject, strFunction, &hasMethod);
			if (hasMethod == JS_TRUE) {
				jsval callback, rval;
				JS_GetProperty(cx, pJSObject, strFunction, &callback);
				JS_CallFunctionValue(cx, pJSObject, callback, 0, 0, &rval);
				return true;
			}
		}
		return false;
	}

	bool  ExecuteJSFunctionFromName( const char* strFunction, uint32_t argc, jsval *argv )
	{
		JSContext *cx = CJSManager::Instance()->GetContext();
		JSObject* pJSObject = CJSManager::Instance()->GetCallbackObj();
		if (pJSObject) {
			JSBool hasMethod;
			JS_HasProperty(cx, pJSObject, strFunction, &hasMethod);
			if (hasMethod == JS_TRUE) {
				jsval callback, rval;
				JS_GetProperty(cx, pJSObject, strFunction, &callback);
				JS_CallFunctionValue(cx, pJSObject, callback, argc, argv, &rval);
				return true;
			}
		}
		return false;
	}
    
    CJSManager* CJSManager::s_pManager = NULL ;

	CJSManager::CJSManager()
	{

	}

	CJSManager::~CJSManager()
	{

	}

	CJSManager* CJSManager::Instance()
	{
		if (NULL == s_pManager)
		{
			s_pManager = new CJSManager() ;
		}

		return s_pManager ;
	}

	void CJSManager::InitJSManager( JSContext* cx, JSObject* obj )
	{
		CJSManager::Instance()->init( cx, obj );
	}

	void CJSManager::init( JSContext* cx, JSObject* obj )
	{
		m_pContext = cx;
		m_pGlobalObj = obj;

		m_pGlobalCallback = JS_NewObject( m_pContext, 0, 0, 0) ;
		jsval vp = OBJECT_TO_JSVAL(m_pGlobalCallback) ;
		JS_SetProperty( m_pContext, m_pGlobalObj, "globalCallback", &vp) ;

		JS_DefineFunctions( m_pContext, m_pGlobalObj, CJSManager::s_GlobleFunctions ) ;
		sp::CRenderNode::JSInit( m_pContext, m_pGlobalObj );
	}

    bool CJSManager::LoadScriptFromString(const char* jsstr)
    {
        jsval rval;
        uint32_t lineno = 0;
        JS_EvaluateScript(m_pContext, m_pGlobalObj, jsstr, ::strlen(jsstr), NULL, lineno, &rval) ;
        
        return true ;
    }

    bool CJSManager::LoadScriptFromFile(const char* jsfile)
    {
        
        strJsFileMap::iterator itr = m_JSFileTable.find( jsfile );
        if ( itr != m_JSFileTable.end() )
        {
            return true;
        }
		std::string content;
		content = CJSManager::ReadFile(jsfile);

		jsval rval;
		JS_EvaluateScript(m_pContext, m_pGlobalObj, content.c_str(), content.length(), jsfile, 1, &rval);

        m_JSFileTable.insert( strJsFileMap::value_type( jsfile, 1 ) );
        return true ;
    }

    void CJSManager::ExecuteShellToJS(const char* jsshell, const char* jsfile )
	{        
        std::string content;
        content = CJSManager::ReadFile(jsshell);
		
        jsval rval;
		JS_EvaluateScript(m_pContext, m_pGlobalObj, content.c_str(), content.length(), jsshell, 1, &rval);
        
		jsval argv[ 1 ];
		argv[ 0 ] = CSPProcess::SetupProcessObject(jsfile);
		JS_CallFunctionValue(m_pContext, m_pGlobalObj, rval, 1, argv, &rval);
	}
    
	std::string CJSManager::ReadFile( const char* name )
	{
		std::string jsPath = cocos2d::CCFileUtils::sharedFileUtils()-> fullPathFromRelativePath( name );
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
		FILE* file = fopen(jsPath.c_str(), "rb");
		if (file == NULL) 
		{
			printf( "ERROR ReadFile open file [ %s ]\n", name );
			return NULL;
		}

		fseek(file, 0, SEEK_END);
		int size = ftell(file);
		rewind(file);

		char* chars = new char[size + 1];
		chars[size] = '\0';
		for (int i = 0; i < size;) {
			int read = static_cast<int>(fread(&chars[i], 1, size - i, file));
			i += read;
		}
		fclose(file);
		std::string result = chars;
		delete[] chars;
		return result;
#endif
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
		cocos2d::CCString* pFileContent = cocos2d::CCString::createWithContentsOfFile(jsPath.c_str());
		if (pFileContent != NULL) {
			cocos2d::CCLog("read %s sus!\n", name);
		}
		std::string result = pFileContent->m_sString;
		return result;
#endif

	}

	JSBool CJSManager::JSPrint( JSContext* cx, uint32_t argc, jsval* vp )
	{
		if ( argc >= 1 ) 
		{
			int i = 0;
			JSString* jss;
			jsval* argv = JS_ARGV(cx, vp);
			for( i = 0; i < argc; ++i )
			{
				if( JS_ConvertArguments(cx, argc, &argv[ i ], "S", &jss ) == JS_TRUE )
				{

					char *str = JS_EncodeString(cx, jss);
					cocos2d::CCLog("Message from script environment : %s \n", str);
					JS_free(cx, str);
				}
			}
		}
		return JS_TRUE;
	}

	JSFunctionSpec CJSManager::s_GlobleFunctions[] = {
		JS_FN( "print", CJSManager::JSPrint, 1, 0),  
		JS_FS_END
	};
}












