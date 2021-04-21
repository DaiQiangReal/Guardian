import { Context } from "koa";
import Koa from "koa";
import lodash from "lodash-es";
import Database from './Database';

type routeCallback = (ctx: Context) => void;

interface route {
  [key: string]: {
    url: string;
    method: string;
    callback: routeCallback;
  };
}

export default class Server {
  private server: Koa<Koa.DefaultState, Koa.DefaultContext>;
  readonly serverIP: string;
  readonly serverPort: number;
  readonly route: route;
  readonly database: Database;

  constructor(ip = "0.0.0.0", port = 3000) {
    this.server = new Koa();
    this.serverIP = ip;
    this.serverPort = port;
    this.route = {};
    this.database=new Database({databasePath:'./database.json'});
  }

  setRoute = (url: string, method: "get" | "post", callback: routeCallback) => {
    const route = this.route;
    route[url] = {
      ...route[url],
      [method]: (ctx: Context) => callback(ctx),
    };
  };

  private _router = async (ctx: Context) => {
    const route = this.route;
    const { request } = ctx;
    const path = request.path;
    const method = request.method.toLocaleLowerCase();
    const callback = lodash.get(route, [path, method], () => {});
    await callback(ctx);
  };

  start = (ip = this.serverIP, port = this.serverPort) => {
    this.server.use(async (ctx, next) => {
      await next();
      const rt = ctx.response.get("X-Response-Time");
      console.log(`${ctx.method} ${ctx.url} - ${rt}`);
    });

    this.server.use(async (ctx, next) => {
      const start = Date.now();
      await this._router(ctx);
      await next();
      const ms = Date.now() - start;
      ctx.set("X-Response-Time", `${ms}ms`);
    });

    this.server.listen(port, ip);
  };
}
