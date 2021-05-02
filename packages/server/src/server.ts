import { Context, ParameterizedContext } from "koa";
import Koa from "koa";
import lodash from "lodash-es";
import Database from './Database';
import websocket from 'koa-easy-ws';

type routeCallback = (ctx: Context) => void;

interface route {
  [key: string]: {
    url: string;
    method: string;
    callback: routeCallback;
  };
}

interface wsRoute {
  [key: string]:routeCallback;
}

export default class Server {
  private server: Koa<Koa.DefaultState, Koa.DefaultContext>;
  readonly serverIP: string;
  readonly serverPort: number;
  readonly route: route;
  readonly wsRoute: wsRoute;
  readonly database: Database;

  constructor(ip = "0.0.0.0", port = 3000) {
    this.server = new Koa();
    this.serverIP = ip;
    this.serverPort = port;
    this.route = {};
    this.wsRoute={};
    this.database=new Database({databasePath:'./database.json'});
  }

  setRoute = (url: string, method: "get" | "post", callback: routeCallback) => {
    const route = this.route;
    route[url] = {
      ...route[url],
      [method]: (ctx: Context) => callback(ctx),
    };
  };

  setWsRoute=(url:string,callback:routeCallback)=>{
    const wsRoute=this.wsRoute;
    wsRoute[url]=(ctx:Context)=>callback(ctx);
  }

  private _router = async (ctx: ParameterizedContext) => {
    const route = this.route;
    const { request } = ctx;
    const path = request.path;
    const method = request.method.toLocaleLowerCase();
    const callback = lodash.get(route, [path, method], () => {});
    await callback(ctx);
  };

  private _wsRouter=async (ctx:ParameterizedContext)=>{
    const wsRoute=this.wsRoute;
    const {request}=ctx;
    const path=request.path;
    const callback=lodash.get(wsRoute,path,()=>{});
    await callback(ctx);

  }

  start = (ip = this.serverIP, port = this.serverPort) => {
    // this.server.use(async (ctx, next) => {
    //   await next();
    //   const rt = ctx.response.get("X-Response-Time");
    //   console.log(`${ctx.method} ${ctx.url} - ${rt}`);
    // });

    this.server.use(websocket());

    this.server.use(async (ctx:Context, next) => {
      const start = Date.now();
      if(ctx.ws){
        await this._wsRouter(ctx);
        return;
      }else{
        await this._router(ctx);
      }
      await next();
      const ms = Date.now() - start;
      ctx.set("X-Response-Time", `${ms}ms`);
    });


    this.server.listen(port, ip);
  };
}
