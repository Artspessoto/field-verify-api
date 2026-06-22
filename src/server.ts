import { app } from "./app.js";
import { env } from "./env/index.js";

const start = () => {
  try {
    app
      .listen({
        host: "0.0.0.0",
        port: env.PORT,
      })
      .then(() => app.log.info(`HTTP Server Running on port ${env.PORT}`));
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
