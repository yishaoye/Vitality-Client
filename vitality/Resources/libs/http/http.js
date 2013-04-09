

var http = null;
var requestMgr = [];

var exp = module.exports;
/**
* 
*/

exp.init = function( opts ){

	opts = opts || {};

	http = http_new();
	print( 'http' );

	// 设置文件存储路径
	var downPath = opts.downPath || 'c:\\';			
	http.setFileSavePath( downPath );
	
	// 是否断点续传
	var allowResumeForFilleDownloads = opts.allowResumeForFilleDownloads || false;	
	http.setAllowResumeForFileDownloads( allowResumeForFilleDownloads );

	// 申请连接延迟;  默认 15秒
	var connectTimeOut = opts.connectTimeOut || 15;	
	http.setConnectTimeOut( connectTimeOut );

	// 下载断线重连超时; 默认 3600秒
	var downTimeOut = opts.downTimeOut || 3600;		
	http.setTimeOut( downTimeOut );                   

	// 设置http头信息
	var headers = opts.headers || { Content_Len: 1024, User_Agent : '' };			
	for ( items in headers ){						
		 var str = items + ':' + headers[items];
		 http.addHeader( str );      				
	}

};

exp.request = function( opts, onRequest,onUpProgress,onError ){
	print("opts host:["+opts.host+"]\n");
	if( onRequest == null ) return null;
	var req = {};
	req.option = opts;
	req.onRequest = onRequest;
	req.onUpProcess = onUpProgress;
	req.onError = onError;

	var host = opts.host;
	var query = opts.query;
	var action = opts.action;
	var info = opts.info;
	var postdata = opts.postdata;

	switch( opts.method )
	{
	case 'GET':
	  if( !host || !action || !info ) return null;
	  http.addGetRequest( host,query,action,info );
	  break;
	case 'POST':
	  http.initPostData();

	  if( !host || !action || !info || !postdata ) return null;
	  var len = 0;
	  for (items in opts.postdata){
		  http.addPostData(items,postdata[items]);
		  len++;
	  }
	  if( len == 0 ) return null;
	  http.addPostRequest( host,action,info );
	  break;
	case 'DOWN':
	   if( !host || !action || !onUpProgress ) return null;
	   http.addDownloadRequest( host,action );
	   break;
	default:
	  return null;
	}            
	requestMgr[action] = req;
	return requestMgr[action];
};

exp.processRequest = function( action,data,error ){
	var req = requestMgr[action];
	req.onRequest( req.option,data,error );
};

exp.progress = function( action,amount,filename ){
	var req = requestMgr[action];
	req.onUpProcess(action, amount, filename, http.getDownSpeed());
};

exp.setFileSavePath = function( downPath ){
	downPath = downPath || '';			
	http.setFileSavePath( downPath );
};






// 注册 http 回调函数
globalCallback.httpCallback = function ( action,info,data,isdown )
{

    //--true 说明 这是下载资源成功后返回的
    if( isdown )
    {
        //--action作用协议
        //--这里info是 资源文件名字
 	 	//--这里data是下载资源后资源的绝对路径
        switch(action)
        {
            //--通过json列表下载完资源后会调发这个协议--
            case "json_ResorceDownSuccess":httpResorceDownSuccess();break;
            case "json_Download": httpDownload();break;
        }
        exp.processRequest( action,info,0 );
    }
    else
    {
        print( data );
        //--把json格式的数据放在对象里 用
        var obj = new Function("return" + data)();
        exp.processRequest( action,obj,0 );
    }
};

//--错误回调--
globalCallback.httpError = function( action,info,errortype )
{
    exp.processRequest( action,info,errortype );
};

//--下载更新进度--
globalCallback.httpUpdateProgress = function( action,filename,amount )
{
//    print("httpUpdateProgress amount["+ amount+"] filename["+filename+"] action["+action+"]");
    exp.progress( action,amount,filename );
};

//--通过js列表下载资源的时候 所有资源下载完毕会调用次函数--
globalCallback.httpResorceDownSuccess = function ()
{
    print("====Download Success=======\n");
};



