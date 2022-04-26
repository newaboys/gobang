export default function(){
    let ws = null;
    let env = import.meta.env;
    return {
        getWs:function(){
            return ws;
        },
        cmdDispatch:function(){

        },
        onOpen:function(e){
            console.log("我是客户端，onOpen",e);
        },
        onClose:function(e){
            console.log("我是客户端,onClose",e);
        },
        onMessage:function(e){
            console.log("我是客户端,onMessage",e);
        },
        onError:function(e){
            console.log("我是客户端,onError",e);
        },
        send:function(e){
            console.log("我是客户端,send",e);
            ws.send(JSON.stringify(e));
        },
        getUUID:function(){
        },
        init:function(ops){
            ws = new WebSocket("ws://"+env.VITE_WEBSOCKET_HOST+":"+env.VITE_WEBSOCKET_PORT+"/"+env.VITE_WEBSOCKET_SUFFIX);
            ws.onclose = this.onClose;
            ws.onerror = this.onError;
            ws.onmessage= ops.onMessage||this.onMessage;
            ws.onopen = ops.onOpen||this.onOpen;
            return this;
        }
    }

}