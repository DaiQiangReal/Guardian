import Database from './Database';
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

class UserContext{
    readonly database: Database;
    readonly ws: WebSocket;
    private subscribedKey:any[];
    readonly avaliableFuncs: {[key:string]:Function};
    constructor(database:Database,ws:WebSocket) {
        this.database=database;
        this.ws=ws;
        this.subscribedKey=[];
        this.avaliableFuncs={
            subscribe:this.subscribe,
        }
        this.init();
    }

    private init=()=>{
        this.ws.addEventListener('message',(e)=>{
            let msgObj=JSONparse(e.data);    
            const {method,data}=msgObj;               
            const methodFunc:Function=lodash.get(this.avaliableFuncs,method,()=>{});
            methodFunc(data);
        })
        const listenerCancelCallback=this.database.addDataChangedListener(this.onDataChanged);
        this.ws.addEventListener('close',listenerCancelCallback);
    }

    private subscribe=(subscribedKey:any[])=>{
        this.subscribedKey=subscribedKey;
    }


    private onDataChanged=(data:any,target:string|string[],value:basic)=>{

        console.log(target,this.subscribedKey);

        if(Array.isArray(target)){
            target=target.join('.');
        }
            
        for(let key of this.subscribedKey){
            if(target.indexOf(key)!==-1){
                this.sendChangedMessage(target,value);
                break;
            }

        }
        

    }

    private sendChangedMessage=(target:string|string[],value:basic)=>{
        const dataNeedSend={
            method:'onDataChanged',
            data:{
                target,
                value
            }
        }
        this.ws.send(JSON.stringify(dataNeedSend));
    }

}

export default UserContext;