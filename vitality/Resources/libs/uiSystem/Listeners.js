//listenerType 0 : press
//listenerType 1 : move
//listenerType 2 : release
//listenerType 3 : selected
//listenerType 4 : unselected


var BaseListener = Class(aBase,
                         {
                         
                         onCreate : function(hdl){
                         this.handler = hdl;
                         this.listenerType = -1;
                         },
                         
                         handlerFunction : function(){
                         
                         }
                         
                         });

//universal=======================================================================================
var OnPushDownListener = Class(BaseListener,
                               {
                               
                               onCreate : function(hdl,hf){
                               this._super(hdl);
                               this.handlerFunction = hf;
                               this.listenerType = 0;
                               },
                               
                               //to be overrided
                               onPushDown : function(sender){
                               this.handlerFunction(sender,this.handler);
                               }
                               
                               });

var OnMoveListener = Class(BaseListener,
                           {
                           
                           onCreate : function(hdl,hf){
                           this._super(hdl);
                           this.handlerFunction = hf;
                           this.listenerType = 1;
                           },
                           
                           //to be overrided
                           onMove : function(sender){
                           this.handlerFunction(sender,this.handler);
                           }
                           
                           });

var OnReleaseUpListener = Class(BaseListener,
                                {
                                
                                onCreate : function(hdl,hf){
                                this._super(hdl);
                                this.handlerFunction = hf;
                                this.listenerType = 2;
                                },
                                
                                //to be overrided
                                onReleaseUp : function(sender){
                                this.handlerFunction(sender,this.handler);
                                }
                                
                                });

//universal=======================================================================================

//special=========================================================================================
var OnSelectedListener = Class(BaseListener,
                               {
                               
                               onCreate : function(hdl,hf){
                               this._super(hdl);
                               this.handlerFunction = hf;
                               this.listenerType = 3;
                               },
                               
                               //to be overrided
                               onSelected : function(sender){
                               this.handlerFunction(sender,this.handler);
                               }
                               
                               });

var OnUnSelectedListener = Class(BaseListener,
                                 {
                                 
                                 onCreate : function(hdl,hf){
                                 this._super(hdl);
                                 this.handlerFunction = hf;
                                 this.listenerType = 4;
                                 },
                                 
                                 //to be overrided
                                 onUnSelected : function(sender){
                                 this.handlerFunction(sender,this.handler);
                                 }
                                 
                                 });
//special=========================================================================================

