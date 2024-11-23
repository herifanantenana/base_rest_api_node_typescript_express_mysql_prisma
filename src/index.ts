import { PrismaClient } from "@prisma/client";
import express, { Express } from "express";
import { errorMiddleware } from "./middlewares/errors";
import rootRouter from "./routes";
import { PORT } from "./secrets";

const app: Express = express();
app.use(express.json());

export const prismaClient = new PrismaClient({
	log: ["query", "error", "warn", "info"],
}).$extends({
	result: {
		address: {
			formattedAddress: {
				needs: { lineOne: true, lineTwo: true, city: true, country: true, pincode: true },
				compute: (addr) => `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`
			}
		}
	}
});

app.use("/api", rootRouter);

app.use(errorMiddleware);
app.listen(PORT, () => console.log("Start"));
