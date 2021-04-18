import fsExtra from 'fs-extra'
import path from 'path';
import lodash from 'lodash';

interface Operation {
    id?: string;
    method: 'read' | 'write';
    target: string[] | string;
    value?: !Object;
    callback?: (data: string) => any;

}

interface Config {
    databasePath: string,
    writeCacheSize?: number,
    writeCacheTime?: number,
    writeCacheDebounce?:number
}

class Database {
    private database: any;
    private readTaskMap: Map<string, Promise<any>>;
    private writeTaskMap: Map<string, Promise<any>>;
    private config: Config;
    private writeToDisk:Function;
    constructor(config: Config) {
        this.config = {
            writeCacheSize: 10,
            writeCacheTime: 1000,
            writeCacheDebounce:1000,
            ...config
        }
        this.init(config.databasePath);
        this.readTaskMap = new Map();
        this.writeTaskMap = new Map();
        this.writeToDisk=lodash.debounce(this._writeToDisk,this.config.writeCacheDebounce)
        this.overrideMapSet();
    }

    private init = (databasePath: string) => {
        try {
            const database = fsExtra.readJSONSync(path.resolve(databasePath));
            this.database = Database;
            console.log('Loading database file success.');

        } catch (e) {
            throw `Error: failed to load database files, target path is ${databasePath} .\n\n ${e}`;
        }
    }

    public do = (operation: Operation) => {
        operation.id = `${new Date().getTime()}_${operation.method}_${operation.target}`;

    }

    public read=async (target:string|string[])=>{
        const id = `${new Date().getTime()}_read_${target}`;
        return await new Promise((resolve)=>{
            this.createReadProcess({id,method:'read',target,callback:resolve})
        })
    }

    public write=async (target:string|string[],value:!Object)=>{
        const id = `${new Date().getTime()}_write_${target}`;
        this.createWriteProcess({id,method:'write',target,value})
    }

    private createReadProcess = (operation: Operation) => {
        const { id, target, callback } = operation;
        const task = new Promise<void>((resolve) => {
            const data = lodash.get(this.database, target, null);
            callback(data);
            resolve();
        }).then(() => this.readTaskMap.delete(id));
        this.readTaskMap.set(id, task);
        return task;
    }


    private createWriteProcess = (operation: Operation) => {
        const { id, target} = operation;
        const task = new Promise<void>((resolve) => {
            const value = lodash.get(operation, 'value', null);
            if (!value) {
                resolve();
            }
            lodash.set(this.database, target, value);
            resolve();
        }).then(() => this.writeTaskMap.delete(id));
        this.writeTaskMap.set(id, task);
        return task;
    }

    private overrideMapSet = () => {
        const self = this;
        const database = this.database;
        let cacheSize = 0;
        new Proxy(database, {
            set: (target, key, value) => {
                target[key] = value;
                cacheSize++;
                if (cacheSize > self.config.writeCacheSize) {
                    cacheSize = 0;
                    this.writeToDisk();
                }
                return true;
            }
        })
    }

    private _writeToDisk = async () => {
        const { databasePath } = this.config;
        await fsExtra.writeJSON(databasePath, this.database);
    }



    public exit = async () => {
        await this._writeToDisk();
    }

}