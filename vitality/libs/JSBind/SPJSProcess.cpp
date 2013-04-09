
#include "SPJSProcess.h"


namespace SP_JSBind
{
#if defined(WIN32)
	#define PLATFORM		"win32"
#else
	#define PLATFORM		"ios"
#endif


	static JSObject* process = NULL;
	static JSObject* binding_cache = NULL;

	static JSBool Binding( JSContext* cx, uint32_t argc, jsval* vp )
	{
		JSObject* obj = CJSManager::Instance()->GetJSObject() ; 
		jsval* args = JS_ARGV( cx, vp );

		if( !JSVAL_IS_STRING( args[ 0 ] ) )
		{
			printf( "Binding Error args[ 0 ] is not string [ %s ]", JS_GetTypeName( cx, JS_TypeOfValue( cx, args[ 0 ] ) ) );
			return JS_FALSE;
		}

		JSString* module = JSVAL_TO_STRING( args[0] );
		char* module_v = JS_EncodeString(cx, module);

		if (NULL == binding_cache) 
		{
			binding_cache = JS_NewObject(cx, 0, 0, 0) ;
			jsval vp = OBJECT_TO_JSVAL(binding_cache) ;
			JS_SetPropertyById(cx, obj, OBJECT_TO_JSID(binding_cache), &vp) ;
		}

		jsval exports;
		JSBool hasMethod;

		if (JS_TRUE == JS_HasProperty(cx, binding_cache, module_v, &hasMethod)) 
		{
			JS_GetProperty(cx, binding_cache, module_v, &exports);
		}

		JSObject* pObj = JS_NewObject(cx, 0, 0, 0) ;
		std::string source = CJSManager::Instance()->ReadFile( module_v );
		jsval val = STRING_TO_JSVAL( JS_NewStringCopyZ( cx, source.c_str() ) );
		JS_SetProperty( cx, pObj, module_v, &val );

		exports = OBJECT_TO_JSVAL( pObj );
		JS_SetProperty( cx, binding_cache, module_v, &exports );

		JS_free( cx, module_v );
		JS_SET_RVAL(cx, vp, exports);
		return JS_TRUE;
	}

	static JSBool RunInThisContext( JSContext* cx, uint32_t argc, jsval* vp )
	{
		jsval* args = JS_ARGV( cx, vp );
		if ( argc < 2 ) 
		{
			printf( "RunInThisContext argc < 2  [ %d ]\n", argc );
			return JS_FALSE;
		}
		char* code = JS_EncodeString( cx, JSVAL_TO_STRING(args[0]) );

		char* filename = JS_EncodeString( cx, JSVAL_TO_STRING(args[ 1 ]));


		jsval result;

		JSObject* obj = CJSManager::Instance()->GetJSObject() ; 

		if( JS_FALSE == JS_EvaluateScript( cx, obj, code, strlen( code ), filename, 1, &result) )
		{
            printf("error RunInThisContext :\t %s\n", filename);
			return JS_FALSE;
        }

		JS_SET_RVAL(cx, vp, result);
		JS_free( cx, code );
		JS_free( cx, filename );
		return JS_TRUE;
	}

	CSPProcess::CSPProcess(void)
	{
	}

	CSPProcess::~CSPProcess(void)
	{
	}

	jsval CSPProcess::SetupProcessObject( const char* strName )
	{
		jsval result;
		JSContext* cx = CJSManager::Instance()->GetContext() ; 
		JSObject* obj = CJSManager::Instance()->GetJSObject() ; 
		process = JS_NewObject(cx, 0, 0, 0) ;

		jsval vp = OBJECT_TO_JSVAL(process) ;
		JS_SetPropertyById(cx, obj, OBJECT_TO_JSID(process), &vp) ;

		// process.platform
        jsval pl = STRING_TO_JSVAL( JS_NewStringCopyZ(cx, PLATFORM) );
		JS_SetProperty( cx, process, "platform", &pl );

		// process.argv
		jsval* arguments = new jsval[ 2 ];
		arguments[ 0 ] = STRING_TO_JSVAL( JS_NewStringCopyZ(cx, "app.js"));
		for ( int i = 1; i < 2; ++i )
		{
			arguments[ i ] = STRING_TO_JSVAL( JS_NewStringCopyZ(cx,strName ) );
		}
		JSObject* pObject = JS_NewArrayObject( cx, 2, arguments );
		jsval rval = OBJECT_TO_JSVAL( pObject );
		JS_SetProperty( cx, process, "argv", &rval );
		delete[] arguments;

		// process.binding
		JS_DefineFunction( cx, process, "binding", Binding, 0, JSPROP_READONLY | JSPROP_PERMANENT );

		// process.runInThisContext
		JS_DefineFunction( cx, process, "runInThisContext", RunInThisContext, 0, JSPROP_READONLY | JSPROP_PERMANENT );

		result = OBJECT_TO_JSVAL( process );
		return result;
	}


}