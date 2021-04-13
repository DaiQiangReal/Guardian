import Server from "./server";

(async () => {
  const server = new Server(null, 3000);
  server.setRoute("/test", "get", (ctx) => {
    ctx.response.body = JSON.stringify(ctx, null, " ");
  });
  server.start();
})();
