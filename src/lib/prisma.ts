import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "~/env";

const isDev = env.NODE_ENV == "dev";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: env.DATABASE_URL,
  }),
  log: isDev
    ? [
        { emit: "event", level: "query" },
        { emit: "event", level: "error" },
        { emit: "event", level: "info" },
      ]
    : [{ emit: "event", level: "error" }],
});

if (isDev) {
  prisma.$on("query", (e) => {
    console.log("Query:" + e.query);
    console.log("Params:" + e.params);
    console.log("Duration:" + e.duration + "ms");
  });
}

prisma.$on("error", (e) => {
  console.error("Prisma error:", e.message);
});

export default prisma;
