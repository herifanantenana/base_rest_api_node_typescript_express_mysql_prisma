import { PrismaClient } from "@prisma/client";
import express, { Express } from "express";
import rootRouter from "./routes";
import { PORT } from "./secrets";
import { errorMiddleware } from "./middlewares/errors";

const app: Express = express();
app.use(express.json());

export const prismaClient = new PrismaClient({
	log: ["query", "error", "warn", "info"],
});

app.use("/api", rootRouter());

app.use(errorMiddleware);
app.listen(PORT, () => console.log("Start"));
