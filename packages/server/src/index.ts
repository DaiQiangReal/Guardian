import { Context } from "koa";
import Server from "./server";
import lodash, { indexOf } from "lodash-es";
import UserContext from './userContext';
(async () => {
  const server = new Server(null, 3000);



  server.setRoute("/test", "get", (ctx: Context) => {
    ctx.response.body = JSON.stringify(ctx, null, " ");
  });


  server.setRoute("/get", "get", async (ctx: Context) => {
    const { query } = ctx.request;
    let data=null;
  
    if(query.target){
      data = await server.database.read(query.target);
    }else{
      data = await server.database.read('*');
    }
    

    if (data) {
      ctx.response.body = data
    } else {
      ctx.response.status = 404
    }

  })

  const safeParse=(objString:string)=>{
      try{
          return JSON.parse(objString);
      }catch(e){
        return {};
      }
  }

  const safeDecodeUri=(value:unknown):any=>{
      if(Array.isArray(value)){
          return value.map(v=>safeDecodeUri(v));
      }else  if(typeof value === 'string'){
        return decodeURI(value);
      }else{
          return value;
      }
  }

  server.setRoute("/set", "post", async (ctx: Context) => {
    let queryStr = "";
    ctx.req.on('data', (data) => queryStr += data);
    await new Promise<void>((resolve) => {
      ctx.req.on('end', () => {
        resolve();
      })
    })
    const queryObject = lodash.fromPairs(queryStr.split('&').map(singleQueryStr => singleQueryStr.split('=')));
    
    let { target, value } = queryObject;
    if(!target&&!value){
        const trueQueryObject=safeParse(Object.keys(queryObject)[0]);
        target=trueQueryObject.target;
        value=trueQueryObject.value;
    }
    if (!target || !value) {
      ctx.response.body = `Error: set require target && value`;
      ctx.response.status = 404;
    } else {
      server.database.write(decodeURI(target), safeDecodeUri(value));
      ctx.response.body = queryObject;
      ctx.response.status=200;
    }

  })

  server.setWsRoute('/',async (ctx)=>{
    const ws:WebSocket=await ctx.ws();
    new UserContext(server.database,ws);
  })

  server.start();
})();
