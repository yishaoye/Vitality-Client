var ListenerFactory = Class(aBase,
                            {
                            
                            onCreate : function(){
                            
                            },
                            
                            createListenerWithType : function(type,handler,callBack){
                            switch(type){
                            case 0:
                            return new OnPushDownListener(handler,callBack);
                            break;
                            case 1:
                            return new OnMoveListener(handler,callBack);
                            break;
                            case 2:
                            return new OnReleaseUpListener(handler,callBack);
                            break;
                            case 3:
                            return new OnSelectedListener(handler,callBack);
                            break;
                            case 4:
                            return new OnUnSelectedListener(handler,callBack);
                            break;
                            }
                            }
                            
                            });

var gListenerFactory = new ListenerFactory();