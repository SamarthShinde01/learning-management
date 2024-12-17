import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as dynamoose from "dynamoose";
import { createClerkClient } from "@clerk/express";

/* ROUTES IMPORTS */
import courseRoutes from "./routes/courseRoutes";
import userClerkRoutes from "./routes/userClerkRoutes";

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
	dynamoose.aws.ddb.local();
}

export const clerkClient = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY,
});

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.use("/courses", courseRoutes);
app.use("/users/clerk", userClerkRoutes);

const PORT = process.env.PORT || 3000;

if (!isProduction) {
	app.listen(PORT, () => console.log("server running on PORT ", PORT));
}
