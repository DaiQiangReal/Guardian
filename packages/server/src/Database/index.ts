import fsExtra from 'fs-extra'
import path from 'path';
import lodash from 'lodash-es';

type basic = number | string | boolean;

interface Operation {
    id?: string;
    method: 'read' | 'write';
    target: string[] | string;
    value?: basic;
    callback?: (data: string) => any;

}

interface Config {
    databasePath: string,
    writeCacheSize?: number,
    writeCacheTime?: number,
    writeCacheDebounce?: number
}

class Database {
    private database: any;
    private readTaskMap: Map<string, Promise<any>>;
    private writeTaskMap: Map<string, Promise<any>>;
    private config: Config;
    private writeToDisk: Function;
    private writeToDiskPromise: PromiseLike<void>;
    private dirty: boolean;
    
    constructor(config: Config) {
        this.config = {
            writeCacheSize: 10,
            writeCacheTime: 1000,
            writeCacheDebounce: 1000,
            ...config
        }
        this.init(config.databasePath);
        this.readTaskMap = new Map();
        this.writeTaskMap = new Map();
        this.writeToDisk = lodash.throttle(this._writeToDisk, this.config.writeCacheDebounce)
        this.overrideMapSet();
        this.writeToDiskPromise = Promise.resolve();
        this.dirty=false;
    }

    private init = (databasePath: string) => {
        try {
            databasePath=path.resolve(databasePath);
            if(!fsExtra.existsSync(databasePath)){
                fsExtra.writeJSONSync(databasePath,{});
            }
            const database = fsExtra.readJSONSync(path.resolve(databasePath));
            this.database = database;
            setInterval(()=>this.writeToDisk(),this.config.writeCacheTime);
            console.log('Loading database file success.\n\n');

        } catch (e) {
            throw `Error: failed to load database files, target path is ${databasePath} .\n\n ${e}`;
        }
    }

    public do = (operation: Operation) => {
        operation.id = `${new Date().getTime()}_${operation.method}_${operation.target}`;

    }

    public read = async (target: string | string[]) => {
        const id = `${new Date().getTime()}_read_${target}`;
        return await new Promise((resolve) => {
            this.createReadProcess({ id, method: 'read', target, callback: resolve })
        })
    }

    public write = async (target: string | string[], value: basic) => {
        const id = `${new Date().getTime()}_write_${target}`;
        this.createWriteProcess({ id, method: 'write', target, value })
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
        const { id, target } = operation;
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
                        this.dirty=true;
                        this.writeToDisk();
                    }
           
                return true;
            }
        })
    }

    private _writeToDisk = async () => {
        if(this.dirty){
            const { databasePath } = this.config;
        this.writeToDiskPromise.then(async ()=>await fsExtra.writeJSON(databasePath, this.database));
        this.dirty=false;
        }
        
    }



    public exit = async () => {
        await this.writeToDiskPromise;
    }

}

export default Database;