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
    readonly avaliableFuncs: {[key:string]:Function};
    private promise:Promise<void>;
    private onDataChangedInProps: Function;
    constructor(url:string) {
        let websocketServerUrl=url;
        if(!/^ws/.test(websocketServerUrl)){
            websocketServerUrl='ws://'+websocketServerUrl;
        }
        this.ws=new WebSocket(websocketServerUrl); 
        this.promise=new Promise(resolve=>{
            this.ws.onopen=()=>{
                resolve();
            }
        })
        
        this.avaliableFuncs={
            onDataChanged:this.onDataChanged,
        }
        this.init();
    }

    subscribe=(subscribedKey:any[])=>{
        this.promise.then(()=>{
            this.ws.send(JSON.stringify({
                method:'subscribe',
                data:subscribedKey
            }));
        })

    }

    private init=()=>{
        this.ws.addEventListener('message',(e)=>{
            const msgObj=JSONparse(e.data);
            console.log('message',msgObj);
            
            const {method,data}=msgObj;
            const methodFunc:Function=lodash.get(this.avaliableFuncs,method,()=>{});
            methodFunc(data);
        })
    }


    close=()=>{
        this.ws.close();
    }

    setDataChangeListener=(callback)=>{
        this.onDataChangedInProps=callback;
        console.log('callback',callback);
        
    }

    onDataChanged=({target,value})=>{
        this.onDataChangedInProps(target,value)
    }
}