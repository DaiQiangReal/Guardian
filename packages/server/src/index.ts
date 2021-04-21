import { Context } from "koa";
import Server from "./server";
import lodash from "lodash-es";

(async () => {
  const server = new Server(null, 3000);

  

  server.setRoute("/test", "get", (ctx:Context) => {
    ctx.response.body = JSON.stringify(ctx, null, " ");
  });

  server.setRoute("/get","get",async (ctx:Context)=>{
    const {query}=ctx.request;
    const data=await server.database.read(query.target);
    if(data){
      ctx.response.body=data
    }else{
      ctx.response.status=404
    }
    
  })

  server.setRoute("/set","post",async (ctx:Context)=>{
    let queryStr="";
    ctx.req.on('data',(data)=>queryStr+=data);
    await new Promise<void>((resolve)=>{
      ctx.req.on('end',()=>{   
        resolve();
      })
    })
    const queryObject=lodash.fromPairs(queryStr.split('&').map(singleQueryStr=>singleQueryStr.split('=')));
    ctx.response.body=queryObject;
  })

  server.start();
})();
