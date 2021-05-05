import lodash from 'lodash-es';

type basic = number | string | boolean;

const JSONparse=(string:string)=>{
    try{
        return JSON.parse(string);
    }catch(e){
        console.error(`Error: ${string} can't parse to object.`);
        return {}
    }
}

export default class WebsocketListener{
    private readonly ws: WebSocket;
    private subscribedKey:any;
    readonly avaliableFuncs: {[key:string]:Function};
    constructor(url:string) {
        let websocketServerUrl=url;
        if(/^ws/.test(websocketServerUrl)){
            websocketServerUrl='ws://'+websocketServerUrl;
        }
        this.ws=new WebSocket(url); 
        this.avaliableFuncs={
            oNDataChanged:this.onDataChanged,
        }
        this.init();
    }

    private init=()=>{
        this.ws.addEventListener('message',(e)=>{
            const msgObj=JSONparse(e.data);
            const {method,data}=msgObj;
            const methodFunc:Function=lodash.get(this.avaliableFuncs,method,()=>{});
            methodFunc(data);
        })
    }


    onDataChanged=({target,value})=>{
        console.log('websocket',target,value);
        
    }
}