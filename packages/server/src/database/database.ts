import fsExtra from 'fs-extra'
import path from 'path';
import lodash from 'lodash';

interface Operation{
    method:'read'|'write';
    target:string[]|string;
    value?:string;
    callback?:(data:string)=>any;
}

interface Config{
    databasePath:string,
    writeCacheSize?:number,
    writeCacheTime?:number,
    maxReadProcess?:number,
    maxWriteProcess?:number,
}

class Database{
    private database: any;
    private taskList: Promise<void>[];
    private config:Config;
    dirty: boolean;
    constructor(config:Config) {
        this.config={
            writeCacheSize:10,
            writeCacheTime:1000,
            maxReadProcess:100,
            maxWriteProcess:100,
            ...config
        }
        this.init(config.databasePath);
        this.taskList=[];
        this.dirty=false;
    }

    private init=(databasePath: string)=>{
        try{
            const database=fsExtra.readJSONSync(path.resolve(databasePath));
            this.database=Database;
            console.log('Loading database file success.');

        }catch(e){
            throw `Error: failed to load database files, target path is ${databasePath} .\n\n ${e}`;
        }
    }

    public do=(operation:Operation)=>{
    
    }

    private createReadProcess=(target:string[]|string,callback:Function)=>{
        const task=new Promise<void>((resolve)=>{
            const data=lodash.get(this.database,target,null);
            callback(data);
            resolve();
        });
        this.taskList.push(task);
    }


    private createWriteProcess=(operation:Operation)=>{
        const task=new Promise<void>((resolve)=>{
            const {target,callback}=operation;
            const value=lodash.get(operation,'value',null);
            if(!value){
                return;
            }
            lodash.set(this.database,target,value);
            resolve();
        });
        this.taskList.push(task);
    }

    
}