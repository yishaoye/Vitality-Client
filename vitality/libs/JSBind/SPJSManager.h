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

#ifndef _JSBIND_JSMANAGER_H_CC_
#define _JSBIND_JSMANAGER_H_CC_

#include <stdio.h>
#include <string>
#include <stdarg.h>
#include <assert.h>
#include <list>
#include <vector>
#include <map>

#include "jsapi.h"

/**
 *	@brief	jsbind namespace. use spidermonkey js engine.
 */
namespace SP_JSBind 
{
	typedef std::map<std::string,int> strJsFileMap;

	bool  ExecuteJSFunctionFromName( const char* strFunction );

	bool  ExecuteJSFunctionFromName( const char* strFunction, uint32_t argc, jsval *argv );

/**
 *	@brief	jsbind manager class.
 */
class CJSManager
{
public:
	CJSManager();
	~CJSManager(void);
    /**
     *	@brief	singleton mode.
     *
     *	@return	return jsmanager pointer.
     */
    static CJSManager* Instance();


	static void InitJSManager( JSContext* cx, JSObject* obj );

	void init( JSContext* cx, JSObject* obj );
    /**
     *	@brief	execute script from string.
     *
     *	@param 	jsstr 	script string.
     *
     *	@return	true.
     */
    bool LoadScriptFromString(const char* jsstr);
   
    /**
     *	@brief	execute script from jsfile.
     *
     *	@param 	jsfile 	js filename.
     *
     *	@return	true.
     */
    bool LoadScriptFromFile(const char* jsfile);

    /**
     *	@brief	execute script from jsfile.
     *
     *	@param 	jsfile 	js filename.
     *
     *	@return	true.
     */
    void ExecuteShellToJS(const char* jsshell, const char* jsfile );
    
    /**
     *	@brief	execute script from jsfile.
     *
     *	@param 	jsfile 	js filename.
     *
     *	@return	true.
     */
     std::string ReadFile( const char* name );

    /**
     *	@brief	get js context.
     *
     *	@return	js context.
     */
    JSContext* GetContext() { return m_pContext ; } ;
    /**
     *	@brief	get js global object.
     *
     *	@return	js global object.
     */
    JSObject*  GetJSObject()  { return m_pGlobalObj ; } ;
//    JSObject*  GetJSObject()  { return m_pSweetPome ; } ;
     /**
     *	@brief	get js global callback object.
     *
     *	@return	js global object.
     */
    JSObject*  GetCallbackObj()  { return m_pGlobalCallback ; } ;
public:

	static JSBool JSPrint( JSContext* cx, uint32_t argc, jsval* vp );

	static JSFunctionSpec		s_GlobleFunctions[];
   
private:
    /**
     *	@brief	js Context.
     */
    JSContext*    m_pContext ;
    /**
     *	@brief	js Globle Object.
     */
    JSObject*     m_pGlobalObj ;
     /**
     *	@brief	js SweetPome Object.
     */   
    JSObject*     m_pGlobalCallback ;
	/**
	 *	@brief	js file table.
	 */
	strJsFileMap		m_JSFileTable;
private:	
    static CJSManager* s_pManager ;
} ;
}

#endif


















